import React, {useContext, useEffect} from 'react';
import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Avatar, HStack, Text} from '../../../../components/common';
import Config from 'react-native-config';
import {Navigation} from '../../../../types/Navigation';
import {Colors} from '../../../../theme';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NumberFormat from 'react-number-format';
import {PasswordContext, WalletContext} from '../../../../providers';
import useAppStore from '../../../../store/appStore';
import useBalanceUtils from '../../../../services/hooks/useBalanceUtils';
import {useQuery} from '@tanstack/react-query';
import {decryptData} from '../../../../utils/common';

const styles = StyleSheet.create({
    container: {
        height: 150,
        width: Dimensions.get('window').width - 60,
        borderRadius: 10,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
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
    walletCardContainer: {
        marginBottom: 30,
        marginHorizontal: -20,
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
    const {wallet, walletChain} = useContext(WalletContext);
    const store = useAppStore();
    const scheme = useColorScheme();
    const mainBalance = wallet!.balances.find(b => b.main);
    const formattedBalance =
        mainBalance!.balance / 10 ** mainBalance!.currency.units;

    const {getBalance, registerAddress} = useBalanceUtils({
        chain: walletChain!.key,
    });
    const {
        data: balance,
        refetch: refetchBalance,
        isLoading: isBalanceLoading,
        isRefetching: isBalanceRefetching,
    } = useQuery({
        queryKey: ['balance', wallet!.uuid],
        queryFn: () => getBalance({addresses: wallet!.addresses}),
    });

    useEffect(() => {
        if (balance) {
            store.updateWallet(wallet!.uuid, {balances: balance});
        }
    }, [balance]);

    useEffect(() => {
        if (wallet?.transactions && wallet?.transactions.length > 0) {
            refetchBalance();
        }
    }, [wallet?.transactions]);

    useEffect(() => {
        if (registerAddress && wallet?.depositAddress) {
            registerAddress({
                address: wallet!.depositAddress,
                service: 'wonpay',
            });
        }
    }, [registerAddress, wallet?.depositAddress]);

    return (
        <HStack
            style={[
                styles.walletCardContainer,
                {
                    marginTop: parseInt(
                        Platform.OS === 'ios'
                            ? Config.HEADER_HEIGHT_IOS
                            : Config.HEADER_HEIGHT_ANDROID,
                    ),
                },
            ]}>
            <View
                style={[
                    styles.container,
                    {backgroundColor: Colors[scheme!].background},
                ]}>
                <View style={styles.alignment}>
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
                                            <Text
                                                variant="h2"
                                                color="textPrimary">
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
                        <HStack flex={1} justifyContent="space-between">
                            <Text variant="body2" numberOfLines={1}>
                                {wallet!.title}
                            </Text>
                            <HStack style={[styles.chainInfoContainer]}>
                                <Text
                                    color="textSecondary"
                                    textTransform="uppercase"
                                    variant="sub1"
                                    fontWeight="bold">
                                    {walletChain?.name}
                                </Text>
                                <Avatar
                                    source={walletChain?.logo}
                                    backgroundColor={walletChain?.color}
                                    style={{width: 25, height: 25}}
                                    size="sm"
                                    imageProps={{
                                        tintColor: Colors[scheme!].white,
                                    }}
                                />
                            </HStack>
                        </HStack>
                    </HStack>
                </View>
            </View>
        </HStack>
    );
};

export default WalletCard;
