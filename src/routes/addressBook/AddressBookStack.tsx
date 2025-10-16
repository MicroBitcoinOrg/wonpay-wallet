import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { AddressBook } from '../../screens';
import { Header, IconButton } from '../../components/extended';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import { Navigation } from '../../types/Navigation';
import { defaultOptions } from '../config';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator<Navigation.AddressBookParamList>();

const AddressBookStack: React.FC = () => {
    const { t } = useTranslation();
    const parentNavigation = useNavigation<Navigation.AppNavigationProp>();

    return (
        <Stack.Navigator
            initialRouteName="AddressBook"
            screenOptions={{
                header: (props) => <Header {...props} />,
                headerStyle: {
                    height: parseInt(Platform.OS === 'ios' ? Config.HEADER_HEIGHT_IOS : Config.HEADER_HEIGHT_ANDROID),
                },
                ...defaultOptions,
            }}
        >
            <Stack.Screen
                name="AddressBook"
                options={() => ({
                    title: t('screenTitles.addressBook.addressBook'),
                    headerRight: () => (
                        <IconButton
                            onPress={() =>
                                parentNavigation.navigate('ManageAddressBookItem', {
                                    address: '',
                                    title: '',
                                    favorite: false,
                                })
                            }
                            name="add"
                            iconSet="ionicons"
                            transparent
                        />
                    ),
                })}
                component={AddressBook}
            />
        </Stack.Navigator>
    );
};

export default AddressBookStack;
