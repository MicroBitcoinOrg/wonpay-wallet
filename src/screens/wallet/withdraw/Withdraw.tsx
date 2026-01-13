import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {useWallet} from '@/providers';
import {
    Container,
    DismissKeyboard,
    KeyboardAvoidingView,
    VStack,
} from '@/components/common';
import {Button} from '@/components/extended';
import {isMatchAddress} from '@/utils/address';
import {Amount, Fee, Total, WithdrawAddress} from './layout';
import {Colors} from '@/theme';
import useAppStore from '@/store/appStore';
import {useQueryClient} from '@tanstack/react-query';
import useWithdrawalUtils from '@/services/hooks/useWithdrawalUtils';
import {Wallet} from '@/types/Wallet';
import {Currency, NetworkPicker} from '@/screens/wallet/components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomContainer: {
        flex: 0,
        marginHorizontal: -20,
        borderTopWidth: 1,
        gap: 16,
        justifyContent: 'center',
        paddingBottom: 16,
        paddingTop: 16,
    },
    confirmButton: {
        width: 100,
    },
});

interface SendProps {
    navigation: any;
    route: any;
}

const Send: React.FC<SendProps> = ({navigation, route}: SendProps) => {
    const queryClient = useQueryClient();
    const scheme = useColorScheme();
    const {t} = useTranslation('withdraw');
    const store = useAppStore();
    const {wallet, walletChain, chain, chainKey} = useWallet();
    const defaultParams = {
        address: '',
        amount: '',
        timelock: undefined,
        fee: String(chain!.minFee.toFixed(2)),
        token: undefined,
        minAmount: undefined,
    };
    const params = route.params
        ? {...defaultParams, ...route.params}
        : defaultParams;
    const [address, setAddress] = useState<string>(params.address);
    const [amount, setAmount] = useState<string>(params.amount);
    const [minAmount, setMinAmount] = useState<string | undefined>(
        params.minAmount,
    );
    const [fee, setFee] = useState<string>(params.fee);
    const [balance, setBalance] = useState<Wallet.Balance | undefined>(
        walletChain!.balances.find(
            item => item.currency.ticker === params.token,
        ) || walletChain?.balances.find(b => b.main),
    );
    const {sendTransaction} = useWithdrawalUtils({
        chain: chainKey!,
    });

    const send = async () => {
        const sendConfirmed = async () => {
            store.setLoading(true);

            try {
                await sendTransaction!({
                    withdrawAddress: address,
                    amount: parseFloat(amount),
                    fee: Number(fee),
                    currency: balance!.currency,
                });

                showMessage({
                    message: t('alerts.transactionSent.message'),
                    description: t('alerts.transactionSent.description'),
                    backgroundColor: Colors[scheme!].primary,
                });

                store.setLoading(false);

                queryClient.invalidateQueries({
                    queryKey: ['mempool'],
                });

                navigation.replace('MainTabs', {
                    screen: 'WalletStack',
                    params: {screen: 'Wallet'},
                });
            } catch (e) {
                showMessage({
                    message: t('alerts.error.message'),
                    description: (e as Error).message,
                    type: 'danger',
                });

                store.setLoading(false);
                navigation.replace('MainTabs', {
                    screen: 'WalletStack',
                    params: {screen: 'Wallet'},
                });
            }
        };

        Alert.alert(
            t('alerts.withdrawConfirmation.message'),
            t('alerts.withdrawConfirmation.description', {
                amount,
                coin: balance!.currency.ticker,
            }),
            [
                {
                    text: t('alerts.withdrawConfirmation.cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: t('alerts.withdrawConfirmation.confirm'),
                    onPress: sendConfirmed,
                    style: 'default',
                },
            ],
            {cancelable: false},
        );
    };

    useEffect(() => {
        if (route.params?.address) {
            setAddress(route.params.address);
        }

        if (route.params?.amount) {
            setAmount(route.params.amount);
        }

        if (route.params?.token) {
            setBalance(
                walletChain!.balances.find(
                    item => item.currency.ticker === params.token,
                ) || walletChain?.balances.find(b => b.main),
            );
        }

        if (route.params?.minAmount) {
            setMinAmount(route.params.minAmount);
        }
    }, [route.params]);

    useEffect(() => {
        if (chainKey) {
            setBalance(
                walletChain!.balances.find(
                    item => item.currency.ticker === params.token,
                ) || walletChain?.balances.find(b => b.main),
            );
        }
    }, [chainKey]);

    console.log('minAmount', minAmount);

    const isMinAmountError = useMemo(() => {
        if (!minAmount || !amount) {
            return false;
        }
        const numAmount = parseFloat(amount);
        const numMin = parseFloat(minAmount);
        return !isNaN(numAmount) && !isNaN(numMin) && numAmount < numMin;
    }, [amount, minAmount]);

    const amountError = isMinAmountError
        ? t('amount.minAmountError', {
              minAmount,
              coin: balance?.currency.ticker,
          })
        : undefined;

    return (
        <DismissKeyboard>
            <Container>
                <KeyboardAvoidingView style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <NetworkPicker
                            borderBottomLeftRadius={10}
                            borderBottomRightRadius={10}
                        />
                        <Currency
                            currencies={walletChain!.balances}
                            balance={balance!}
                            setBalance={setBalance}
                        />
                        <VStack
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            flex={1}>
                            <WithdrawAddress
                                address={address}
                                setAddress={setAddress}
                            />
                            <Amount
                                fee={fee}
                                amount={amount}
                                address={address}
                                setAmount={setAmount}
                                balance={balance!}
                                error={amountError}
                            />
                            {chain!.minFee > 0 && (
                                <Fee fee={fee} setFee={setFee} />
                            )}
                        </VStack>
                    </ScrollView>
                    <Container
                        flex={0}
                        marginHorizontal={-20}
                        borderTopWidth={1}
                        gap={16}
                        justifyContent="center"
                        paddingVertical={16}
                        borderColor={Colors[scheme!].border}>
                        <Total amount={amount} fee={fee} balance={balance!} />
                        <Button
                            title={t('confirmButton')}
                            disabled={
                                !isMatchAddress(
                                    address,
                                    chain!.regex.address,
                                ) ||
                                !amount ||
                                amount === '' ||
                                isMinAmountError ||
                                Number(amount) >
                                    Number(balance!.balance) /
                                        10 ** Number(balance!.currency.units) -
                                        (balance?.main ? Number(fee) : 0)
                            }
                            onPress={send}
                        />
                    </Container>
                </KeyboardAvoidingView>
            </Container>
        </DismissKeyboard>
    );
};

export default Send;
