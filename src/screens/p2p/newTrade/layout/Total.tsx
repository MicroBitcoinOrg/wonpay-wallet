import React from 'react';
import {StyleSheet} from 'react-native';
import {VStack, Text, HStack} from '@/components/common';
import {useTranslation} from 'react-i18next';
import {NumericFormat} from 'react-number-format';
import {CryptoOfferResponse, SideEnum} from '@/services/mex/api/types';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface TotalProps {
    amount: string;
    offer: CryptoOfferResponse;
}

const Total = ({amount, offer}: TotalProps) => {
    const {t} = useTranslation('p2p');

    const calculateTotal = () => {
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount)) {
            return 0;
        }
        return offer.side === SideEnum.BUY
            ? numAmount / offer.price
            : numAmount * offer.price;
    };

    return (
        <HStack justifyContent="space-between" style={{width: '100%'}}>
            <Text variant="body1">{t('newTrade.total.youReceive')}</Text>
            <NumericFormat
                displayType="text"
                value={calculateTotal()}
                decimalScale={2}
                prefix="+"
                suffix={` ${offer.offeror_currency.currency}`}
                thousandSeparator
                fixedDecimalScale
                renderText={value => (
                    <Text variant="body1" color="success">
                        {value}
                    </Text>
                )}
            />
        </HStack>
    );
};

export default Total;
