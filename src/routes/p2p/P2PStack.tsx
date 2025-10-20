import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {Header, IconButton} from '../../components/extended';
import P2PList from '../../screens/p2p/P2PList/P2PList';
import MyOfferList from '../../screens/p2p/offerList/OfferList';
import TradeList from '../../screens/p2p/tradeList/TradeList';
import NewOffer from '../../screens/p2p/newOffer/NewOffer';
import NewTrade from '../../screens/p2p/newTrade/NewTrade';
// import TradeDetails from '../../screens/p2p/tradeDetails/TradeDetails';
import {Platform, useColorScheme} from 'react-native';
import Config from 'react-native-config';
import {Navigation} from '../../types/Navigation';
import {defaultOptions} from '../config';
import {P2PProvider} from '../../providers/P2PProvider';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors, Typography} from '../../theme';
import {
    useP2PNavigation,
    useRootNavigation,
} from '../../hooks/useTypedNavigation';

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
            <Tab.Screen name="P2PList" options={{title: 'Marketplace'}}>
                {() => <P2PList />}
            </Tab.Screen>
            <Tab.Screen name="TradeList" options={{title: 'My trades'}}>
                {() => <TradeList route={route} />}
            </Tab.Screen>
            <Tab.Screen name="MyOfferList" options={{title: 'My offers'}}>
                {() => <MyOfferList />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const P2PStack: React.FC = () => {
    const {t} = useTranslation();

    return (
        <P2PProvider>
            <Stack.Navigator
                initialRouteName="P2P"
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
                    name="P2P"
                    options={({navigation}) => ({
                        headerShown: true,
                        gestureEnabled: false,
                        title: 'P2P',
                        headerRight: () => (
                            <>
                                <IconButton
                                    onPress={() =>
                                        navigation.navigate('NewOffer')
                                    }
                                    name="plus"
                                    iconSet="entypo"
                                    color="textPrimary"
                                    transparent
                                />
                            </>
                        ),
                    })}
                    component={ListTabs}
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
                {/* <Stack.Screen
                    name="TradeDetails"
                    component={TradeDetails}
                    options={{
                        title: t('screenTitles.p2p.tradeDetails'),
                        cardStyle: {
                            paddingBottom: 90,
                        },
                    }}
                /> */}
            </Stack.Navigator>
        </P2PProvider>
    );
};

export default P2PStack;
