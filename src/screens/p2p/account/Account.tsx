import React, {useContext, useMemo, useState, useCallback} from 'react';
import {Pressable, StyleSheet, useColorScheme} from 'react-native';
import {
    Container,
    FocusAwareStatusBar,
    HStack,
    Text,
    VStack,
} from '@/components/common';
import {IconButton, BottomSheetPicker} from '@/components/extended';
import type {PickerOption} from '@/components/extended';
import AccountCard from './layout/AccountCard';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Balances from './tabs/Balances';
import Trades from './tabs/Trades';
import Offers from './tabs/Offers';
import {useTranslation} from 'react-i18next';
import {Colors, Typography} from '@/theme';
import P2PList from './tabs/P2PList';
import {useP2PNavigation} from '@/hooks/useTypedNavigation';
import {useAddresses} from '@/services/mex/hooks';
import {P2PContext} from '@/providers';
import {useWallet} from '@/providers';
import {Wallet} from '@/types/Wallet';
import useAppStore from '@/store/appStore';
import {useNavigation} from '@react-navigation/native';
import {CHAINS} from '@/utils/constants';
import useBalanceUtils from '@/services/hooks/useBalanceUtils';

const styles = StyleSheet.create({
    tabsContainer: {
        marginHorizontal: -20,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },

    buttonText: {
        marginTop: 5,
    },
});

const Tab = createMaterialTopTabNavigator();

const Account = () => {
    const {getCurrencyIcon} = useBalanceUtils();
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');
    const navigation = useP2PNavigation();
    const rootNavigation = useNavigation<any>();
    const {token} = useContext(P2PContext);
    const {wallet} = useWallet();
    const store = useAppStore();

    const {data: addresses} = useAddresses(token);

    // Create currency options from supported_currencies in addresses
    const currencyOptions: PickerOption[] = useMemo(() => {
        if (!addresses) return [];

        const currencyMap = new Map<
            string,
            {
                currency: string;
                address: string;
                network: Wallet.ChainEnum;
                min_deposit: number;
            }
        >();

        // Collect all currencies from all addresses
        addresses.forEach(addr => {
            if (!addr.address) return; // Skip addresses without address

            addr.supported_currencies.forEach(supportedCurrency => {
                // Use currency as key, prefer first occurrence or update if needed
                const key = `${addr.network}:${supportedCurrency.currency}`;
                if (!currencyMap.has(key)) {
                    currencyMap.set(key, {
                        currency: supportedCurrency.currency,
                        address: addr.address!,
                        network: addr.network,
                        min_deposit: supportedCurrency.min_deposit,
                    });
                }
            });
        });

        // Convert to picker options
        return Array.from(currencyMap.values()).map(item => ({
            label: item.currency,
            value: `${item.network}:${item.currency}`,
            description: CHAINS[item.network]?.name || item.network,
            avatarProps: {
                source: {
                    uri: getCurrencyIcon(item.network)({
                        currency: {ticker: item.currency, units: 0},
                    }),
                },
            },
        }));
    }, [addresses, getCurrencyIcon]);

    const handleCurrencySelect = useCallback(
        (value: string) => {
            // Parse the value to get network and currency
            const [networkStr, currency] = value.split(':');

            // Convert network string to ChainEnum for comparison
            const network = networkStr.toLowerCase() as Wallet.ChainEnum;

            // Find the address that supports this currency
            const selectedAddress = addresses?.find(
                addr =>
                    addr.network === network &&
                    addr.address &&
                    addr.supported_currencies.some(
                        sc => sc.currency === currency,
                    ),
            );

            if (!selectedAddress || !selectedAddress.address) {
                return;
            }

            // Find the specific currency info for min_deposit
            const currencyInfo = selectedAddress.supported_currencies.find(
                sc => sc.currency === currency,
            );

            if (!currencyInfo) {
                return;
            }

            const chainKey = network as
                | Wallet.ChainEnum.MICROBITCOIN
                | Wallet.ChainEnum.TRON;

            if (chainKey && wallet) {
                // Update active chain in wallet
                store.updateWallet(wallet.uuid, {
                    activeChain: chainKey,
                });

                // Navigate to Withdraw screen in WalletStack with deposit address and minAmount
                rootNavigation.navigate('MainTabs', {
                    screen: 'WalletStack',
                    params: {
                        screen: 'Withdraw',
                        params: {
                            token: currency,
                            address: selectedAddress.address,
                            minAmount: String(currencyInfo.min_deposit),
                        },
                    },
                });
            }
        },
        [addresses, wallet, store, rootNavigation],
    );

    return (
        <Container paddingTop gradient style={{gap: 20}}>
            <FocusAwareStatusBar barStyle="light-content" />
            <AccountCard />
            <HStack gap={80}>
                <BottomSheetPicker
                    options={currencyOptions}
                    onValueChange={handleCurrencySelect}
                    title={t('account.selectCurrency', {
                        defaultValue: 'Select Currency',
                    })}>
                    <IconButton
                        iconColor="textPrimary"
                        name="chevron-down"
                        iconSet="ionicons">
                        <Text variant="sub1" fontWeight={700} color="white">
                            {t('account.deposit')}
                        </Text>
                    </IconButton>
                </BottomSheetPicker>
                <IconButton
                    iconColor="textPrimary"
                    name="chevron-up"
                    iconSet="ionicons"
                    onPress={() => navigation.navigate('Withdraw')}>
                    <Text variant="sub1" fontWeight={700} color="white">
                        {t('account.withdraw')}
                    </Text>
                </IconButton>
                <IconButton
                    iconSet="ionicons"
                    name="options-outline"
                    iconColor="textPrimary"
                    onPress={() => navigation.navigate('Settings')}>
                    <Text variant="sub1" fontWeight={700} color="white">
                        {t('account.settings')}
                    </Text>
                </IconButton>
            </HStack>

            <Tab.Navigator
                style={[
                    styles.tabsContainer,
                    {backgroundColor: Colors[scheme!].background},
                ]}
                screenOptions={{
                    tabBarLabelStyle: {
                        ...Typography.body2,
                        textTransform: 'none',
                    },
                    tabBarStyle: {
                        backgroundColor: Colors[scheme!].background,
                        borderBottomColor: Colors[scheme!].border,
                        shadowOpacity: 0,
                        elevation: 0,
                        borderBottomWidth: 1,
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: Colors[scheme!].primaryLight,
                    },
                }}>
                <Tab.Screen
                    name="P2PList"
                    options={{title: t('account.market')}}
                    component={P2PList}
                />
                <Tab.Screen
                    name="Balances"
                    options={{title: t('account.balances')}}
                    component={Balances}
                />
                <Tab.Screen
                    name="Trades"
                    options={{title: t('account.trades')}}
                    component={Trades}
                />
                <Tab.Screen
                    name="Offers"
                    options={{title: t('account.offers')}}
                    component={Offers}
                />
            </Tab.Navigator>
        </Container>
    );
};

export default Account;
