import React, {useContext} from 'react';
import {HStack, Text} from '../../../../components/common';
import {Button, FormItem, Input} from '../../../../components/extended';
import {useTranslation} from 'react-i18next';
import Config from 'react-native-config';
import {WalletContext} from '../../../../providers';
import {useColorScheme} from 'react-native';

interface AmountProps {
    address: string;
    amount: string;
    fee: string;
    balance: Wallet.Balance;
    setAmount: any;
}

const Amount = ({amount, fee, address, balance, setAmount}: AmountProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('withdraw');
    const {wallet} = useContext(WalletContext);

    const checkAmount = (text: string) => {
        const regex = /^[0-9]{0,100}([.,][0-9]{0,8})?$/;
        if (regex.test(text)) setAmount(text.replace(',', '.'));
    };

    const setMax = () => {
        const max =
            balance.balance / 10 ** balance.currency.units -
            (balance.main ? parseFloat(fee) : 0);

        checkAmount(String(max.toFixed(balance.currency.units)));
    };

    return (
        <FormItem title={t('amount.title')}>
            <Input
                placeholder={t('amount.placeholder')}
                autoFocus={address !== undefined && address !== ''}
                rightContent={
                    <HStack>
                        <Text variant="body1">{balance.currency.ticker}</Text>
                        <Button
                            title="Max"
                            type="text"
                            color={
                                scheme === 'dark' ? 'textPrimary' : 'primary'
                            }
                            onPress={setMax}
                        />
                    </HStack>
                }
                onChangeText={text => checkAmount(text)}
                value={amount}
                keyboardType="numeric"
            />
        </FormItem>
    );
};

export default Amount;
