import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, useColorScheme, View} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
import SInfo from 'react-native-sensitive-info';
import {
    Container,
    DismissKeyboard,
    FocusAwareStatusBar,
    HStack,
    Text,
    VStack,
} from '../../components/common';
import {Button, Input} from '../../components/extended';
import {PasswordContext} from '../../providers';
import {decryptData, encryptData} from '../../utils/common';
import {Dot, Pad} from './components';
import {Colors} from '../../theme';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    dotContainer: {
        marginHorizontal: 10,
    },
    numbersContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerContainer: {
        marginBottom: 20,
    },
    titleContainer: {
        marginBottom: 5,
    },
    passwordInput: {
        color: 'white',
        fontSize: 21,
    },
    authButtonText: {
        textDecorationLine: 'underline',
    },
});

interface PasswordProps {
    navigation: any;
    route: any;
}

const Password: React.FC<PasswordProps> = ({
    navigation,
    route,
}: PasswordProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('password');
    const store = useAppStore();
    const [biometricUpdate, setBiometricUpdate] = useState(false);
    const {setUnlockedPassword, unlockedPassword} = useContext(PasswordContext);
    const [passwordValue, setPasswordValue] = useState<string>('');
    const [newPasswordValue, setNewPasswordValue] = useState<string>('');
    const [step, setStep] = useState<'type-password' | 'repeat-password'>(
        'type-password',
    );
    const {type, next, goBack} = route.params ?? {goBack: false};

    const handlePin = (number: number) => {
        if (passwordValue.length < 6)
            setPasswordValue(`${passwordValue}${number}`);
    };

    const deleteNum = () => {
        if (passwordValue.length > 0)
            setPasswordValue(passwordValue.slice(0, -1));
    };

    const reset = () => {
        setStep('type-password');
        setPasswordValue('');
        setNewPasswordValue('');
    };

    const setNewPassword = async (
        password: string,
        useBiometric: boolean,
        isSensorAvailable = true,
    ) => {
        if (isSensorAvailable) {
            try {
                await SInfo.setItem('password', password, {
                    touchID: true,
                    showModal: true,
                    kSecAccessControl: 'kSecAccessControlBiometryAny',
                });
            } catch (e) {
                useBiometric = false;
                console.warn('Error while setting keychain password. ', e);
            }
        }

        if (store.password.value) {
            if (!unlockedPassword) {
                showMessage({
                    message: t('appNotUnlocked.message'),
                    description: t('appNotUnlocked.description'),
                    type: 'danger',
                });

                return;
            }

            if (store.wallets.length > 0) {
                const decryptedWallets = [];
                const newEncryptedWallets = [];

                for (let i = 0; i < store.wallets.length; ++i) {
                    decryptedWallets.push({
                        ...store.wallets[i],
                        seedPhrase: decryptData(
                            store.wallets[i].seedPhrase,
                            unlockedPassword,
                        ),
                        addresses: store.wallets[i].addresses.map(
                            (address: any) => {
                                return {
                                    ...address,
                                    wif: decryptData(
                                        address.wif,
                                        unlockedPassword,
                                    ),
                                };
                            },
                        ),
                    });
                }

                for (let i = 0; i < decryptedWallets.length; ++i) {
                    newEncryptedWallets.push({
                        ...decryptedWallets[i],
                        seedPhrase: encryptData(
                            decryptedWallets[i].seedPhrase,
                            password,
                        ),
                        addresses: decryptedWallets[i].addresses.map(
                            (address: any) => {
                                return {
                                    ...address,
                                    wif: encryptData(address.wif, password),
                                };
                            },
                        ),
                    });
                }

                store.updateWallets(newEncryptedWallets);
            }
        }

        store.setPassword({
            value: encryptData(password, password),
            useBiometric,
        });
        setUnlockedPassword(password);

        showMessage({
            message: t('alerts.newPasswordCreated.message'),
            description: t('alerts.newPasswordCreated.description'),
            backgroundColor: Colors[scheme!].primary,
        });

        if (!next) {
            navigation.replace('OnboardingStack');
        } else {
            navigation.replace(next.stack, {
                screen: 'screen' in next ? next.screen : undefined,
                params: 'params' in next ? next.params : {},
            });
        }
    };

    const handleNewPassword = (first: string, second: string) => {
        if (first === second) {
            SInfo.isSensorAvailable().then(sensor => {
                if (sensor) {
                    Alert.alert(
                        t('alerts.useBiometric.message'),
                        t('alerts.useBiometric.description'),
                        [
                            {
                                text: t('alerts.useBiometric.cancel'),
                                onPress: () => setNewPassword(first, false),
                                style: 'cancel',
                            },
                            {
                                text: t('alerts.useBiometric.ok'),
                                onPress: () => setNewPassword(first, true),
                            },
                        ],
                        {cancelable: false},
                    );
                } else {
                    setNewPassword(first, false, false);
                }
            });
        } else {
            showMessage({
                message: t('alerts.passwordsNotMatch.message'),
                description: t('alerts.passwordsNotMatch.description'),
                type: 'danger',
            });
        }

        reset();
    };

    const handleBiometricUpdate = (password: string) => {
        if (password && password !== '') {
            try {
                SInfo.setItem('password', password, {
                    touchID: true,
                    showModal: true,
                    kSecAccessControl: 'kSecAccessControlBiometryAny',
                });
            } catch (e) {
                store.setPassword({useBiometric: false});
                console.warn('Error while setting keychain password. ', e);
            }

            setBiometricUpdate(false);
        }
    };

    const handleUnlock = (password: string) => {
        if (
            password &&
            store.password.value &&
            password === decryptData(store.password.value, password)
        ) {
            setUnlockedPassword(password);

            if (biometricUpdate) {
                handleBiometricUpdate(password);
            }

            if (next) {
                navigation.replace(next.stack, {
                    screen: next.screen,
                    params: 'params' in next ? next.params : {},
                });
            } else {
                navigation.goBack();
            }
        } else {
            setPasswordValue('');

            showMessage({
                message: t('alerts.passwordIncorrect.message'),
                description: t('alerts.passwordIncorrect.description'),
                type: 'danger',
            });
        }
    };

    const handleProcessTypes = () => {
        if (type === 'new-password') {
            if (step === 'type-password') {
                setStep('repeat-password');
                setNewPasswordValue(passwordValue);
                setPasswordValue('');
            } else if (step === 'repeat-password') {
                handleNewPassword(newPasswordValue, passwordValue);
            }
        }

        if (type === 'unlock') {
            handleUnlock(passwordValue);
        }
    };

    const handleEnterPassword = () => {
        if (passwordValue.length >= 4) {
            handleProcessTypes();
        } else {
            showMessage({
                message: t('alerts.passwordTooShort.message'),
                description: t('alerts.passwordTooShort.description'),
                type: 'danger',
            });
        }
    };

    const handleChangeAuthMethod = () => {
        navigation.navigate('ChangePasswordMethod');
        reset();
    };

    const unlockByBiometric = () => {
        SInfo.isSensorAvailable()
            .then(sensor => {
                if (sensor) {
                    SInfo.getItem('password', {
                        touchID: true,
                        showModal: true,
                        strings: {
                            description: t('androidBiometric.description'),
                            header: t('androidBiometric.header'),
                        },
                        kSecUseOperationPrompt: t('iosBiometric.prompt'),
                    }).then(data => {
                        if (data) {
                            handleUnlock(data);
                        } else {
                            showMessage({
                                message: t('alerts.passwordIncorrect.message'),
                                description: t(
                                    'alerts.passwordIncorrect.description',
                                ),
                                type: 'danger',
                            });

                            setBiometricUpdate(true);
                        }
                    });
                }
            })
            .catch(e => {
                Alert.alert('Error', e.message);
            });
    };

    useEffect(() => {
        if (store.password.type === 'pin' && passwordValue.length === 6) {
            handleProcessTypes();
        }
    }, [passwordValue]);

    useEffect(() => {
        if (type === 'unlock' && store.password.useBiometric) {
            unlockByBiometric();
        }
        if (!goBack) {
            navigation.setOptions({
                headerLeft: () => null,
                gestureEnabled: false,
            });
        }
    }, []);

    return (
        <DismissKeyboard>
            <Container
                gradient
                areaStyle={styles.container}
                safeArea
                header={false}>
                <FocusAwareStatusBar barStyle="light-content" />
                <VStack style={styles.headerContainer}>
                    <View style={styles.titleContainer}>
                        <Text variant="h3" color="white">
                            {type === 'new-password' &&
                                (store.password.type === 'pin'
                                    ? t('title.newPassword.pin')
                                    : t('title.newPassword.password'))}
                            {type === 'unlock' && t('title.unlock')}
                        </Text>
                    </View>
                    <Text variant="body3" color="white" opacity={0.5}>
                        {type === 'new-password' &&
                            step === 'type-password' &&
                            (store.password.type === 'pin'
                                ? t('description.newPassword.pin')
                                : t('description.newPassword.password'))}
                        {type === 'new-password' &&
                            step === 'repeat-password' &&
                            (store.password.type === 'pin'
                                ? t('description.newPassword.repeat.pin')
                                : t('description.newPassword.repeat.password'))}
                        {type === 'unlock' &&
                            (store.password.type === 'pin'
                                ? t('description.unlock.pin')
                                : t('description.unlock.password'))}
                    </Text>
                </VStack>
                <VStack flex={1}>
                    {store.password.type === 'pin' && (
                        <HStack>
                            <Dot
                                filled={passwordValue[0] !== undefined}
                                style={styles.dotContainer}
                            />
                            <Dot
                                filled={passwordValue[1] !== undefined}
                                style={styles.dotContainer}
                            />
                            <Dot
                                filled={passwordValue[2] !== undefined}
                                style={styles.dotContainer}
                            />
                            <Dot
                                filled={passwordValue[3] !== undefined}
                                style={styles.dotContainer}
                            />
                            <Dot
                                filled={passwordValue[4] !== undefined}
                                style={styles.dotContainer}
                            />
                            <Dot
                                filled={passwordValue[5] !== undefined}
                                style={styles.dotContainer}
                            />
                        </HStack>
                    )}
                    {store.password.type === 'password' && (
                        <Input
                            placeholder="*********"
                            placeholderTextColor="#cccccc"
                            autoFocus
                            secureTextEntry
                            value={passwordValue}
                            onChangeText={text => setPasswordValue(text)}
                            onSubmitEditing={handleEnterPassword}
                            size="lg"
                            color="white"
                            rightContent={
                                <Button
                                    color="white"
                                    type="text"
                                    title={t('enterButton')}
                                    onPress={handleEnterPassword}
                                />
                            }
                        />
                    )}
                    <Button
                        title={t('changeAuthMethod')}
                        type="text"
                        color="white"
                        style={{marginTop: 30}}
                        onPress={handleChangeAuthMethod}
                    />
                </VStack>

                {store.password.type === 'pin' ? (
                    <View style={styles.numbersContainer}>
                        <Pad onPress={() => handlePin(1)}>
                            <Text variant="number1" color="white">
                                1
                            </Text>
                        </Pad>
                        <Pad onPress={() => handlePin(2)}>
                            <Text variant="number1" color="white">
                                2
                            </Text>
                        </Pad>
                        <Pad onPress={() => handlePin(3)}>
                            <Text variant="number1" color="white">
                                3
                            </Text>
                        </Pad>
                        <Pad onPress={() => handlePin(4)}>
                            <Text variant="number1" color="white">
                                4
                            </Text>
                        </Pad>
                        <Pad onPress={() => handlePin(5)}>
                            <Text variant="number1" color="white">
                                5
                            </Text>
                        </Pad>
                        <Pad onPress={() => handlePin(6)}>
                            <Text variant="number1" color="white">
                                6
                            </Text>
                        </Pad>
                        <Pad onPress={() => handlePin(7)}>
                            <Text variant="number1" color="white">
                                7
                            </Text>
                        </Pad>
                        <Pad onPress={() => handlePin(8)}>
                            <Text variant="number1" color="white">
                                8
                            </Text>
                        </Pad>
                        <Pad onPress={() => handlePin(9)}>
                            <Text variant="number1" color="white">
                                9
                            </Text>
                        </Pad>
                        <Pad
                            hidden={
                                type !== 'unlock' ||
                                store.password.useBiometric === false
                            }
                            onPress={unlockByBiometric}>
                            <Ionicon
                                name="finger-print-outline"
                                size={40}
                                color="white"
                            />
                        </Pad>
                        <Pad onPress={() => handlePin(0)}>
                            <Text variant="number1" color="white">
                                0
                            </Text>
                        </Pad>
                        <Pad onPress={deleteNum}>
                            <Ionicon
                                name="backspace-outline"
                                size={40}
                                color="white"
                            />
                        </Pad>
                    </View>
                ) : (
                    <HStack flex={1} />
                )}
            </Container>
        </DismissKeyboard>
    );
};

export default Password;
