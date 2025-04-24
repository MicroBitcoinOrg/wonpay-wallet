import React, {useContext, useEffect, useState} from 'react';
import {Platform, StyleSheet, Switch, useColorScheme, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {isAddress} from '../../utils/address';
import {
    Container,
    DismissKeyboard,
    Divider,
    HStack,
    KeyboardAvoidingView,
    Text,
    VStack,
} from '../../components/common';
import {Button, IconButton, Input} from '../../components/extended';
import {Colors} from '../../theme';
import useAppStore from '../../store/appStore';
import {WalletContext} from '../../providers';

interface ManageAddressBookItemProps {
    navigation: any;
    route: any;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    dividerContainer: {
        padding: 20,
    },
});

const ManageAddressBookItem: React.FC<ManageAddressBookItemProps> = ({
    navigation,
    route,
}: ManageAddressBookItemProps) => {
    const {walletChain} = useContext(WalletContext);
    const scheme = useColorScheme();
    const {t} = useTranslation('manageAddressBookItem');
    const {type, ...params} = route.params ?? {
        address: '',
        title: '',
        favorite: false,
    };
    const store = useAppStore();
    const [address, setAddress] = useState<string>(params.address);
    const [title, setTitle] = useState<string>(params.title);
    const [favorite, setFavorite] = useState<boolean>(params.favorite);

    const saveAddressBook = () => {
        store.saveAddressBookItem({
            address,
            title,
            favorite,
            chain: walletChain!.key,
        });
        navigation.goBack();

        showMessage({
            message: t('alerts.addressSaved.message'),
            description: t('alerts.addressSaved.description'),
            backgroundColor: Colors[scheme!].primary,
        });
    };

    const getFromQRCode = () => {
        navigation.navigate('QRCodeScanner', {
            type: 'address-book',
        });
    };

    useEffect(() => {
        if (route.params?.address) {
            setAddress(route.params.address);
        }

        if (route.params?.title) {
            setTitle(route.params.title);
        }

        if (route.params?.favorite) {
            setFavorite(route.params.favorite);
        }
    }, [route.params]);

    return (
        <DismissKeyboard>
            <Container paddingBottom>
                <KeyboardAvoidingView style={styles.container}>
                    <HStack style={styles.dividerContainer}>
                        {Platform.OS === 'ios' && <Divider />}
                    </HStack>
                    <HStack
                        style={{marginBottom: 20}}
                        justifyContent="flex-start">
                        <Text variant="h3">
                            {type === 'edit'
                                ? t('editAddress')
                                : t('addAddress')}
                        </Text>
                    </HStack>
                    <VStack
                        flex={1}
                        alignItems="flex-start"
                        justifyContent="flex-start">
                        <View style={styles.inputContainer}>
                            <Text variant="body1">{t('title.title')}</Text>
                            <Input
                                placeholder={t('title.placeholder')}
                                autoFocus
                                onChangeText={text => setTitle(text)}
                                value={title}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text variant="body1">{t('address.title')}</Text>
                            <Input
                                placeholder={t('address.placeholder')}
                                onChangeText={text => setAddress(text)}
                                value={address}
                                rightContent={
                                    <IconButton
                                        onPress={getFromQRCode}
                                        transparent
                                        color={
                                            scheme === 'dark'
                                                ? 'textPrimary'
                                                : 'primary'
                                        }
                                        iconSet="ionicons"
                                        name="scan-outline"
                                    />
                                }
                            />
                        </View>
                        <HStack
                            style={styles.inputContainer}
                            justifyContent="space-between">
                            <Text variant="body1">{t('favorite')}</Text>
                            <Switch
                                onValueChange={() => setFavorite(!favorite)}
                                value={favorite}
                            />
                        </HStack>
                    </VStack>
                    <Button
                        title={
                            type === 'edit'
                                ? t('confirmButton.save')
                                : t('confirmButton.add')
                        }
                        onPress={saveAddressBook}
                        style={{marginVertical: 20}}
                        disabled={
                            !isAddress(address, walletChain!.regex.address) ||
                            !title ||
                            title.length === 0
                        }
                    />
                </KeyboardAvoidingView>
            </Container>
        </DismissKeyboard>
    );
};

export default ManageAddressBookItem;
