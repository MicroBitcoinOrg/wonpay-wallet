import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {Header, IconButton} from '../../components/extended';
import {GlobalSettings, Language} from '../../screens';
import {Platform} from 'react-native';
import Config from 'react-native-config';
import {Navigation} from '../../types/Navigation';
import {defaultOptions} from '../config';

const Stack = createStackNavigator<Navigation.SettingsParamList>();

const SettingsStack: React.FC = () => {
    const {t} = useTranslation();

    return (
        <Stack.Navigator
            initialRouteName="GlobalSettings"
            screenOptions={{
                header: props => <Header {...props} />,
                headerStyle: {
                    height: parseInt(
                        Platform.OS === 'ios'
                            ? Config.HEADER_HEIGHT_IOS
                            : Config.HEADER_HEIGHT_ANDROID,
                    ),
                },
                cardStyle: {
                    paddingBottom: 90,
                },
                ...defaultOptions,
            }}>
            <Stack.Screen
                name="GlobalSettings"
                options={{
                    title: t('screenTitles.settings.globalSettings'),
                }}
                component={GlobalSettings}
            />
            <Stack.Screen
                name="Language"
                options={{
                    title: t('screenTitles.settings.language'),
                }}
                component={Language}
            />
        </Stack.Navigator>
    );
};

export default SettingsStack;
