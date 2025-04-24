import React, {useState} from 'react';
import {
    Linking,
    Platform,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import Config from 'react-native-config';
import {
    Container,
    FocusAwareStatusBar,
    HStack,
    Table,
    Text,
    VStack,
} from '../../components/common';
import {Button, TableItem} from '../../components/extended';
import {Colors} from '../../theme';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    container: {
        marginTop: parseInt(
            Platform.OS === 'ios'
                ? Config.HEADER_HEIGHT_IOS
                : Config.HEADER_HEIGHT_ANDROID,
        ),
        marginBottom: 60,
    },
    contentAlignment: {
        paddingHorizontal: 40,
    },
    contentContainer: {
        width: '100%',
    },
    descriptionContainer: {
        marginBottom: 15,
    },
    agreementContainer: {
        marginTop: 10,
    },
    agreementText: {
        flexShrink: 1,
        marginLeft: 16,
    },
});

interface LegalProps {
    navigation: any;
    route: any;
}

const Legal: React.FC<LegalProps> = ({navigation}: LegalProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('legal');
    const [legalAgreement, setLegalAgreement] = useState(false);
    const store = useAppStore();

    const handleContinue = () => {
        store.setLegal(legalAgreement);
        navigation.navigate('RecoveryPhrase');
    };

    return (
        <Container gradient paddingTop paddingBottom>
            <FocusAwareStatusBar barStyle="light-content" />
            <VStack
                justifyContent="space-between"
                alignItems="flex-start"
                flex={1}>
                <View style={styles.contentContainer}>
                    <View style={[styles.descriptionContainer]}>
                        <Text variant="body3" color="white" opacity={0.5}>
                            {t('description')}
                        </Text>
                    </View>
                    <Table>
                        <TableItem
                            title={t('termsOfService')}
                            color="white"
                            underlayColor={Colors[scheme!].primary}
                            onPress={() =>
                                Linking.openURL(Config.TERMS_OF_SERVICE)
                            }
                            rightContent={
                                <EntypoIcon
                                    name="chevron-thin-right"
                                    size={20}
                                    color="white"
                                />
                            }
                        />
                        <TableItem
                            title={t('privacyPolicy')}
                            color="white"
                            underlayColor={Colors[scheme!].primary}
                            onPress={() =>
                                Linking.openURL(Config.PRIVACY_POLICY)
                            }
                            rightContent={
                                <EntypoIcon
                                    name="chevron-thin-right"
                                    size={20}
                                    color="white"
                                />
                            }
                        />
                    </Table>
                </View>
                <TouchableOpacity
                    style={{width: '100%', marginBottom: 28}}
                    onPress={() => setLegalAgreement(!legalAgreement)}>
                    <HStack justifyContent="flex-start" alignItems="flex-start">
                        <IoniconsIcon
                            name={
                                legalAgreement
                                    ? 'checkmark-circle'
                                    : 'ellipse-outline'
                            }
                            size={28}
                            color="white"
                        />
                        <Text
                            variant="body3"
                            color="white"
                            opacity={0.8}
                            style={styles.agreementText}>
                            {t('agreement')}
                        </Text>
                    </HStack>
                </TouchableOpacity>
            </VStack>
            <Button
                title={t('confirmButton')}
                color="secondary"
                disabled={!legalAgreement}
                style={{marginVertical: 20}}
                onPress={handleContinue}
            />
        </Container>
    );
};

export default Legal;
