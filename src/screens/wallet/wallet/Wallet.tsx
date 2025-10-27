import React, {useEffect} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {
    Container,
    FocusAwareStatusBar,
    HStack,
    Text,
} from '@/components/common';
import {IconButton} from '@/components/extended';
import {WalletCard} from './layout';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Transactions from '@/screens/wallet/transactions/Transactions';
import Tokens from '@/screens/wallet/tokens/Tokens';
import {useTranslation} from 'react-i18next';
import {Colors, Typography} from '@/theme';

import useAppStore from '@/store/appStore';
import P2P from '@/screens/wallet/p2p/P2P';

interface WalletProps {
    navigation: any;
    route?: any;
}

const Tab = createMaterialTopTabNavigator();

const Wallet = ({navigation}: WalletProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('wallet');
    const store = useAppStore();

    useEffect(() => {
        if (store.deeplinkData) {
            if (store.deeplinkData.qrRequest) {
                navigation.navigate('Withdraw', store.deeplinkData.qrRequest);
            }

            store.setDeepLinkData(undefined);
        }
    }, [store.deeplinkData]);

    const onSettings = () => {
        navigation.navigate('RootStack', {
            screen: 'MainTabs',
            params: {
                screen: 'WalletStack',
                params: {screen: 'Settings'},
            },
        });
    };

    return (
        <Container paddingTop gradient gap={20}>
            <FocusAwareStatusBar barStyle="light-content" />
            <WalletCard />
            <HStack gap={80}>
                <IconButton
                    iconColor="textPrimary"
                    name="chevron-down"
                    iconSet="ionicons"
                    onPress={() => navigation.navigate('Deposit')}>
                    <Text variant="sub1" fontWeight={700} color="white">
                        {t('deposit')}
                    </Text>
                </IconButton>

                <IconButton
                    iconColor="textPrimary"
                    name="chevron-up"
                    iconSet="ionicons"
                    onPress={() => navigation.navigate('Withdraw')}>
                    <Text variant="sub1" fontWeight={700} color="white">
                        {t('withdraw')}
                    </Text>
                </IconButton>

                <IconButton
                    iconSet="ionicons"
                    name="options-outline"
                    iconColor="textPrimary"
                    onPress={onSettings}>
                    <Text variant="sub1" fontWeight={700} color="white">
                        {t('settings')}
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
                    name={t('history')}
                    options={{title: t('history')}}
                    component={Transactions}
                />
                <Tab.Screen
                    name={t('tokens')}
                    options={{title: t('tokens')}}
                    component={Tokens}
                />
                <Tab.Screen
                    name={t('p2p')}
                    options={{title: t('p2p')}}
                    component={P2P}
                />
            </Tab.Navigator>
        </Container>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        marginHorizontal: -20,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
});

export default Wallet;
