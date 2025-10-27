import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {BottomSheetPicker, Header, IconButton} from '@/components/extended';
import P2PList from '@/screens/p2p/account/tabs/P2PList';
import NewOffer from '@/screens/p2p/newOffer/NewOffer';
import NewTrade from '@/screens/p2p/newTrade/NewTrade';
import Account from '@/screens/p2p/account/Account';
// import TradeDetails from '@/screens/p2p/tradeDetails/TradeDetails';
import {Platform, useColorScheme} from 'react-native';
import Config from 'react-native-config';
import {Navigation} from '@/types/Navigation';
import {defaultOptions} from '@/routes/config';
import {P2PProvider} from '@/providers/P2PProvider';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors, Typography} from '@/theme';
import {useP2PNavigation, useRootNavigation} from '@/hooks/useTypedNavigation';
import useAppStore from '@/store/appStore';
import {Wallet} from '@/types/Wallet';
import {WalletItem} from '@/components/extended';
import {useNavigation} from '@react-navigation/native';

const Stack = createStackNavigator<Navigation.P2PParamList>();
const Tab = createMaterialTopTabNavigator();

interface ListTabsProps {
    navigation: any;
    route: any;
}

const ListTabs = ({navigation, route}: ListTabsProps) => {
    const scheme = useColorScheme();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: {...Typography.body2, textTransform: 'none'},
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
            <Tab.Screen name="Account" options={{title: 'Account'}}>
                {() => <Account />}
            </Tab.Screen>
            <Tab.Screen name="P2PList" options={{title: 'Marketplace'}}>
                {() => <P2PList />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const P2PStack: React.FC = () => {
    const {t} = useTranslation();
    const appNavigation = useNavigation<Navigation.AppNavigationProp>();
    const p2pNavigation = useP2PNavigation();
    const store = useAppStore();

    const mappedWallets = store.wallets.map(wallet => ({
        label: wallet.title,
        value: wallet.uuid,
    }));

    const chooseWallet = (uuid: string) => {
        store.setUUID(uuid);
    };

    return (
        <Stack.Navigator
            initialRouteName="Account"
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
                name="Account"
                component={Account}
                options={({navigation}) => ({
                    title: 'P2P',
                    headerTransparent: true,
                    header: props => <Header {...props} transparent />,
                    headerRight: () => (
                        <>
                            <BottomSheetPicker
                                title={t('screenTitles.wallet.walletList')}
                                selectedValue={store.uuid}
                                options={mappedWallets}
                                onValueChange={chooseWallet}>
                                <IconButton
                                    name="list"
                                    iconSet="ionicons"
                                    color="white"
                                    transparent
                                />
                            </BottomSheetPicker>

                            <IconButton
                                onPress={() => navigation.navigate('NewOffer')}
                                name="add"
                                iconSet="ionicons"
                                color="white"
                                transparent
                            />
                        </>
                    ),
                })}
            />

            <Stack.Screen
                name="NewTrade"
                component={NewTrade}
                options={{
                    title: t('screenTitles.p2p.newTrade'),
                    cardStyle: {
                        paddingBottom: 90,
                    },
                }}
            />
            <Stack.Screen
                name="NewOffer"
                component={NewOffer}
                options={{
                    title: t('screenTitles.p2p.newOffer'),
                    cardStyle: {
                        paddingBottom: 90,
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default P2PStack;
