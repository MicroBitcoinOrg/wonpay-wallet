import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, Switch, useColorScheme, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {getVersion} from 'react-native-device-info';
import {showMessage} from 'react-native-flash-message';
import SInfo from 'react-native-sensitive-info';
import {
    Container,
    DismissKeyboard,
    Table,
    Text,
    VStack,
} from '../../components/common';
import {TableItem} from '../../components/extended';
import {PasswordContext} from '../../providers';
import {Colors} from '../../theme';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    groupContainer: {
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 30,
    },
    infoFooter: {
        marginBottom: 20,
        marginTop: 15,
    },
});

interface GlobalSettingsProps {
    navigation: any;
}

const GlobalSettings: React.FC<GlobalSettingsProps> = ({
    navigation,
}: GlobalSettingsProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('globalSettings');
    const {unlockedPassword} = useContext(PasswordContext);
    const store = useAppStore();
    // const [name] = useState<string>(appReducer.name);
    const [sensorAvailability, setSensorAvailability] = useState(true);

    /*const handleEnterName = () => {
        dispatch(changeName({ name }));
        showMessage({
            message: t('alerts.nameChanged.message'),
            description: t('alerts.nameChanged.description'),
            backgroundColor: Colors[scheme!].primary,
        });
    };*/

    const setBiometic = async () => {
        if (store.password.useBiometric) {
            store.setPassword({useBiometric: !store.password.useBiometric});
        } else {
            try {
                await SInfo.setItem('password', unlockedPassword as string, {
                    touchID: true,
                    showModal: true,
                    kSecAccessControl: 'kSecAccessControlBiometryAny',
                });

                store.setPassword({
                    useBiometric: !store.password.useBiometric,
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const changePassword = () => {
        navigation.navigate('PasswordStack', {
            screen: 'Password',
            params: {
                type: 'unlock',
                goBack: true,
                next: {
                    stack: 'PasswordStack',
                    screen: 'Password',
                    params: {
                        type: 'new-password',
                        goBack: true,
                        next: {
                            stack: 'RootStack',
                            screen: 'MainTabs',
                        },
                    },
                },
            },
        });
    };

    const deleteAddressBook = () => {
        const confirmedDeleteAddressBook = () => {
            store.deleteAddressBook();
            showMessage({
                message: t('alerts.addressBookDeleted.message'),
                description: t('alerts.addressBookDeleted.description'),
                backgroundColor: Colors[scheme!].primary,
            });
        };

        Alert.alert(
            t('alerts.addressBookDeleteConfirmation.message'),
            t('alerts.addressBookDeleteConfirmation.description'),
            [
                {
                    text: t('alerts.addressBookDeleteConfirmation.cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: t('alerts.addressBookDeleteConfirmation.confirm'),
                    onPress: confirmedDeleteAddressBook,
                    style: 'default',
                },
            ],
            {cancelable: false},
        );
    };

    const factoryReset = () => {
        const confirmedFactoryReset = () => {
            navigation.navigate('PasswordStack', {
                screen: 'Password',
                params: {
                    type: 'unlock',
                    goBack: true,
                    next: {
                        stack: 'RootStack',
                        screen: 'FactoryReset',
                        params: {},
                    },
                },
            });
        };

        Alert.alert(
            t('alerts.factoryResetConfirmation.message'),
            t('alerts.factoryResetConfirmation.description'),
            [
                {
                    text: t('alerts.factoryResetConfirmation.cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: t('alerts.factoryResetConfirmation.confirm'),
                    onPress: confirmedFactoryReset,
                    style: 'default',
                },
            ],
            {cancelable: false},
        );
    };

    useEffect(() => {
        SInfo.isSensorAvailable().then(sensor => {
            if (!sensor) {
                setSensorAvailability(false);
            }
        });
    });

    return (
        <DismissKeyboard>
            <Container>
                <Table scrollView>
                    <View style={styles.groupContainer}>
                        <TableItem
                            title={t('changeLanguage')}
                            icon={
                                <EntypoIcon
                                    name="language"
                                    color={Colors[scheme!].textPrimary}
                                    size={30}
                                />
                            }
                            onPress={() => navigation.navigate('Language')}
                            rightContent={
                                <EntypoIcon
                                    name="chevron-thin-right"
                                    size={20}
                                    color={Colors[scheme!].textPrimary}
                                />
                            }
                        />
                        <TableItem
                            title={t('changePassword')}
                            icon={
                                <MaterialIcon
                                    name="lock-reset"
                                    color={Colors[scheme!].textPrimary}
                                    size={30}
                                />
                            }
                            onPress={changePassword}
                            rightContent={
                                <EntypoIcon
                                    name="chevron-thin-right"
                                    size={20}
                                    color={Colors[scheme!].textPrimary}
                                />
                            }
                        />

                        <TableItem
                            title={t('useTouchID')}
                            icon={
                                <MaterialIcon
                                    name="fingerprint"
                                    color={Colors[scheme!].textPrimary}
                                    size={30}
                                />
                            }
                            rightContent={
                                <Switch
                                    disabled={!sensorAvailability}
                                    onValueChange={setBiometic}
                                    value={store.password.useBiometric}
                                />
                            }
                        />
                    </View>
                    <View style={styles.groupContainer}>
                        <TableItem
                            title={t('deleteAddressBook')}
                            onPress={deleteAddressBook}
                            icon={
                                <MaterialIcon
                                    color={Colors[scheme!].textPrimary}
                                    name="bookmark-off-outline"
                                    size={30}
                                />
                            }
                        />
                        <TableItem
                            title={t('factoryReset')}
                            onPress={factoryReset}
                            icon={
                                <MaterialIcon
                                    color={Colors[scheme!].textPrimary}
                                    name="delete-variant"
                                    size={30}
                                />
                            }
                        />
                    </View>
                </Table>
                <VStack
                    justifyContent="space-between"
                    style={styles.infoFooter}>
                    <Text color="textSecondary">v. {getVersion()}</Text>
                </VStack>
            </Container>
        </DismissKeyboard>
    );
};

export default GlobalSettings;
