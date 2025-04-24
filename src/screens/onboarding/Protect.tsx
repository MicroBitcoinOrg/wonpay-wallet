import React from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
    Container,
    FocusAwareStatusBar,
    HStack,
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
    itemContainer: {
        height: '100%',
    },
    itemImage: {
        height: '50%',
    },
    imageContainer: {
        width: '100%',
    },
    itemTitleContainer: {
        marginBottom: 15,
    },
    itemTitleText: {
        fontSize: 21,
        fontWeight: 'bold',
        color: 'white',
    },
    itemDescriptionText: {
        fontSize: 14,
        opacity: 0.5,
        color: 'white',
    },
});

interface ProtectProps {
    navigation: any;
    route: any;
}

const Protect: React.FC<ProtectProps> = ({navigation}: ProtectProps) => {
    const {t} = useTranslation('protect');

    return (
        <Container gradient safeArea header>
            <FocusAwareStatusBar barStyle="light-content" />
            <VStack
                style={[styles.itemContainer]}
                flex={1}
                alignItems="flex-start">
                <VStack flex={1} style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/protect.png')}
                        resizeMode="contain"
                        style={styles.itemImage}
                    />
                </VStack>
                <View style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitleText}>{t('title')}</Text>
                </View>
                <Text style={styles.itemDescriptionText}>
                    {t('description')}
                </Text>
            </VStack>
            <HStack>
                <Button
                    title={t('confirmButton')}
                    color="secondary"
                    flex={1}
                    onPress={() =>
                        navigation.replace('PasswordStack', {
                            screen: 'Password',
                            params: {type: 'new-password'},
                        })
                    }
                />
            </HStack>
        </Container>
    );
};

export default Protect;
