import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {ChooseList, ManageAddressBookItem} from '../../screens';
import {RootStack} from '../';
import {Navigation} from '../../types/Navigation';
import {Text} from '../../components/common';
import {View} from 'react-native';

const Stack = createStackNavigator<Navigation.ModalParamList>();

const ModalStack = () => {
    const {t} = useTranslation();

    return (
        <Stack.Navigator
            screenOptions={{presentation: 'modal', headerShown: false}}>
            <Stack.Screen name="RootStack" component={RootStack} />
            <Stack.Screen name="ChooseList" component={ChooseList} />

            <Stack.Screen
                name="ManageAddressBookItem"
                options={{
                    title: t('screenTitles.addressBook.addAddress'),
                }}
                component={ManageAddressBookItem}
            />
        </Stack.Navigator>
    );
};

export default ModalStack;
