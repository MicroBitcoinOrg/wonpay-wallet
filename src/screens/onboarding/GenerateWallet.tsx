import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {v4 as uuidv4} from 'uuid';
import {useTranslation} from 'react-i18next';
import KeepAwake from '@sayem314/react-native-keep-awake';
import {encryptData} from '../../utils/common';
import {generateAddressesAsync} from '../../utils/address';
import {OnboardingContext, PasswordContext} from '../../providers';
import {
    Container,
    FocusAwareStatusBar,
    Text,
    VStack,
} from '../../components/common';
import {checkAddresses} from '../../services/microbitcoin/api';
import {showMessage} from 'react-native-flash-message';
import useAppStore from '../../store/appStore';
import {CHAINS} from '../../utils/constants';

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
    const {unlockedPassword} = useContext(PasswordContext);
    const [walletCount] = useState<number>(store.wallets.length);
    const walletChain = CHAINS[onboarding!.wallet.chain!] as Wallet.Chain;

    const findAddresses = async () => {
        let addressesWithHistory: Wallet.Address[] = [];
        let synced = false;
        const offset = 1;
        const searchRange = [0, offset];

        while (!synced) {
            const addresses = await generateAddressesAsync(
                onboarding?.wallet.seedPhrase!,
                searchRange[0],
                searchRange[1],
                0,
                walletChain.network,
                walletChain.derivationPath,
            );
            addressesWithHistory = [...addressesWithHistory, addresses[0]];

            const filteredAddresses = await checkAddresses({addresses});

            if (filteredAddresses.length > 0) {
                addressesWithHistory = [
                    ...addressesWithHistory,
                    ...addresses.filter(address =>
                        filteredAddresses.includes(address.address),
                    ),
                ];
                searchRange[0] += offset;
                searchRange[1] += offset;
            } else {
                synced = true;
            }
        }

        return [...new Set(addressesWithHistory)];
    };

    const createWallet = async () => {
        if (onboarding?.wallet.seedPhrase === undefined) {
            throw new Error(t('alerts.error.notFound.seedPhrase'));
        }

        if (onboarding?.wallet.title === undefined) {
            throw new Error(t('alerts.error.notFound.title'));
        }

        if (unlockedPassword === undefined) {
            throw new Error(t('alerts.error.notFound.unlockedPassword'));
        }

        try {
            let addresses =
                onboarding!.processType === 'create'
                    ? await generateAddressesAsync(
                          onboarding?.wallet.seedPhrase!,
                          0,
                          1,
                          0,
                          walletChain.network,
                          walletChain.derivationPath,
                      )
                    : await findAddresses();

            addresses = addresses.map(address => {
                return {
                    ...address,
                    wif: encryptData(address.wif, unlockedPassword),
                };
            });

            dispatchOnboardingAction({
                type: 'setWalletValues',
                wallet: {
                    uuid: uuidv4(),
                    seedPhrase: encryptData(
                        onboarding?.wallet.seedPhrase!,
                        unlockedPassword,
                    ),
                    addresses,
                    depositAddress: addresses[0].address,
                    balances: [
                        {
                            balance: 0,
                            currency: walletChain.currency,
                            main: true,
                        },
                    ],
                },
            });
        } catch (e) {
            throw e;
        }
    };

    useEffect(() => {
        try {
            createWallet();
        } catch (e: any) {
            showMessage({
                message: 'Wallet',
                description: e.message,
                type: 'danger',
            });

            navigation.goBack();
        }
    }, []);

    useEffect(() => {
        if (
            onboarding?.wallet.seedPhrase !== undefined &&
            onboarding?.wallet.addresses !== undefined &&
            onboarding?.wallet.depositAddress !== undefined &&
            onboarding?.wallet.title !== undefined
        ) {
            console.log('--- NEW WALLET ---');
            console.log(onboarding.wallet);
            console.log('--- ---------- ---');
            store.setNewWallet(onboarding.wallet);
            dispatchOnboardingAction({type: 'resetWalletValues'});
        }
    }, [onboarding]);

    useEffect(() => {
        if (store.wallets.length > walletCount) {
            navigation.reset({
                index: 0,
                routes: [{name: 'MainTabs'}],
            });
        }
    }, [store.wallets]);

    return (
        <Container gradient header={false}>
            <FocusAwareStatusBar barStyle="light-content" />
            <KeepAwake />
            <VStack flex={1}>
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
