import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AnimatedLoader, Header, TabBar} from '../../components/extended';
import {DeleteWallet, FactoryReset, QRCodeScanner, Splash} from '../../screens';
import {
    AddressBookStack,
    OnboardingStack,
    PasswordStack,
    SettingsStack,
    WalletStack,
    P2PStack,
} from '../';
import Config from 'react-native-config';
import {Platform, useColorScheme} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {Colors} from '../../theme';
import {Navigation} from '../../types/Navigation';
import {defaultOptions} from '../config';
import useAppStore from '../../store/appStore';
import {createNativeBottomTabNavigator} from '@bottom-tabs/react-navigation';

const Stack = createStackNavigator<Navigation.RootParamList>();
const Tab = createNativeBottomTabNavigator<Navigation.MainTabsParamList>();

const MainTabs = () => {
    const scheme = useColorScheme();

    return (
        <Tab.Navigator
            initialRouteName="WalletStack"
            tabBarActiveTintColor={Colors[scheme!].primaryLight}
            tabBarStyle={{
                backgroundColor: Colors[scheme!].background,
            }}>
            <Tab.Screen
                name="AddressBookStack"
                options={{
                    tabBarIcon: ({focused}) => ({
                        sfSymbol: focused ? 'book.pages.fill' : 'book.pages',
                    }),
                    tabBarLabel: 'Address Book',
                }}
                component={AddressBookStack}
            />
            <Tab.Screen
                options={{
                    tabBarLabel: 'Wallet',
                    tabBarIcon: ({focused}) => ({
                        sfSymbol: focused
                            ? 'wallet.bifold.fill'
                            : 'wallet.bifold',
                    }),
                }}
                name="WalletStack"
                component={WalletStack}
            />
            <Tab.Screen
                options={{
                    tabBarLabel: 'P2P',

                    tabBarIcon: ({focused}) => ({
                        sfSymbol: focused
                            ? 'arrow.down.left.arrow.up.right.square.fill'
                            : 'arrow.down.left.arrow.up.right.square',
                    }),
                }}
                name="P2PStack"
                component={P2PStack}
            />
            <Tab.Screen
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({focused}) => ({
                        sfSymbol: focused ? 'gearshape.fill' : 'gearshape',
                    }),
                }}
                name="SettingsStack"
                component={SettingsStack}
            />
        </Tab.Navigator>
    );
};

const RootStack: React.FC = () => {
    const {t} = useTranslation();
    const store = useAppStore();

    return (
        <>
            <AnimatedLoader
                animationType="fade"
                visible={store.isLoading || false}
                overlayColor="rgba(0,0,0,0.6)"
                source={require('../../assets/loader.json')}
                animationStyle={{height: 350}}
                speed={1}
            />
            <Stack.Navigator
                detachInactiveScreens={false}
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                    header: props => <Header transparent {...props} />,
                    headerTransparent: true,
                    headerStyle: {
                        height: parseInt(
                            Platform.OS === 'ios'
                                ? Config.HEADER_HEIGHT_IOS
                                : Config.HEADER_HEIGHT_ANDROID,
                        ),
                    },
                    ...defaultOptions,
                }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen
                    name="QRCodeScanner"
                    options={{
                        headerShown: true,
                        title: t('screenTitles.settings.qrCodeScanner'),
                    }}
                    component={QRCodeScanner}
                />
                <Stack.Group screenOptions={{gestureEnabled: false}}>
                    <Stack.Screen
                        name="FactoryReset"
                        component={FactoryReset}
                    />
                    <Stack.Screen
                        name="DeleteWallet"
                        component={DeleteWallet}
                    />
                </Stack.Group>
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen
                    name="OnboardingStack"
                    component={OnboardingStack}
                />
                <Stack.Screen
                    name="PasswordStack"
                    options={{
                        gestureEnabled: false,
                    }}
                    component={PasswordStack}
                />
            </Stack.Navigator>
        </>
    );
};

export default RootStack;
