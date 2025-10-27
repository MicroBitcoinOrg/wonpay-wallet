import React, {useEffect} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {HStack, Text, VStack} from '@/components/common';
import {Colors} from '@/theme';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {NumericFormat} from 'react-number-format';
import {useWallet} from '@/providers';
import useAppStore from '@/store/appStore';
import useBalanceUtils from '@/services/hooks/useBalanceUtils';
import {useQuery} from '@tanstack/react-query';
import {NetworkPicker} from '@/screens/wallet/components';

const styles = StyleSheet.create({
    alignment: {
        height: '100%',
        padding: 15,
        justifyContent: 'space-between',
    },
    activeWalletContainer: {
        borderRadius: 10,
        height: 10,
        width: 10,
        marginRight: 10,
        backgroundColor: 'lightgreen',
    },
    lockedBalanceContainer: {
        opacity: 0.5,
    },
    buttonContainer: {
        flex: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerHStack: {
        marginTop: 15,
    },
    chainInfoContainer: {
        borderRadius: 5,
        gap: 5,
    },
    chainLogo: {
        width: 15,
        height: 15,
        borderRadius: 5,
    },
});

const WalletCard = () => {
    const {wallet, walletChain, chainKey} = useWallet();
    const store = useAppStore();
    const scheme = useColorScheme();
    const mainBalance = walletChain?.balances.find(b => b.main);
    const formattedBalance =
        mainBalance!.balance / 10 ** mainBalance!.currency.units;

    const {getBalance, registerAddress} = useBalanceUtils({
        chain: chainKey!,
    });
    const {
        data: balance,
        refetch: refetchBalance,
        isLoading: isBalanceLoading,
        isRefetching: isBalanceRefetching,
    } = useQuery({
        queryKey: ['balance', wallet!.uuid],
        queryFn: () => getBalance({addresses: walletChain!.addresses}),
    });

    useEffect(() => {
        if (balance) {
            store.updateWalletChain(wallet!.uuid, chainKey!, {
                balances: balance,
            });
        }
    }, [balance]);

    useEffect(() => {
        if (walletChain?.transactions && walletChain?.transactions.length > 0) {
            refetchBalance();
        }
    }, [walletChain?.transactions]);

    useEffect(() => {
        if (registerAddress && walletChain?.depositAddress) {
            registerAddress({
                address: walletChain!.depositAddress,
                service: 'wonpay',
            });
        }
    }, [registerAddress, walletChain?.depositAddress]);

    return (
        <VStack>
            <NetworkPicker />
            <VStack
                backgroundColor={Colors[scheme!].background}
                gap={16}
                borderRadius={10}
                borderTopLeftRadius={0}
                borderTopRightRadius={0}
                padding={15}>
                <HStack justifyContent="flex-start">
                    {isBalanceLoading || isBalanceRefetching ? (
                        <SkeletonPlaceholder
                            backgroundColor={Colors[scheme!].background}
                            highlightColor={Colors[scheme!].card}>
                            <SkeletonPlaceholder.Item
                                width={75}
                                height={25}
                                borderRadius={4}
                            />
                        </SkeletonPlaceholder>
                    ) : (
                        <>
                            <NumericFormat
                                displayType="text"
                                value={formattedBalance}
                                decimalScale={4}
                                thousandSeparator
                                fixedDecimalScale
                                suffix={` ${mainBalance?.currency.ticker}`}
                                renderText={value => (
                                    <Text>
                                        <Text variant="h2" color="textPrimary">
                                            {value.split('.')[0]}
                                        </Text>
                                        <Text
                                            variant="number2"
                                            color="textPrimary">
                                            .{value.split('.')[1]}
                                        </Text>
                                    </Text>
                                )}
                            />
                        </>
                    )}
                </HStack>
                <HStack style={styles.innerHStack}>
                    <HStack flex={1} justifyContent="flex-end">
                        <Text variant="body2" numberOfLines={1}>
                            {wallet!.title}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
        </VStack>
    );
};

export default WalletCard;
