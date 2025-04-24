import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {Header} from '../../components/extended';
import {
    Finished,
    GenerateWallet,
    Legal,
    Protect,
    RecoveryPhrase,
    RecoveryTips,
    Welcome,
} from '../../screens';
import {OnboardingProvider} from '../../providers';
import {Platform} from 'react-native';
import Config from 'react-native-config';
import {Navigation} from '../../types/Navigation';
import {defaultOptions} from '../config';

const Stack = createStackNavigator<Navigation.OnboardingParamList>();

const OnboardingStack: React.FC = () => {
    const {t} = useTranslation();

    return (
        <OnboardingProvider>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
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
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                    options={{
                        title: '',
                    }}
                />
                <Stack.Screen
                    name="Legal"
                    component={Legal}
                    options={{
                        title: t('screenTitles.onboarding.legal'),
                    }}
                />
                <Stack.Screen
                    name="RecoveryTips"
                    options={{
                        title: '',
                    }}
                    component={RecoveryTips}
                />
                <Stack.Screen
                    name="Protect"
                    options={{
                        title: '',
                    }}
                    component={Protect}
                />
                <Stack.Screen
                    name="RecoveryPhrase"
                    options={{
                        header: props => <Header {...props} />,
                        title: t('screenTitles.onboarding.recoveryPhrase'),
                    }}
                    component={RecoveryPhrase}
                />
                <Stack.Screen
                    name="Finished"
                    options={{
                        title: '',
                    }}
                    component={Finished}
                />
                <Stack.Screen
                    name="GenerateWallet"
                    options={{
                        headerShown: false,
                        gestureEnabled: false,
                    }}
                    component={GenerateWallet}
                />
            </Stack.Navigator>
        </OnboardingProvider>
    );
};

export default OnboardingStack;
