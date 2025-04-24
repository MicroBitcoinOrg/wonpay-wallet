import React, {useContext} from 'react';
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
import {WalletContext} from '../../providers';
import {Container, HStack, Text, VStack} from '../../components/common';
import {Colors} from '../../theme';
import {IconButton} from '../../components/extended';
// import ScreenBrightness from 'react-native-screen-brightness';

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
    paramsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
});

interface ReceiveProps {
    navigation: any;
    route: any;
}

const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

const Receive: React.FC<ReceiveProps> = ({navigation, route}: ReceiveProps) => {
    const scheme = useColorScheme();
    const defaultParams = {amount: '', token: undefined};
    const params = route.params
        ? {...defaultParams, ...route.params}
        : defaultParams;
    const {t} = useTranslation('deposit');
    const {wallet} = useContext(WalletContext);
    const balance = wallet!.balances?.find(b =>
        params.token ? b.currency.ticker === params.token : b.main,
    );

    const generateQRValue = () => {
        let value = `wonpay://deposit?address=${wallet!.depositAddress}`;

        if (params.amount) {
            value += `&amount=${params.amount}`;
        }

        if (params.token) {
            value += `&token=${params.token}`;
        }

        return value;
    };

    if (!wallet) {
        return <View />;
    }

    const copyToClipboard = () => {
        Clipboard.setString(wallet!.depositAddress);
        ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
        showMessage({
            message: t('alerts.copiedAddress.message'),
            description: t('alerts.copiedAddress.description'),
            backgroundColor: Colors[scheme!].primary,
        });
    };

    const share = async () => {
        await Share.open({
            message: wallet!.depositAddress,
        });
    };

    return (
        <Container>
            <View style={styles.alignment}>
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
                            <QRCode value={generateQRValue()} size={250} />
                        </View>
                        <View
                            style={[
                                styles.paramsContainer,
                                {
                                    backgroundColor: Colors[scheme!].card,
                                    justifyContent:
                                        params.amount !== ''
                                            ? 'space-between'
                                            : 'center',
                                },
                            ]}>
                            <Text variant="body1">
                                {balance?.currency.ticker}
                            </Text>
                            {params.amount !== '' && (
                                <Text variant="body1">
                                    {Number(params.amount).toFixed(2)}{' '}
                                    {balance?.currency.ticker}
                                </Text>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <Text selectable numberOfLines={1} variant="body1">
                    {wallet!.depositAddress}
                </Text>
                <HStack style={styles.buttonsContainer}>
                    <VStack>
                        <IconButton
                            iconColor="textPrimary"
                            name="copy-outline"
                            iconSet="ionicons"
                            onPress={copyToClipboard}
                        />
                        <Text variant="sub1" style={{marginTop: 5}}>
                            {t('copy')}
                        </Text>
                    </VStack>
                    <VStack>
                        <IconButton
                            iconColor="textPrimary"
                            name="share-outline"
                            iconSet="ionicons"
                            onPress={share}
                        />
                        <Text variant="sub1" style={{marginTop: 5}}>
                            {t('share')}
                        </Text>
                    </VStack>
                </HStack>
            </View>
        </Container>
    );
};

export default Receive;
