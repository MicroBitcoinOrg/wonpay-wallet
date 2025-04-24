import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {Header, IconButton, WalletItem} from '../../components/extended';
import {
    Deposit,
    Settings,
    Token,
    TransactionDetails,
    Wallet,
    Withdraw,
} from '../../screens';
import {Image, Platform, StyleSheet} from 'react-native';
import Config from 'react-native-config';
import {Navigation} from '../../types/Navigation';
import {useNavigation} from '@react-navigation/native';

import {defaultOptions} from '../config';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    logoImage: {
        height: 32,
        width: 65,
    },
});

const Stack = createStackNavigator<Navigation.WalletParamList>();

const WalletStack: React.FC = () => {
    const {t} = useTranslation();
    const navigation = useNavigation<Navigation.AppNavigationProp>();
    const store = useAppStore();

    const chooseWallet = (uuid: string, nav: Navigation.AppNavigationProp) => {
        store.setUUID(uuid);
        nav.goBack();
    };

    const openWalletList = () => {
        navigation.navigate('ChooseList', {
            data: store.wallets,
            keyExtractor: (item: Wallet.Wallet) => item.uuid,
            renderItem: (
                item: Wallet.Wallet,
                nav: Navigation.AppNavigationProp,
            ) => {
                return (
                    <WalletItem
                        {...item}
                        onPress={() => chooseWallet(item.uuid, nav)}
                    />
                );
            },
            headerRight: (
                <IconButton
                    onPress={() =>
                        navigation.navigate('RootStack', {
                            screen: 'OnboardingStack',
                            params: {screen: 'Welcome'},
                        })
                    }
                    name="add"
                    iconSet="ionicons"
                    color="textPrimary"
                    transparent
                />
            ),
            headerTitle: t('Choose Wallet'),
        });
    };

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
                component={Wallet}
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
                            <IconButton
                                onPress={openWalletList}
                                name="list"
                                iconSet="ionicons"
                                color="white"
                                transparent
                            />
                            <IconButton
                                onPress={() =>
                                    navigation.navigate('RootStack', {
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
                options={({route}) => ({
                    header: props => <Header transparent {...props} />,
                    headerTransparent: true,
                    // @ts-ignore
                    title:
                        route.params && 'balance' in route.params
                            ? route.params.balance.currency.ticker
                            : undefined,
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
