import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/extended';
import { ChangePasswordMethod, Password } from '../../screens';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import { Navigation } from '../../types/Navigation';
import { defaultOptions } from '../config';

const Stack = createStackNavigator<Navigation.PasswordParamList>();

const PasswordStack: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Stack.Navigator
            initialRouteName="Password"
            screenOptions={{
                header: (props) => <Header transparent {...props} />,
                headerTransparent: true,
                headerStyle: {
                    height: parseInt(Platform.OS === 'ios' ? Config.HEADER_HEIGHT_IOS : Config.HEADER_HEIGHT_ANDROID),
                },
                ...defaultOptions,
            }}
        >
            <Stack.Screen
                name="Password"
                component={Password}
                options={{
                    title: '',
                }}
            />
            <Stack.Screen
                name="ChangePasswordMethod"
                options={{
                    title: t('screenTitles.password.changePasswordMethod'),
                }}
                component={ChangePasswordMethod}
            />
        </Stack.Navigator>
    );
};

export default PasswordStack;
