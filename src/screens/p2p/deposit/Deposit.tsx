import React, {useContext, useState, useMemo} from 'react';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
// @ts-ignore
import Share from 'react-native-share';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {P2PContext} from '../../../providers';
import {Container, HStack, Text, VStack} from '../../../components/common';
import {Colors} from '../../../theme';
import {
    IconButton,
    BottomSheetPicker,
    Badge,
} from '../../../components/extended';
import type {PickerOption} from '../../../components/extended';
import {useAddresses} from '../../../services/mex/hooks';
import {StackScreenProps} from '@react-navigation/stack';
import {Navigation} from '../../../types/Navigation';

const styles = StyleSheet.create({
    buttonsContainer: {
        marginTop: 20,
        width: 210,
        justifyContent: 'space-around',
    },
    alignment: {
        alignItems: 'center',
        flex: 1,
    },
    qrCodeContainer: {
        padding: 20,
    },
    infoContainer: {
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 20,
        overflow: 'hidden',
    },
    text: {
        marginTop: 5,
    },
    networkSelector: {
        marginBottom: 20,
        width: '100%',
    },
    currencyBadge: {
        marginRight: 8,
        marginBottom: 8,
    },
    currenciesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});

const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

type P2PDepositProps = StackScreenProps<Navigation.P2PParamList, 'Deposit'>;

const P2PDeposit: React.FC<P2PDepositProps> = ({navigation, route}) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('deposit');
    const {token} = useContext(P2PContext);

    const {data: addresses, isLoading} = useAddresses(token);

    const [selectedNetwork, setSelectedNetwork] = useState<string>('');

    // Create network options from addresses
    const networkOptions: PickerOption[] = useMemo(() => {
        if (!addresses) return [];
        return addresses.map(addr => ({
            label: addr.network.toUpperCase(),
            value: addr.network,
            description: `${addr.supported_currencies.length} currencies`,
        }));
    }, [addresses]);

    // Set initial network when data loads
    React.useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedNetwork) {
            setSelectedNetwork(addresses[0].network);
        }
    }, [addresses, selectedNetwork]);

    // Get current address data
    const currentAddress = useMemo(() => {
        return addresses?.find(addr => addr.network === selectedNetwork);
    }, [addresses, selectedNetwork]);

    const generateQRValue = () => {
        if (!currentAddress?.address) return '';
        return currentAddress.address;
    };

    if (isLoading || !addresses || !currentAddress) {
        return (
            <Container>
                <View style={styles.alignment}>
                    <Text variant="body1">{t('deposit.loading')}</Text>
                </View>
            </Container>
        );
    }

    const copyToClipboard = () => {
        if (!currentAddress?.address) return;
        Clipboard.setString(currentAddress.address);
        ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
        showMessage({
            message: t('alerts.copiedAddress.message'),
            description: t('alerts.copiedAddress.description'),
            backgroundColor: Colors[scheme!].primary,
        });
    };

    const share = async () => {
        if (!currentAddress?.address) return;
        await Share.open({
            message: currentAddress.address,
        });
    };

    return (
        <Container>
            <View style={styles.alignment}>
                {/* Network Selector */}
                <View style={styles.networkSelector}>
                    <Text variant="body2" style={{marginBottom: 8}}>
                        {t('deposit.selectNetwork')}
                    </Text>
                    <BottomSheetPicker
                        options={networkOptions}
                        selectedValue={selectedNetwork}
                        onValueChange={setSelectedNetwork}
                        title={t('deposit.selectNetwork')}
                    />
                </View>

                {/* QR Code and Address */}
                {currentAddress.address ? (
                    <>
                        <TouchableWithoutFeedback onLongPress={copyToClipboard}>
                            <View
                                style={[
                                    styles.infoContainer,
                                    {
                                        borderColor: Colors[scheme!].border,
                                        backgroundColor: Colors[scheme!].white,
                                    },
                                ]}>
                                <View style={styles.qrCodeContainer}>
                                    <QRCode
                                        value={generateQRValue()}
                                        size={250}
                                    />
                                </View>
                                <HStack
                                    paddingHorizontal={20}
                                    paddingVertical={5}
                                    justifyContent="center"
                                    backgroundColor={Colors[scheme!].card}>
                                    <Text variant="body1">
                                        {currentAddress.network}
                                    </Text>
                                </HStack>
                            </View>
                        </TouchableWithoutFeedback>
                        <Text selectable numberOfLines={2} variant="body1">
                            {currentAddress.address}
                        </Text>
                        <HStack style={styles.buttonsContainer}>
                            <VStack alignItems="center" justifyContent="center">
                                <IconButton
                                    iconColor="textPrimary"
                                    name="copy-outline"
                                    iconSet="ionicons"
                                    onPress={copyToClipboard}
                                />
                                <Text variant="sub1" style={styles.text}>
                                    {t('copy')}
                                </Text>
                            </VStack>
                            <VStack alignItems="center" justifyContent="center">
                                <IconButton
                                    iconColor="textPrimary"
                                    name="share-outline"
                                    iconSet="ionicons"
                                    onPress={share}
                                />
                                <Text variant="sub1" style={styles.text}>
                                    {t('share')}
                                </Text>
                            </VStack>
                        </HStack>
                    </>
                ) : (
                    <View style={styles.alignment}>
                        <Text variant="body1">{t('deposit.noAddress')}</Text>
                    </View>
                )}
            </View>
        </Container>
    );
};

export default P2PDeposit;
