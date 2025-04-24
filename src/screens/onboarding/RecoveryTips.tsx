import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Container, FocusAwareStatusBar, Text} from '../../components/common';
import {Button} from '../../components/extended';

const styles = StyleSheet.create({
    tipBlockContainer: {
        marginBottom: 20,
    },
    carouselItemImage: {
        width: '100%',
        height: 125,
    },
    carouselItemTitleContainer: {
        marginTop: 20,
        marginBottom: 15,
    },
    carouselItemSubtitleContainer: {
        marginBottom: 5,
        opacity: 0.8,
    },
});

interface RecoveryTipsProps {
    navigation: any;
}

type Slide = {
    subtitle: string;
    text: string;
};

const RecoveryTips: React.FC<RecoveryTipsProps> = ({
    navigation,
}: RecoveryTipsProps) => {
    const {t} = useTranslation('recoveryTips');

    const DATA: Slide[] = [
        {
            subtitle: t('slides.first.subtitle'),
            text: t('slides.first.description'),
        },
        {
            subtitle: t('slides.second.subtitle'),
            text: t('slides.second.description'),
        },
        {
            subtitle: t('slides.third.subtitle'),
            text: t('slides.third.description'),
        },
    ];

    return (
        <Container gradient paddingTop paddingBottom header={false}>
            <FocusAwareStatusBar barStyle="light-content" />
            <Image
                source={require('../../assets/recoveryTips.png')}
                resizeMode="contain"
                style={styles.carouselItemImage}
            />
            <View style={styles.carouselItemTitleContainer}>
                <Text variant="h2" color="white">
                    {t('slides.first.title')}
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {DATA.map((tip, index) => {
                    return (
                        <View style={styles.tipBlockContainer} key={index}>
                            <View style={styles.carouselItemSubtitleContainer}>
                                <Text variant="body2" color="white">
                                    {tip.subtitle}
                                </Text>
                            </View>
                            <Text variant="body3" color="white" opacity={0.5}>
                                {tip.text}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
            <Button
                title={t('confirmButton.gotIt')}
                color="secondary"
                style={{marginVertical: 20}}
                onPress={() => navigation.navigate('RecoveryPhrase')}
            />
        </Container>
    );
};

export default RecoveryTips;
