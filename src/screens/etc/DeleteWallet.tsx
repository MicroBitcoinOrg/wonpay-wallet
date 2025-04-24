import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, useColorScheme} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
import {CommonActions} from '@react-navigation/native';
import {
    Container,
    FocusAwareStatusBar,
    Text,
    VStack,
} from '../../components/common';
import {Colors} from '../../theme';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    infoContainer: {
        marginTop: 30,
    },
});

interface DeleteWalletProps {
    navigation: any;
    route: any;
}

const DeleteWallet: React.FC<DeleteWalletProps> = ({
    navigation,
    route,
}: DeleteWalletProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('deleteWallet');
    const store = useAppStore();
    const {uuid} = route.params ?? {};

    useEffect(() => {
        setTimeout(() => {
            if (!uuid) {
                navigation.goBack();

                showMessage({
                    message: t('alerts.notFound.message'),
                    description: t('alerts.notFound.description'),
                    type: 'danger',
                });
            }

            if (store.wallets.length > 1) {
                store.deleteWallet(uuid);

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: 'MainTabs'}],
                    }),
                );
            } else {
                store.deleteWallet(uuid);

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: 'OnboardingStack'}],
                    }),
                );
            }

            showMessage({
                message: t('alerts.deleted.message'),
                description: t('alerts.deleted.description'),
                backgroundColor: Colors[scheme!].primary,
            });
        }, 1000);
    }, []);

    return (
        <Container gradient header={false}>
            <FocusAwareStatusBar barStyle="light-content" />
            <VStack flex={1}>
                <ActivityIndicator color="white" size="large" />
                <VStack style={styles.infoContainer}>
                    <Text variant="h3" color="white">
                        {t('deletingWallet')}
                    </Text>
                </VStack>
            </VStack>
        </Container>
    );
};

export default DeleteWallet;
