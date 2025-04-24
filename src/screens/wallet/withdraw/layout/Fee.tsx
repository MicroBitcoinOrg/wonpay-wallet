import React, {useContext, useState} from 'react';
import {HStack, Text} from '../../../../components/common';
import {FormItem, IconButton, Input} from '../../../../components/extended';
import {useTranslation} from 'react-i18next';
import Config from 'react-native-config';
import {useColorScheme} from 'react-native';
import {WalletContext} from '../../../../providers';

interface FeeProps {
    fee: string;
    setFee: any;
}

const Fee = ({fee, setFee}: FeeProps) => {
    const scheme = useColorScheme();
    const [isFeeEnabled, setIsFeeEnabled] = useState(false);
    const {t} = useTranslation('withdraw');
    const {wallet} = useContext(WalletContext);

    const checkFee = (text: string) => {
        const regex = /^[0-9]{0,100}([.,][0-9]{0,8})?$/;

        if (regex.test(text)) setFee(text.replace(',', '.'));
    };

    return (
        <FormItem title={t('fee.title')} optional>
            <Input
                placeholder={t('fee.placeholder')}
                rightContent={
                    <HStack>
                        <Text variant="body1">
                            {
                                wallet?.balances.find(b => b.main)?.currency
                                    .ticker
                            }
                        </Text>
                        <IconButton
                            name={
                                isFeeEnabled
                                    ? 'lock-open-outline'
                                    : 'lock-closed-outline'
                            }
                            iconSet="ionicons"
                            color={
                                scheme === 'dark' ? 'textPrimary' : 'primary'
                            }
                            transparent
                            onPress={() => setIsFeeEnabled(!isFeeEnabled)}
                        />
                    </HStack>
                }
                onChangeText={text => checkFee(text)}
                value={fee}
                editable={isFeeEnabled}
                keyboardType="numeric"
            />
        </FormItem>
    );
};

export default Fee;
