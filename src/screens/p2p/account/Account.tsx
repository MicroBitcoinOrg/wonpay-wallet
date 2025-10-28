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
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');
    const navigation = useP2PNavigation();
    const rootNavigation = useNavigation<any>();
    const {token} = useContext(P2PContext);
    const {wallet} = useWallet();
    const store = useAppStore();

    const {data: addresses, isLoading} = useAddresses(token);

    // Create network options from addresses
    const networkOptions: PickerOption[] = useMemo(() => {
        if (!addresses) return [];
        return addresses
            .filter(addr => addr.address) // Only show networks with addresses
            .map(addr => ({
                label: addr.network.toUpperCase(),
                value: addr.network,
                description: `${addr.supported_currencies.length} currencies`,
            }));
    }, [addresses]);

    const handleNetworkSelect = useCallback(
        (network: string) => {
            const selectedAddress = addresses?.find(
                addr => addr.network === network,
            );

            if (!selectedAddress || !selectedAddress.address) {
                return;
            }

            const chainKey = network.toLowerCase() as
                | Wallet.ChainEnum.MICROBITCOIN
                | Wallet.ChainEnum.TRON;

            if (chainKey !== null && wallet) {
                // Update active chain in wallet
                store.updateWallet(wallet.uuid, {
                    activeChain: chainKey,
                });

                // Navigate to Withdraw screen in WalletStack with deposit address
                rootNavigation.navigate('MainTabs', {
                    screen: 'WalletStack',
                    params: {
                        screen: 'Withdraw',
                        params: {
                            address: selectedAddress.address,
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
            <HStack gap={64}>
                <BottomSheetPicker
                    options={networkOptions}
                    onValueChange={handleNetworkSelect}
                    title={t('account.selectNetwork', {
                        defaultValue: 'Select Network',
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
