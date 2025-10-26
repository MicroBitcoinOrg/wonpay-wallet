import React, {useCallback, useContext, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {View} from 'react-native';

import {Avatar, HStack, Text} from '../../../../components/common';
import {BottomSheet, Button, TableItem} from '../../../../components/extended';
import {Wallet} from '../../../../types/Wallet';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
    getAuthMessage,
    requestImageUpload,
    uploadSignedImage,
} from '../../../../services/microbitcoin/api/icons';
import {showMessage} from 'react-native-flash-message';
import {MICROBITCOIN} from '../../../../utils/constants';
import useWithdrawalUtils from '../../../../services/hooks/useWithdrawalUtils';
import {Colors} from '../../../../theme';
import {useColorScheme} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {pick, types} from '@react-native-documents/picker';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {PasswordContext, useWallet, WalletContext} from '../../../../providers';
import {signMessage} from '../../../../utils/address';
import {decryptData, encryptData} from '../../../../utils/common';
import useBalanceUtils from '../../../../services/hooks/useBalanceUtils';

interface ChangeIconProps {
    balance: Wallet.Balance;
}

type Slide = {
    subtitle: string;
    text: string;
};

const ChangeIcon: React.FC<ChangeIconProps> = ({balance}: ChangeIconProps) => {
    const navigation = useNavigation();
    const {t} = useTranslation('tokenSettings');
    const scheme = useColorScheme();
    const {walletChain, chainKey} = useWallet();
    const {unlockedPassword} = useContext(PasswordContext);
    const {getCurrencyIcon} = useBalanceUtils({chain: chainKey!});

    const address = walletChain?.addresses.find(
        add => add.address === walletChain?.depositAddress,
    );

    const {data: authMessage, isFetching: isLoadingAuthMessage} = useQuery({
        queryKey: ['authMessage'],
        queryFn: getAuthMessage,
    });

    const borderColor = useMemo(() => {
        return Colors[scheme!].border;
    }, [scheme]);

    const DATA: Slide[] = [
        {
            subtitle: t('changeIcon.imageSize'),
            text: t('changeIcon.imageSizeDescription'),
        },
        {
            subtitle: t('changeIcon.imageFormat'),
            text: t('changeIcon.imageFormatDescription'),
        },
    ];

    const {mutate: uploadImage, isPending: isUploading} = useMutation({
        mutationFn: uploadSignedImage,
        onSuccess: data => {
            showMessage({
                message: t('changeIcon.title'),
                description: t('changeIcon.successMessage'),
                backgroundColor: Colors[scheme!].primary,
            });

            navigation.navigate('RootStack', {
                screen: 'MainTabs',
                params: {
                    screen: 'WalletStack',
                    params: {
                        screen: 'Wallet',
                    },
                },
            });
        },
        onError: error => {
            showMessage({
                message: t('changeIcon.title'),
                description: error.message,
                type: 'danger',
            });
        },
    });

    const handleOpenDocument = async () => {
        const result = await pick({
            mode: 'open',
            type: [types.images],
        });

        if (result.length === 0) {
            return null;
        }

        return {
            uri: result[0].uri,
            type: result[0].type,
            name: result[0].name,
        };
    };

    const handleOpenImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: false,
            maxHeight: 512,
            maxWidth: 512,
            quality: 1,
        });
        if (result.didCancel) {
            console.log(t('changeIcon.userCancelled'));
            return null;
        } else if (result.errorCode) {
            console.log(t('changeIcon.imagePickerError'), result.errorMessage);
            return null;
        } else if (result.assets && result.assets.length > 0) {
            const image = result.assets[0];

            return {
                uri: image.uri,
                type: image.type,
                name: image.fileName,
            };
        }

        return null;
    };

    const handleManageTokenIcon = async (method: 'document' | 'photo') => {
        const image =
            method === 'document'
                ? await handleOpenDocument()
                : await handleOpenImage();

        if (image) {
            try {
                const signature = signMessage(
                    decryptData(address?.wif, unlockedPassword!),
                    authMessage!.message,
                    MICROBITCOIN.network,
                );

                uploadImage({
                    token: balance.currency.ticker.replace('!', ''),
                    image: {
                        uri: image.uri!,
                        type: image.type!,
                        name: image.name!,
                    },
                    message: authMessage!.message,
                    signature: signature,
                    address: walletChain!.depositAddress,
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const renderContent = useCallback(() => {
        return (
            <View style={{flex: 1, gap: 20}}>
                <Text variant="h3">{t('changeIcon.title')}</Text>
                <Text variant="body3">{t('changeIcon.description')}</Text>
                <View
                    style={{
                        gap: 15,
                        borderWidth: 1,
                        borderColor: borderColor,
                        borderRadius: 10,
                        padding: 15,
                    }}>
                    {DATA.map((tip, index) => {
                        return (
                            <View key={index}>
                                <View>
                                    <Text variant="body2">{tip.subtitle}</Text>
                                </View>
                                <Text variant="body3" opacity={0.5}>
                                    {tip.text}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                <HStack style={{gap: 20}}>
                    <Button
                        disabled={isUploading || isLoadingAuthMessage}
                        title={t('changeIcon.filesButton')}
                        onPress={() => handleManageTokenIcon('document')}
                        type="outlined"
                        border
                        borderColor="border"
                        color="textPrimary"
                        flex={1}
                        leftContent={
                            <IoniconsIcon
                                name="file-tray"
                                size={15}
                                color={Colors[scheme!].textPrimary}
                            />
                        }
                    />
                    <Button
                        disabled={isUploading || isLoadingAuthMessage}
                        title={t('changeIcon.photoLibraryButton')}
                        onPress={() => handleManageTokenIcon('photo')}
                        flex={1}
                        leftContent={
                            <IoniconsIcon
                                name="image"
                                size={15}
                                color="white"
                            />
                        }
                    />
                </HStack>
            </View>
        );
    }, [scheme, borderColor, isUploading, isLoadingAuthMessage]);

    return (
        <BottomSheet content={renderContent()}>
            <TableItem
                title={t('changeIcon.title')}
                icon={
                    <Avatar
                        backgroundColor={Colors[scheme!].card}
                        source={{
                            uri: getCurrencyIcon({
                                currency: balance.currency,
                            }),
                        }}
                    />
                }
            />
        </BottomSheet>
    );
};

export default ChangeIcon;
