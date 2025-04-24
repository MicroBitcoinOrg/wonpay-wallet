import React, {useContext, useState} from 'react';
import {Alert, StyleSheet, useColorScheme, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import {showMessage} from 'react-native-flash-message';
import {decryptData} from '../../utils/common';
import {PasswordContext, WalletContext} from '../../providers';
import {Container, DismissKeyboard, Table, Text} from '../../components/common';
import {Input, TableItem} from '../../components/extended';
import {Colors} from '../../theme';
import {useQueryClient} from 'react-query';

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 30,
    },
});

interface SettingsProps {
    navigation: any;
}

const Settings: React.FC<SettingsProps> = ({navigation}: SettingsProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('settings');
    const {wallet, deleteCache, changeWalletTitle} = useContext(WalletContext);
    const {unlockedPassword} = useContext(PasswordContext);
    const [walletTitle, setWalletTitle] = useState<string>(wallet!.title);
    const queryClient = useQueryClient();

    const handleEnterWalletTitle = () => {
        if (walletTitle.length > 0) {
            changeWalletTitle!(walletTitle);
            showMessage({
                message: t('alerts.titleChanged.message'),
                description: t('alerts.titleChanged.description'),
                backgroundColor: Colors[scheme!].primary,
            });
        }
    };

    const copySeedPhrase = () => {
        const confirmedCopySeedPhrase = () => {
            if (unlockedPassword) {
                Clipboard.setString(
                    decryptData(wallet!.seedPhrase, unlockedPassword),
                );
                showMessage({
                    message: t('alerts.seedPhraseCopied.message'),
                    description: t('alerts.seedPhraseCopied.description'),
                    backgroundColor: Colors[scheme!].primary,
                });
            }
        };

        Alert.alert(
            t('alerts.seedPhraseCopyConfirmation.message'),
            t('alerts.seedPhraseCopyConfirmation.description'),
            [
                {
                    text: t('alerts.seedPhraseCopyConfirmation.cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: t('alerts.seedPhraseCopyConfirmation.confirm'),
                    onPress: confirmedCopySeedPhrase,
                    style: 'default',
                },
            ],
            {cancelable: false},
        );
    };

    const deleteWalletCache = () => {
        const confirmedDeleteCache = () => {
            deleteCache!();
            showMessage({
                message: t('alerts.cacheDeleted.message'),
                description: t('alerts.cacheDeleted.description'),
                backgroundColor: Colors[scheme!].primary,
            });
        };

        Alert.alert(
            t('alerts.cacheDeleteConfirmation.message'),
            t('alerts.cacheDeleteConfirmation.description'),
            [
                {
                    text: t('alerts.cacheDeleteConfirmation.cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: t('alerts.cacheDeleteConfirmation.confirm'),
                    onPress: confirmedDeleteCache,
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    };

    const deleteWalletItem = () => {
        const confirmedDeleteWallet = () => {
            navigation.navigate('PasswordStack', {
                screen: 'Password',
                params: {
                    type: 'unlock',
                    goBack: true,
                    next: {
                        stack: 'RootStack',
                        screen: 'DeleteWallet',
                        params: {uuid: wallet!.uuid},
                    },
                },
            });
        };

        if (!queryClient.isFetching()) {
            Alert.alert(
                t('alerts.deleteWalletConfirmation.message'),
                t('alerts.deleteWalletConfirmation.description'),
                [
                    {
                        text: t('alerts.deleteWalletConfirmation.cancel'),
                        onPress: () => null,
                        style: 'cancel',
                    },
                    {
                        text: t('alerts.deleteWalletConfirmation.confirm'),
                        onPress: confirmedDeleteWallet,
                        style: 'destructive',
                    },
                ],
                {cancelable: false},
            );
        }
    };

    return (
        <DismissKeyboard>
            <Container>
                <View>
                    <View style={styles.inputContainer}>
                        <Text variant="body1">{t('walletTitle.title')}</Text>
                        <Input
                            placeholder={t('walletTitle.placeholder')}
                            onChangeText={(text: string) =>
                                setWalletTitle(text)
                            }
                            value={walletTitle}
                            onSubmitEditing={handleEnterWalletTitle}
                        />
                    </View>
                </View>
                <Table>
                    <TableItem
                        title={t('deleteHistoryCache')}
                        onPress={deleteWalletCache}
                        icon={
                            <MaterialIcon
                                name="history"
                                color={Colors[scheme!].textPrimary}
                                size={30}
                            />
                        }
                    />
                    <TableItem
                        title={t('copySeedPhrase')}
                        onPress={copySeedPhrase}
                        icon={
                            <MaterialIcon
                                name="shield-outline"
                                color={Colors[scheme!].textPrimary}
                                size={30}
                            />
                        }
                    />
                    <TableItem
                        title={t('deleteWallet')}
                        onPress={deleteWalletItem}
                        icon={
                            <MaterialIcon
                                name="delete-variant"
                                color={Colors[scheme!].textPrimary}
                                size={30}
                            />
                        }
                    />
                </Table>
            </Container>
        </DismissKeyboard>
    );
};

export default Settings;
