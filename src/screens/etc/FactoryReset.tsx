import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {CommonActions} from '@react-navigation/native';
import {
    Container,
    FocusAwareStatusBar,
    Text,
    VStack,
} from '../../components/common';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    infoContainer: {
        marginTop: 30,
    },
});

interface FactoryResetProps {
    navigation: any;
    route: any;
}

const FactoryReset: React.FC<FactoryResetProps> = ({
    navigation,
}: FactoryResetProps) => {
    const {t} = useTranslation('factoryReset');
    const store = useAppStore();

    useEffect(() => {
        store.reset();

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'RootStack'}],
            }),
        );
    }, []);

    return (
        <Container gradient header={false}>
            <FocusAwareStatusBar barStyle="light-content" />
            <VStack flex={1}>
                <ActivityIndicator color="white" size="large" />
                <VStack style={styles.infoContainer}>
                    <Text variant="h3" color="white">
                        {t('erasingData')}
                    </Text>
                </VStack>
            </VStack>
        </Container>
    );
};

export default FactoryReset;
