import React, {useEffect} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {
    Container,
    FocusAwareStatusBar,
    HStack,
    Text,
    VStack,
} from '../../../components/common';
import {IconButton} from '../../../components/extended';
import {WalletCard} from './layout';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Transactions from '../transactions/Transactions';
import Tokens from '../tokens/Tokens';
import {useTranslation} from 'react-i18next';
import {Colors, Typography} from '../../../theme';

import useAppStore from '../../../store/appStore';
import P2P from '../p2p/P2P';

interface WalletProps {
    navigation: any;
    route?: any;
}

const styles = StyleSheet.create({
    tabsContainer: {
        marginHorizontal: -20,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    currencyTransactionsContainer: {
        flex: 1,
        overflow: 'scroll',
    },
    buttonsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 80,
    },
});

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
        <Container gradient>
            <FocusAwareStatusBar barStyle="light-content" />
            <WalletCard />
            <HStack style={styles.buttonsContainer}>
                <VStack>
                    <IconButton
                        iconColor="textPrimary"
                        name="chevron-down"
                        iconSet="ionicons"
                        onPress={() => navigation.navigate('Deposit')}
                    />
                    <Text variant="sub1" color="white" style={{marginTop: 5}}>
                        {t('deposit')}
                    </Text>
                </VStack>

                <VStack>
                    <IconButton
                        iconColor="textPrimary"
                        name="chevron-up"
                        iconSet="ionicons"
                        onPress={() => navigation.navigate('Withdraw')}
                    />
                    <Text variant="sub1" color="white" style={{marginTop: 5}}>
                        {t('withdraw')}
                    </Text>
                </VStack>

                <VStack>
                    <IconButton
                        iconSet="ionicons"
                        name="options-outline"
                        iconColor="textPrimary"
                        onPress={onSettings}
                    />
                    <Text variant="sub1" color="white" style={{marginTop: 5}}>
                        {t('settings')}
                    </Text>
                </VStack>
            </HStack>
            <Tab.Navigator
                style={styles.tabsContainer}
                screenOptions={{
                    tabBarLabelStyle: {
                        ...Typography.body2,
                        textTransform: 'none',
                    },
                    tabBarStyle: {
                        backgroundColor: Colors[scheme!].background,
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

export default Wallet;
