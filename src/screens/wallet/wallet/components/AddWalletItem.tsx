import React from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacityProps, useColorScheme } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import { HStack, Text, VStack } from '../../../../components/common';
import { Colors } from '../../../../theme';

const styles = StyleSheet.create({
    container: {
        height: 175,
        padding: 15,
        marginLeft: 20,
        borderRadius: 10,
        justifyContent: 'space-between',
    },
    contentContainer: {
        opacity: 0.2,
    },
});

type AddWalletItemProps = TouchableOpacityProps;

const AddWalletItem: React.FC<AddWalletItemProps> = ({ style, ...props }: AddWalletItemProps) => {
    const scheme = useColorScheme();
    const { t } = useTranslation('wallet');

    return (
        <Pressable style={[styles.container, { backgroundColor: Colors[scheme!].card }, style]} {...props}>
            <HStack justifyContent="flex-start" style={styles.contentContainer}>
                <Image
                    source={require('../../../../assets/logo.png')}
                    style={{ height: 32, width: 65, tintColor: Colors[scheme!].textPrimary }}
                />
            </HStack>
            <VStack flex={1} style={styles.contentContainer}>
                <AntDesignIcon name="plus" color={Colors[scheme!].textPrimary} size={80} />
                <Text variant="body3">{t('addNewWallet')}</Text>
            </VStack>
        </Pressable>
    );
};

export default AddWalletItem;
