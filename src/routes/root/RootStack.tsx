import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AnimatedLoader, Header, TabBar} from '@/components/extended';
import {DeleteWallet, FactoryReset, QRCodeScanner, Splash} from '@/screens';
import {
    AddressBookStack,
    OnboardingStack,
    PasswordStack,
    SettingsStack,
    WalletStack,
    P2PStack,
} from '@/routes';
import Config from 'react-native-config';
import {Platform, useColorScheme} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {Colors} from '@/theme';
import {Navigation} from '@/types/Navigation';
import {defaultOptions} from '@/routes/config';
import useAppStore from '@/store/appStore';
import {createNativeBottomTabNavigator} from '@bottom-tabs/react-navigation';
import {P2PProvider} from '@/providers';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator<Navigation.RootParamList>();
const Tab = createNativeBottomTabNavigator<Navigation.MainTabsParamList>();

const addressBookIcon = FontAwesome.getImageSourceSync('address-book-o', 24);
const addressBookFocusedIcon = FontAwesome.getImageSourceSync(
    'address-book',
    24,
);

const walletIcon = Ionicons.getImageSourceSync('wallet-outline', 24);
const walletFocusedIcon = Ionicons.getImageSourceSync('wallet', 24);

const p2pIcon = FontAwesome6.getImageSourceSync('arrow-right-arrow-left', 24);

const settingsIcon = MaterialCommunityIcons.getImageSourceSync(
    'cog-outline',
    24,
);
const settingsFocusedIcon = MaterialCommunityIcons.getImageSourceSync(
    'cog',
    24,
);

const MainTabs = () => {
    const scheme = useColorScheme();

    return (
        <P2PProvider>
            <Tab.Navigator
                rippleColor={Colors[scheme!].primary}
                activeIndicatorColor={Colors[scheme!].primaryLight}
                initialRouteName="WalletStack"
                tabBarActiveTintColor={Colors[scheme!].primaryLight}
                tabBarStyle={{
                    backgroundColor: Colors[scheme!].background,
                }}>
                <Tab.Screen
                    name="AddressBookStack"
                    options={{
                        tabBarIcon: ({focused}) =>
                            focused ? addressBookFocusedIcon : addressBookIcon,
                        tabBarLabel: 'Address Book',
                    }}
                    component={AddressBookStack}
                />
                <Tab.Screen
                    options={{
                        tabBarLabel: 'Wallet',
                        tabBarIcon: ({focused}) =>
                            focused ? walletFocusedIcon : walletIcon,
                    }}
                    name="WalletStack"
                    component={WalletStack}
                />
                <Tab.Screen
                    options={{
                        tabBarLabel: 'P2P',

                        tabBarIcon: ({focused}) => p2pIcon,
                    }}
                    name="P2PStack"
                    component={P2PStack}
                />
                <Tab.Screen
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({focused}) =>
                            focused ? settingsFocusedIcon : settingsIcon,
                    }}
                    name="SettingsStack"
                    component={SettingsStack}
                />
            </Tab.Navigator>
        </P2PProvider>
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
