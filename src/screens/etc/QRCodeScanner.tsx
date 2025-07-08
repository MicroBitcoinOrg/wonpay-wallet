import React, {useContext, useRef, useState, useEffect} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Platform,
    Alert,
    Text,
} from 'react-native';
import {ReactNativeScannerView} from '@pushpendersingh/react-native-scanner';
import {
    request,
    PERMISSIONS,
    openSettings,
    RESULTS,
} from 'react-native-permissions';
import {isAddress} from '../../utils/address';
import {FocusAwareStatusBar, HStack} from '../../components/common';
import useAppStore from '../../store/appStore';
import {WalletContext} from '../../providers';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
    },
    cornersContainer: {
        height: 300,
        width: 300,
        justifyContent: 'space-between',
        padding: 20,
    },
    cornerContainer: {
        width: 50,
        height: 50,
        borderColor: 'white',
    },
});

interface QRCodeScannerProps {
    navigation: any;
    route: any;
}

type Params =
    | {address: string; amount?: string; token?: string}
    | {message: string; appName: string; callback: string}
    | {
          send: string;
          receive: string;
          sendAmount: string;
          receiveAmount: string;
          callback: string;
      };

const {width, height} = Dimensions.get('window');

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
    navigation,
    route,
}: QRCodeScannerProps) => {
    const {type} = route.params ?? {};
    const store = useAppStore();
    const {walletChain} = useContext(WalletContext);
    const [isCameraPermissionGranted, setIsCameraPermissionGranted] =
        useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        checkCameraPermission();
    }, []);

    const checkCameraPermission = async () => {
        request(
            Platform.OS === 'ios'
                ? PERMISSIONS.IOS.CAMERA
                : PERMISSIONS.ANDROID.CAMERA,
        ).then((result: any) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    break;
                case RESULTS.DENIED:
                    Alert.alert(
                        'Permission Denied',
                        'You need to grant camera permission first',
                    );
                    openSettings();
                    break;
                case RESULTS.GRANTED:
                    setIsCameraPermissionGranted(true);
                    break;
                case RESULTS.BLOCKED:
                    Alert.alert(
                        'Permission Blocked',
                        'You need to grant camera permission first',
                    );
                    openSettings();
                    break;
            }
        });
    };

    const processAddressBook = (
        params: Params,
        actionType: 'replace' | 'navigate' = 'navigate',
    ) => {
        if (actionType === 'navigate') {
            navigation.navigate('ManageAddressBookItem', params);
        } else {
            navigation.replace('AddressBookStack', {
                screen: 'ManageAddressBookItem',
                params,
            });
        }
    };

    const processWithdraw = (
        params: Params,
        actionType: 'replace' | 'navigate' = 'navigate',
    ) => {
        if (actionType === 'navigate') {
            navigation.navigate('Withdraw', params);
        } else {
            navigation.replace('WalletStack', {screen: 'Withdraw', params});
        }
    };

    const processData = (
        params: Params,
        method: string | undefined = undefined,
    ) => {
        switch (type) {
            case 'address-book':
                if ('address' in params) {
                    processAddressBook(params);
                }

                break;
            case 'withdraw':
                if ('address' in params) {
                    processWithdraw(params);
                }

                break;
            case 'home':
                if (method === 'deposit') {
                    processWithdraw(params);
                }

                break;
            default:
                if (store.uuid) {
                } else {
                    processAddressBook(params, 'replace');
                }

                break;
        }
    };

    const onQrScanned = (e: any) => {
        const data = e.nativeEvent?.data?.replace(/ /g, '');
        if (!data) return;
        if (data.startsWith('wonpay')) {
            let splited = [];
            let method = 'deposit';

            if (data.startsWith(`wonpay://deposit?`)) {
                splited = data.split('://deposit?');
            }

            if (splited.length > 1) {
                splited = splited[1].split('&');

                const params = splited.reduce(
                    (result: Record<string, any>, param: string) => {
                        const a = param.split('=');

                        if (a.length > 1) {
                            return {...result, [a[0]]: a[1]};
                        }

                        return result;
                    },
                    {},
                );

                processData(params, method);
            }
        } else if (isAddress(data, walletChain!.regex.address)) {
            processData({address: data});
        }
    };

    if (!isCameraPermissionGranted) {
        return (
            <View style={styles.container}>
                <FocusAwareStatusBar barStyle="light-content" />
                <Text
                    style={{
                        color: 'white',
                        textAlign: 'center',
                        marginTop: 40,
                    }}>
                    You need to grant camera permission first
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <ReactNativeScannerView
                ref={scannerRef}
                style={{height: height, width: width}}
                onQrScanned={onQrScanned}
                pauseAfterCapture={true}
                isActive={true}
                // Custom marker overlay
                renderBox={() => (
                    <View style={styles.cornersContainer} pointerEvents="none">
                        <HStack justifyContent="space-between">
                            <View
                                style={[
                                    styles.cornerContainer,
                                    {
                                        borderTopLeftRadius: 20,
                                        borderLeftWidth: 4,
                                        borderTopWidth: 4,
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.cornerContainer,
                                    {
                                        borderTopRightRadius: 20,
                                        borderRightWidth: 4,
                                        borderTopWidth: 4,
                                    },
                                ]}
                            />
                        </HStack>
                        <HStack justifyContent="space-between">
                            <View
                                style={[
                                    styles.cornerContainer,
                                    {
                                        borderBottomLeftRadius: 20,
                                        borderLeftWidth: 4,
                                        borderBottomWidth: 4,
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.cornerContainer,
                                    {
                                        borderBottomRightRadius: 20,
                                        borderRightWidth: 4,
                                        borderBottomWidth: 4,
                                    },
                                ]}
                            />
                        </HStack>
                    </View>
                )}
            />
        </View>
    );
};

export default QRCodeScanner;
