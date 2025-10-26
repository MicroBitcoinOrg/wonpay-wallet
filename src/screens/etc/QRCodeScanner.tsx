import React, {
    useContext,
    useRef,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Platform,
    Alert,
    Text,
    useColorScheme,
} from 'react-native';
import {
    request,
    PERMISSIONS,
    openSettings,
    RESULTS,
    Permission,
} from 'react-native-permissions';
import {useTranslation} from 'react-i18next';
import {isMatchAddress} from '../../utils/address';
import {FocusAwareStatusBar, HStack} from '../../components/common';
import useAppStore from '../../store/appStore';
import {useWallet, WalletContext} from '../../providers';
import {Camera, CameraType} from 'react-native-camera-kit';
import {OnReadCodeData} from 'react-native-camera-kit/dist/CameraProps';
import {Colors} from '../../theme';

// Constants
const QR_FRAME_SIZE = 300;
const CORNER_SIZE = 50;
const CORNER_PADDING = 20;
const WONPAY_PROTOCOL = 'wonpay://';
const WONPAY_DEPOSIT_PREFIX = 'wonpay://deposit?';

// Types
interface AddressParams {
    address: string;
    amount?: string;
    token?: string;
}

interface MessageParams {
    message: string;
    appName: string;
    callback: string;
}

interface P2PParams {
    send: string;
    receive: string;
    sendAmount: string;
    receiveAmount: string;
    callback: string;
}

type QRParams = AddressParams | MessageParams | P2PParams;

interface QRCodeScannerProps {
    navigation?: any;
    route?: {
        params?: {
            type?: 'address-book' | 'withdraw' | 'home';
        };
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    permissionDeniedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    permissionDeniedText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        paddingHorizontal: 20,
    },
    camera: {
        flex: 1,
    },
    cornersContainer: {
        height: QR_FRAME_SIZE,
        width: QR_FRAME_SIZE,
        justifyContent: 'space-between',
        padding: CORNER_PADDING,
    },
    cornerContainer: {
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: 'white',
    },
});

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({navigation, route}) => {
    const {type} = route?.params ?? {};
    const store = useAppStore();
    const {chain} = useWallet();
    const [isCameraPermissionGranted, setIsCameraPermissionGranted] =
        useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const scheme = useColorScheme();
    const {t} = useTranslation('qrCodeScanner');

    // Memoized values
    const cameraPermission: Permission = useMemo(
        () =>
            Platform.OS === 'ios'
                ? PERMISSIONS.IOS.CAMERA
                : PERMISSIONS.ANDROID.CAMERA,
        [],
    );

    const frameColor = useMemo(
        () => Colors[scheme!]?.white || '#FFFFFF',
        [scheme],
    );

    const laserColor = useMemo(
        () => Colors[scheme!]?.transparent || 'transparent',
        [scheme],
    );

    useEffect(() => {
        checkCameraPermission();
    }, []);

    const checkCameraPermission = useCallback(async () => {
        try {
            const result = await request(cameraPermission);
            handlePermissionResult(result);
        } catch (error) {
            showPermissionError(t('permissions.failed'));
        }
    }, [cameraPermission, t]);

    const handlePermissionResult = useCallback(
        (result: string) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    showPermissionError(t('permissions.unavailable'));
                    break;
                case RESULTS.DENIED:
                    showPermissionAlert(
                        t('permissions.denied.title'),
                        t('permissions.denied.message'),
                    );
                    break;
                case RESULTS.GRANTED:
                    setIsCameraPermissionGranted(true);
                    break;
                case RESULTS.BLOCKED:
                    showPermissionAlert(
                        t('permissions.blocked.title'),
                        t('permissions.blocked.message'),
                    );
                    break;
                default:
                    showPermissionError(t('permissions.unknown'));
            }
        },
        [t],
    );

    const showPermissionAlert = useCallback(
        (title: string, message: string) => {
            Alert.alert(title, message, [
                {text: t('buttons.cancel'), style: 'cancel'},
                {
                    text: t('buttons.openSettings'),
                    onPress: openSettings,
                },
            ]);
        },
        [t],
    );

    const showPermissionError = useCallback(
        (message: string) => {
            Alert.alert(t('errors.title'), message);
        },
        [t],
    );

    const isAddressParams = (params: QRParams): params is AddressParams => {
        return 'address' in params;
    };

    const navigateToAddressBook = useCallback(
        (
            params: AddressParams,
            actionType: 'replace' | 'navigate' = 'navigate',
        ) => {
            if (actionType === 'navigate') {
                navigation.popTo('ManageAddressBookItem', params);
            } else {
                navigation.replace('AddressBookStack', {
                    screen: 'ManageAddressBookItem',
                    params,
                });
            }
        },
        [navigation],
    );

    const navigateToWithdraw = useCallback(
        (
            params: AddressParams,
            actionType: 'replace' | 'navigate' = 'navigate',
        ) => {
            if (actionType === 'navigate') {
                navigation.popTo('MainTabs', {
                    screen: 'WalletStack',
                    params: {
                        screen: 'Withdraw',
                        params,
                    },
                });
            } else {
                navigation.replace('MainTabs', {
                    screen: 'MainTabs',
                    params: {
                        screen: 'WalletStack',
                        params: {
                            screen: 'Withdraw',
                            params,
                        },
                    },
                });
            }
        },
        [navigation],
    );

    const processQRData = useCallback(
        (params: QRParams, method?: string) => {
            if (!isAddressParams(params)) {
                console.warn(t('errors.unsupportedFormat'));
                return;
            }

            switch (type) {
                case 'address-book':
                    navigateToAddressBook(params);
                    break;
                case 'withdraw':
                    navigateToWithdraw(params);
                    break;
                case 'home':
                    if (method === 'deposit') {
                        navigateToWithdraw(params);
                    }
                    break;
                default:
                    if (store.uuid) {
                        // Handle authenticated user case
                        console.log(t('debug.authenticatedUser'));
                    } else {
                        navigateToAddressBook(params, 'replace');
                    }
                    break;
            }
        },
        [type, store.uuid, navigateToAddressBook, navigateToWithdraw, t],
    );

    const createValidQRParams = (
        params: Record<string, string>,
    ): QRParams | null => {
        // Check for AddressParams
        if ('address' in params && typeof params.address === 'string') {
            const addressParams: AddressParams = {
                address: params.address,
                ...(params.amount && {amount: params.amount}),
                ...(params.token && {token: params.token}),
            };
            return addressParams;
        }

        // Check for MessageParams
        if (
            'message' in params &&
            'appName' in params &&
            'callback' in params
        ) {
            const messageParams: MessageParams = {
                message: params.message,
                appName: params.appName,
                callback: params.callback,
            };
            return messageParams;
        }

        // Check for P2PParams
        if (
            'send' in params &&
            'receive' in params &&
            'sendAmount' in params &&
            'receiveAmount' in params &&
            'callback' in params
        ) {
            const p2pParams: P2PParams = {
                send: params.send,
                receive: params.receive,
                sendAmount: params.sendAmount,
                receiveAmount: params.receiveAmount,
                callback: params.callback,
            };
            return p2pParams;
        }

        return null;
    };

    const parseWonpayQR = useCallback(
        (data: string): {params: QRParams | null; method: string} => {
            let method = 'deposit';

            if (!data.startsWith(WONPAY_DEPOSIT_PREFIX)) {
                return {params: null, method};
            }

            const queryString = data.replace(WONPAY_DEPOSIT_PREFIX, '');
            const urlParams = new URLSearchParams(queryString);

            const params: Record<string, string> = {};
            urlParams.forEach((value, key) => {
                params[key] = value;
            });

            const validParams = createValidQRParams(params);
            return {params: validParams, method};
        },
        [],
    );

    const validateAddress = useCallback(
        (address: string): boolean => {
            if (!chain?.regex?.address) {
                console.warn('Wallet chain regex not available');
                return false;
            }
            return isMatchAddress(address, chain.regex.address);
        },
        [chain],
    );

    const onQrScanned = useCallback(
        (e: OnReadCodeData) => {
            if (isProcessing) return;

            const rawData = e.nativeEvent.codeStringValue;
            if (!rawData) return;

            setIsProcessing(true);

            // Clean the data
            const data = rawData.replace(/\s/g, '');

            try {
                if (data.startsWith(WONPAY_PROTOCOL)) {
                    const {params, method} = parseWonpayQR(data);
                    if (params) {
                        processQRData(params, method);
                    }
                } else if (validateAddress(data)) {
                    processQRData({address: data});
                } else {
                    Alert.alert(
                        t('errors.invalidQR.title'),
                        t('errors.invalidQR.message'),
                    );
                }
            } catch (error) {
                Alert.alert(t('errors.title'), t('errors.processing'));
            } finally {
                // Reset processing state after a delay to prevent rapid scanning
                setTimeout(() => setIsProcessing(false), 1000);
            }
        },
        [isProcessing, parseWonpayQR, validateAddress, processQRData, t],
    );

    const renderPermissionDenied = useCallback(
        () => (
            <View style={styles.permissionDeniedContainer}>
                <FocusAwareStatusBar barStyle="light-content" />
                <Text style={styles.permissionDeniedText}>
                    {t('permissions.deniedDescription')}
                </Text>
            </View>
        ),
        [t],
    );

    if (!isCameraPermissionGranted) {
        return renderPermissionDenied();
    }

    return (
        <Camera
            style={styles.camera}
            resizeMode="cover"
            zoomMode="off"
            focusMode="off"
            scanBarcode={true}
            onReadCode={onQrScanned}
            barcodeFrameSize={{width: QR_FRAME_SIZE, height: QR_FRAME_SIZE}}
            showFrame={true}
            frameColor={frameColor}
            laserColor={laserColor}
            accessibilityLabel="QR Code Scanner Camera"
            accessibilityHint={t('accessibility.cameraHint')}
        />
    );
};

export default QRCodeScanner;
