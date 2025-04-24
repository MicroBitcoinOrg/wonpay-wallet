import React from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
    Container,
    FocusAwareStatusBar,
    Text,
    VStack,
} from '../../components/common';
import {Button} from '../../components/extended';
import Config from 'react-native-config';

const styles = StyleSheet.create({
    container: {
        marginTop: parseInt(
            Platform.OS === 'ios'
                ? Config.HEADER_HEIGHT_IOS
                : Config.HEADER_HEIGHT_ANDROID,
        ),
        marginBottom: 20,
    },
    agreementButton: {
        marginTop: 30,
    },
    agreementContainer: {
        marginTop: 10,
    },
    agreementText: {
        fontSize: 14,
        color: 'white',
    },
    itemContainer: {
        height: '100%',
    },
    itemImage: {
        height: '70%',
    },
    imageContainer: {
        width: '100%',
        height: '50%',
    },
    titleContainer: {
        marginBottom: 15,
    },
    titleText: {
        fontSize: 21,
        fontWeight: 'bold',
        color: 'white',
    },
    descriptionText: {
        fontSize: 14,
        opacity: 0.8,
        color: 'white',
        textAlign: 'center',
    },
});

interface FinishedProps {
    navigation: any;
}

const Finished: React.FC<FinishedProps> = ({navigation}: FinishedProps) => {
    const {t} = useTranslation('finished');

    const handleContinue = () => {
        navigation.navigate('GenerateWallet');
    };

    return (
        <Container gradient paddingTop paddingBottom>
            <FocusAwareStatusBar barStyle="light-content" />
            <VStack
                style={[styles.itemContainer]}
                flex={1}
                alignItems="center"
                justifyContent="center">
                <View style={styles.titleContainer}>
                    <Text variant="h3" color="white">
                        {t('title')}
                    </Text>
                </View>
                <Text
                    variant="body2"
                    color="white"
                    opacity={0.8}
                    align="center">
                    {t('description')}
                </Text>
                <VStack style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/confirmation.png')}
                        resizeMode="contain"
                        style={styles.itemImage}
                    />
                </VStack>
            </VStack>
            <Button
                style={{marginVertical: 20}}
                title={t('confirmButton')}
                color="secondary"
                onPress={handleContinue}
            />
        </Container>
    );
};

export default Finished;
