import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {
    BottomSheetPicker,
    Header,
    IconButton,
    WalletItem,
} from '@/components/extended';
import {
    Deposit,
    Settings,
    Token,
    TransactionDetails,
    Wallet as WalletScreen,
    Withdraw,
    TokenSettings,
} from '@/screens';
import {Platform, StyleSheet} from 'react-native';
import {Image} from '@/components/common';
import Config from 'react-native-config';
import {Navigation} from '@/types/Navigation';
import {useNavigation} from '@react-navigation/native';

import {defaultOptions} from '@/routes/config';
import useAppStore from '@/store/appStore';
import {Wallet} from '@/types/Wallet';

const styles = StyleSheet.create({
    logoImage: {
        height: 32,
        width: 65,
    },
});

const Stack = createStackNavigator<Navigation.WalletParamList>();

const WalletStack: React.FC = () => {
    const {t} = useTranslation();
    const appNavigation = useNavigation<Navigation.AppNavigationProp>();
    const store = useAppStore();

    const chooseWallet = (uuid: string) => {
        store.setUUID(uuid);
    };

    const mappedWallets = store.wallets.map(wallet => ({
        label: wallet.title,
        value: wallet.uuid,
    }));

    {
        /* <IconButton
        onPress={() =>
            appNavigation.navigateDeprecated('RootStack', {
                screen: 'OnboardingStack',
                params: {
                    screen: 'Welcome',
                },
            })
        }
        name="add"
        iconSet="ionicons"
        color="textPrimary"
        transparent
    /> */
    }

    return (
        <Stack.Navigator
            initialRouteName="Wallet"
            screenOptions={{
                header: props => <Header {...props} />,
                headerStyle: {
                    height: parseInt(
                        Platform.OS === 'ios'
                            ? Config.HEADER_HEIGHT_IOS
                            : Config.HEADER_HEIGHT_ANDROID,
                    ),
                },
                ...defaultOptions,
            }}>
            <Stack.Screen
                name="Deposit"
                component={Deposit}
                options={{
                    title: t('screenTitles.wallet.deposit'),
                    cardStyle: {
                        paddingBottom: 90,
                    },
                }}
            />

            <Stack.Screen
                name="Wallet"
                component={WalletScreen}
                options={() => ({
                    header: props => <Header transparent {...props} />,
                    headerTransparent: true,
                    headerTitle: () => (
                        <Image
                            resizeMode="contain"
                            style={{height: 25, width: 125}}
                            source={require('../../assets/wonpay.png')}
                        />
                    ),
                    gestureEnabled: false,
                    headerRight: () => (
                        <>
                            <BottomSheetPicker
                                title={t('screenTitles.wallet.walletList')}
                                selectedValue={store.uuid}
                                options={mappedWallets}
                                onValueChange={chooseWallet}
                                titleActions={ref => (
                                    <IconButton
                                        onPress={() => {
                                            ref.current?.dismiss();
                                            appNavigation.navigate(
                                                'RootStack',
                                                {
                                                    screen: 'OnboardingStack',
                                                    params: {
                                                        screen: 'Welcome',
                                                    },
                                                },
                                            );
                                        }}
                                        name="add"
                                        iconSet="ionicons"
                                        color="textPrimary"
                                        transparent
                                    />
                                )}>
                                <IconButton
                                    name="list"
                                    iconSet="ionicons"
                                    color="white"
                                    transparent
                                />
                            </BottomSheetPicker>

                            <IconButton
                                onPress={() =>
                                    appNavigation.navigate('RootStack', {
                                        screen: 'QRCodeScanner',
                                        params: {type: 'home'},
                                    })
                                }
                                name="qr-code-outline"
                                iconSet="ionicons"
                                color="white"
                                transparent
                            />
                        </>
                    ),
                })}
            />
            <Stack.Screen
                name="Currency"
                component={Token}
                options={({route, navigation}) => ({
                    header: props => <Header transparent {...props} />,
                    headerTransparent: true,
                    title:
                        route.params && 'balance' in route.params
                            ? route.params.balance.currency.ticker
                            : undefined,
                    headerRight: () =>
                        route.params.balance.currency.ticker.includes('!') && (
                            <IconButton
                                onPress={() =>
                                    navigation.navigate('TokenSettings', {
                                        balance: route.params.balance,
                                    })
                                }
                                name="settings-outline"
                                iconSet="ionicons"
                                color="white"
                                transparent
                            />
                        ),
                })}
            />
            <Stack.Screen
                name="Withdraw"
                component={Withdraw}
                options={{
                    title: t('screenTitles.wallet.withdraw'),
                    cardStyle: {
                        paddingBottom: 90,
                    },
                }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                    title: t('screenTitles.wallet.settings'),
                    cardStyle: {
                        paddingBottom: 90,
                    },
                }}
            />
            <Stack.Screen
                name="TokenSettings"
                component={TokenSettings}
                options={{
                    title: t('screenTitles.wallet.tokenSettings'),
                    cardStyle: {
                        paddingBottom: 90,
                    },
                }}
            />

            <Stack.Screen
                name="TransactionDetails"
                component={TransactionDetails}
                options={{
                    title: t('screenTitles.wallet.transactionDetails'),
                    header: props => <Header transparent {...props} />,
                    headerTransparent: true,
                }}
            />
        </Stack.Navigator>
    );
};

export default WalletStack;
