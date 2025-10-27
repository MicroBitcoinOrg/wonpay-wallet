import React, {useContext} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Coin, HStack, Text, VStack} from '@/components/common';
import {Colors} from '@/theme';
import {NumericFormat} from 'react-number-format';
import {useWallet, WalletContext} from '@/providers';
import {Wallet} from '@/types/Wallet';

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
    const {walletChain} = useWallet();

    return (
        <HStack justifyContent="space-between" style={styles.inputContainer}>
            <Text variant="body1">{t('totalSend')}</Text>
            <VStack justifyContent="flex-start" alignItems="flex-end">
                <NumericFormat
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
                        <Text variant="body1" numberOfLines={1}>
                            {value}
                        </Text>
                    )}
                />
                <Text variant="sub1" opacity={0.5}>
                    {t('transactionFee', {
                        coin: walletChain?.balances.find(b => b.main)?.currency
                            .ticker,
                        balance: parseFloat(
                            !balance.main ? '0.005' : fee,
                        ).toFixed(4),
                    })}
                </Text>
            </VStack>
        </HStack>
    );
};

export default Total;
