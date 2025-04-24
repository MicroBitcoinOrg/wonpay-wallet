import React, {useContext} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Coin, HStack, Text, VStack} from '../../../../components/common';
import {Colors} from '../../../../theme';
import NumberFormat from 'react-number-format';
import {WalletContext} from '../../../../providers';

const styles = StyleSheet.create({
    inputContainer: {},
});

interface TotalProps {
    amount: string;
    fee: string;
    balance: Wallet.Balance;
}

const Total = ({amount, fee, balance}: TotalProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('withdraw');
    const {wallet} = useContext(WalletContext);

    return (
        <VStack alignItems="flex-start" flex={1} style={styles.inputContainer}>
            <Text variant="body1">{t('totalSend')}</Text>
            <HStack justifyContent="flex-start" alignItems="flex-end">
                <NumberFormat
                    displayType="text"
                    value={
                        parseFloat(
                            !amount ||
                                amount === '' ||
                                amount === '.' ||
                                amount === ','
                                ? '0'
                                : amount,
                        ) +
                        (!balance.main ? 0 : fee === '' ? 0 : parseFloat(fee))
                    }
                    decimalScale={4}
                    suffix={` ${balance.currency.ticker}`}
                    thousandSeparator
                    fixedDecimalScale
                    renderText={value => (
                        <Text variant="h2" numberOfLines={1}>
                            {value}
                        </Text>
                    )}
                />
            </HStack>
            <Text variant="sub1" opacity={0.5}>
                {t('transactionFee', {
                    coin: wallet?.balances.find(b => b.main)?.currency.ticker,
                    balance: parseFloat(!balance.main ? '0.005' : fee).toFixed(
                        4,
                    ),
                })}
            </Text>
        </VStack>
    );
};

export default Total;
