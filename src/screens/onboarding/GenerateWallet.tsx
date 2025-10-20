import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {useTranslation} from 'react-i18next';
import KeepAwake from '@sayem314/react-native-keep-awake';
import {OnboardingContext} from '../../providers';
import {
    Container,
    FocusAwareStatusBar,
    Text,
    VStack,
} from '../../components/common';
import {showMessage} from 'react-native-flash-message';
import useAppStore from '../../store/appStore';
import useWalletUtils from '../../services/hooks/useWalletUtils';
import {useQuery} from '@tanstack/react-query';

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    infoContainer: {
        marginTop: 30,
    },
    titleContainer: {
        marginBottom: 15,
    },
});

interface GenerateWalletProps {
    navigation: any;
}

const GenerateWallet: React.FC<GenerateWalletProps> = ({
    navigation,
}: GenerateWalletProps) => {
    const {t} = useTranslation('generateWallet');
    const store = useAppStore();
    const {onboarding, dispatchOnboardingAction} =
        useContext(OnboardingContext);

    const {createWallet} = useWalletUtils({chain: onboarding!.wallet.chain!});

    const handleCreateWallet = async () => {
        try {
            const wallet = await createWallet({
                seedPhrase: onboarding?.wallet.seedPhrase!,
                title: onboarding?.wallet.title!,
                offset: 20,
                type: onboarding!.processType,
            });

            return wallet;
        } catch (e) {
            throw e;
        }
    };

    const {data, isError, error, isSuccess} = useQuery({
        queryKey: [
            'wallet',
            onboarding?.wallet.chain,
            onboarding?.wallet.seedPhrase,
            onboarding?.wallet.title,
            onboarding?.processType,
        ],
        queryFn: handleCreateWallet,
        retry: false,
        enabled:
            onboarding?.wallet.chain !== undefined &&
            onboarding?.wallet.seedPhrase !== undefined &&
            onboarding?.wallet.title !== undefined &&
            onboarding?.processType !== undefined,
    });

    useEffect(() => {
        if (isError) {
            showMessage({
                message: 'Wallet',
                description: error.message,
                type: 'danger',
            });

            navigation.goBack();
        }
    }, [isError]);

    useEffect(() => {
        if (isSuccess && data) {
            store.setNewWallet(data);
            dispatchOnboardingAction({type: 'resetWalletValues'});

            navigation.reset({
                index: 0,
                routes: [{name: 'MainTabs'}],
            });
        }
    }, [isSuccess, data]);

    return (
        <Container gradient header={false}>
            <FocusAwareStatusBar barStyle="light-content" />
            <KeepAwake />
            <VStack flex={1} alignItems="center" justifyContent="center">
                <LottieView
                    speed={1}
                    style={{height: 100, width: 100}}
                    source={require('../../assets/loader.json')}
                    autoPlay
                    loop
                />
                <VStack style={styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Text variant="h3" color="white">
                            {t('title')}
                        </Text>
                    </View>
                    <Text variant="body2" color="white" opacity={0.8}>
                        {t('description')}
                    </Text>
                </VStack>
            </VStack>
        </Container>
    );
};

export default GenerateWallet;
