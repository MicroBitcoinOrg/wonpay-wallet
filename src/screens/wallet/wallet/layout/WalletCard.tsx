import React, {useContext, useEffect} from 'react';
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import {Avatar, HStack, Text, VStack} from '../../../../components/common';
import {Colors} from '../../../../theme';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NumberFormat from 'react-number-format';
import {useWallet} from '../../../../providers';
import useAppStore from '../../../../store/appStore';
import useBalanceUtils from '../../../../services/hooks/useBalanceUtils';
import {useQuery} from '@tanstack/react-query';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {BottomSheetPicker} from '../../../../components/extended';
import {CHAINS} from '../../../../utils/constants';
import {Wallet} from '../../../../types/Wallet';

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
    const {wallet, walletChain, chainKey, chain} = useWallet();
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

    const mappedNetworks = wallet
        ? (Object.keys(wallet?.chains) as Wallet.ChainEnum[]).map(_chain => ({
              label: CHAINS[_chain].name!,
              value: _chain,
              description: CHAINS[_chain].currency!.ticker,
          }))
        : [];

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
            <BottomSheetPicker
                options={mappedNetworks}
                selectedValue={chainKey!}
                onValueChange={value =>
                    store.updateWallet(wallet?.uuid!, {
                        activeChain: value as
                            | Wallet.ChainEnum.MICROBITCOIN
                            | Wallet.ChainEnum.TRON,
                    })
                }>
                <TouchableOpacity>
                    <HStack
                        justifyContent="space-between"
                        width="100%"
                        backgroundColor={Colors[scheme!].card}
                        padding={15}
                        borderRadius={10}
                        borderBottomLeftRadius={0}
                        borderBottomRightRadius={0}>
                        <HStack gap={8}>
                            <Avatar
                                source={chain?.logo}
                                backgroundColor={chain?.color}
                                style={{width: 25, height: 25}}
                                size="sm"
                                imageProps={{
                                    tintColor: Colors[scheme!].white,
                                }}
                            />
                            <Text
                                color="textSecondary"
                                textTransform="uppercase"
                                variant="sub1"
                                fontWeight="bold">
                                {chain?.name}
                            </Text>
                        </HStack>
                        <HStack gap={4}>
                            <Text color="textSecondary" variant="body3">
                                Change network
                            </Text>
                            <EntypoIcon
                                name="chevron-thin-right"
                                size={12}
                                color={Colors[scheme!].textSecondary}
                            />
                        </HStack>
                    </HStack>
                </TouchableOpacity>
            </BottomSheetPicker>
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
                            <NumberFormat
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
