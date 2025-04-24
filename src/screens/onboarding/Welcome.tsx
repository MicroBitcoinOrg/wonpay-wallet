import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useTranslation} from 'react-i18next';
import {OnboardingContext} from '../../providers';
import {
    Container,
    FocusAwareStatusBar,
    Text,
    VStack,
} from '../../components/common';
import {Button} from '../../components/extended';
import Config from 'react-native-config';
import useAppStore from '../../store/appStore';
import {CHAINS} from '../../utils/constants';
import {Navigation} from '../../types/Navigation';
import ChainItem from './components/ChainItem';

const styles = StyleSheet.create({
    container: {
        marginTop: parseInt(
            Platform.OS === 'ios'
                ? Config.HEADER_HEIGHT_IOS
                : Config.HEADER_HEIGHT_ANDROID,
        ),
        marginBottom: 60,
    },
    buttonText: {
        textDecorationLine: 'underline',
    },
    carouselItemContainer: {
        height: '100%',
        paddingHorizontal: 40,
    },
    carouselItemImage: {
        height: '70%',
    },
    imageContainer: {
        width: '100%',
    },
    carouselItemTitleContainer: {
        marginBottom: 15,
    },
    dotContainer: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
    },
});

interface WelcomeProps {
    navigation: any;
}

const Welcome: React.FC<WelcomeProps> = ({navigation}: WelcomeProps) => {
    const {t} = useTranslation('welcome');
    const store = useAppStore();
    const {dispatchOnboardingAction} = useContext(OnboardingContext);

    const DATA = [
        {
            title: t('slides.first.title'),
            text: t('slides.first.description'),
            image: require('../../assets/intro.png'),
        },
        {
            title: t('slides.second.title'),
            text: t('slides.second.description'),
            image: require('../../assets/protect.png'),
        },
        {
            title: t('slides.third.title'),
            text: t('slides.third.description'),
            image: require('../../assets/recoveryTips.png'),
        },
    ];

    const renderItem = ({item}: any) => {
        return (
            <VStack style={[styles.carouselItemContainer]} alignItems="center">
                <VStack flex={1} style={styles.imageContainer}>
                    <Image
                        source={item.image}
                        resizeMode="contain"
                        style={styles.carouselItemImage}
                    />
                </VStack>
                <View style={styles.carouselItemTitleContainer}>
                    <Text variant="h1" color="white">
                        {item.title}
                    </Text>
                </View>
                <Text
                    variant="body3"
                    color="white"
                    align="center"
                    opacity={0.5}>
                    {item.text}
                </Text>
            </VStack>
        );
    };

    const chooseChain = (chain: Wallet.ChainKey, type: 'create' | 'import') => {
        dispatchOnboardingAction({
            type: 'setWalletValues',
            wallet: {
                chain,
            },
        });

        if (type === 'create') {
            handleCreateWallet();
        } else {
            handleImportWallet();
        }
    };

    const openChainsList = (type: 'create' | 'import') => {
        navigation.navigate('ChooseList', {
            data: Object.keys(CHAINS),
            keyExtractor: (item: Wallet.ChainKey) => CHAINS[item].name,
            renderItem: (item: Wallet.ChainKey) => (
                <ChainItem
                    chain={CHAINS[item] as Wallet.Chain}
                    onPress={() => chooseChain(item, type)}
                />
            ),
            headerTitle: 'Choose Wallet',
        });
    };

    const handleCreateWallet = () => {
        dispatchOnboardingAction({
            type: 'setProcessType',
            processType: 'create',
        });

        if (!store.isLegalAgreed) {
            navigation.navigate('Legal');
        } else {
            navigation.navigate('RecoveryTips');
        }
    };

    const handleImportWallet = () => {
        dispatchOnboardingAction({
            type: 'setProcessType',
            processType: 'import',
        });

        if (!store.isLegalAgreed) {
            navigation.navigate('Legal');
        } else if (!store.password.value) {
            navigation.replace('PasswordStack', {
                screen: 'Password',
                params: {type: 'new-password'},
            });
        } else {
            navigation.navigate('RecoveryTips');
        }
    };

    useEffect(() => {
        if (store.wallets.length === 0) {
            navigation.setOptions({
                headerLeft: () => null,
            });
        }
    }, []);

    return (
        <Container gradient paddingTop animated paddingBottom header={false}>
            <FocusAwareStatusBar barStyle="light-content" />
            <VStack flex={1}>
                <Carousel
                    loop
                    autoPlay
                    autoPlayInterval={3000}
                    data={DATA}
                    renderItem={renderItem}
                    width={Dimensions.get('window').width}
                />
            </VStack>
            <Button
                title={t('create')}
                style={{marginTop: 60}}
                color="secondary"
                onPress={() => openChainsList('create')}
            />
            <Button
                title={t('import')}
                style={{marginVertical: 20}}
                type="text"
                color="secondary"
                onPress={() => openChainsList('import')}
            />
        </Container>
    );
};

export default Welcome;
