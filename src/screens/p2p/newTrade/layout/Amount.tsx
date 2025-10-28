import React from 'react';
import {HStack, Text} from '@/components/common';
import {Button, FormItem, Input} from '@/components/extended';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native';
import {CryptoOfferResponse} from '@/services/mex/api/types';

interface AmountProps {
    amount: string;
    offer: CryptoOfferResponse;
    setAmount: (value: string) => void;
}

const Amount = ({amount, offer, setAmount}: AmountProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');

    const checkAmount = (text: string) => {
        const regex = /^[0-9]{0,100}([.,][0-9]{0,8})?$/;
        if (regex.test(text)) setAmount(text.replace(',', '.'));
    };

    const setMax = () => {
        const available = offer.quantity - offer.filled;
        const maxByLimit = offer.limit_max / offer.price;
        const max = Math.min(available, maxByLimit);

        checkAmount(String(max.toFixed(8)));
    };

    const getAmountError = () => {
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount)) {
            return null;
        }

        const available = offer.quantity - offer.filled;
        if (numAmount > available) {
            return t('newTrade.amount.errors.exceedsAvailable');
        }

        const tradeValue = numAmount * offer.price;
        if (tradeValue < offer.limit_min) {
            return t('newTrade.amount.errors.belowMinLimit', {
                min: offer.limit_min.toFixed(2),
                currency: offer.side_currency.currency,
            });
        }

        if (tradeValue > offer.limit_max) {
            return t('newTrade.amount.errors.aboveMaxLimit', {
                max: offer.limit_max.toFixed(2),
                currency: offer.side_currency.currency,
            });
        }

        return null;
    };

    const error = getAmountError();

    return (
        <FormItem
            title={t('newTrade.amount.title')}
            description={
                error ? (
                    <Text variant="sub1" color="error">
                        {error}
                    </Text>
                ) : undefined
            }>
            <Input
                placeholder={t('newTrade.amount.placeholder')}
                autoFocus
                rightContent={
                    <HStack>
                        <Text variant="body1">
                            {offer.trader_currency.currency}
                        </Text>
                        <Button
                            title={t('newTrade.amount.max')}
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
