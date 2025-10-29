import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {
    BottomSheetPicker,
    Header,
    IconButton,
    PickerOption,
} from '@/components/extended';
import NewOffer from '@/screens/p2p/newOffer/NewOffer';
import NewTrade from '@/screens/p2p/newTrade/NewTrade';
import Account from '@/screens/p2p/account/Account';
import P2PWithdraw from '@/screens/p2p/withdraw/P2PWithdraw';
import Settings from '@/screens/p2p/Settings';
import {Platform} from 'react-native';
import Config from 'react-native-config';
import {Navigation} from '@/types/Navigation';
import {defaultOptions} from '@/routes/config';
import {useP2PNavigation, useRootNavigation} from '@/hooks/useTypedNavigation';
import useAppStore from '@/store/appStore';
import {useNavigation} from '@react-navigation/native';
import {base64ToHex} from '@/utils/common';

const Stack = createStackNavigator<Navigation.P2PParamList>();

const P2PStack: React.FC = () => {
    const {t} = useTranslation();
    const store = useAppStore();

    const mappedWallets: PickerOption[] = store.wallets.map(wallet => ({
        label: wallet.title,
        value: wallet.uuid,
        avatarProps: {
            backgroundColor: `#${base64ToHex(
                wallet.chains.microbitcoin.depositAddress,
            ).substring(0, 6)}`,
            color: 'white',
        },
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
            <Stack.Screen
                name="Withdraw"
                component={P2PWithdraw}
                options={{
                    title: t('screenTitles.p2p.withdraw', {
                        defaultValue: 'Withdraw',
                    }),
                    cardStyle: {
                        paddingBottom: 90,
                    },
                }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                    title: t('common:screenTitles.p2p.settings'),
                }}
            />
        </Stack.Navigator>
    );
};

export default P2PStack;
