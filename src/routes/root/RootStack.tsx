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

const Stack = createStackNavigator<Navigation.RootParamList>();
const Tab = createBottomTabNavigator<Navigation.MainTabsParamList>();

const MainTabs = () => {
    const scheme = useColorScheme();

    return (
        <Tab.Navigator
            initialRouteName="WalletStack"
            tabBar={props => <TabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: Colors[scheme!].background,
                },
            }}>
            <Tab.Screen
                name="AddressBookStack"
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        <IoniconsIcon
                            size={size}
                            name={focused ? 'bookmarks' : 'bookmarks-outline'}
                            color={color}
                        />
                    ),
                }}
                component={AddressBookStack}
            />
            <Tab.Screen
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        <IoniconsIcon
                            size={size}
                            name={focused ? 'home' : 'home-outline'}
                            color={color}
                        />
                    ),
                }}
                name="WalletStack"
                component={WalletStack}
            />
            <Tab.Screen
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        <IoniconsIcon
                            size={size}
                            name={focused ? 'settings' : 'settings-outline'}
                            color={color}
                        />
                    ),
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
