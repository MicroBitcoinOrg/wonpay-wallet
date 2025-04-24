import React, {useContext} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import QRCodeScannerComponent from 'react-native-qrcode-scanner';
import {RNCamera as Camera} from 'react-native-camera';
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

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
    navigation,
    route,
}: QRCodeScannerProps) => {
    const {type} = route.params ?? {};
    const store = useAppStore();
    const {walletChain} = useContext(WalletContext);

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

    const processFinilizeSwap = (params: Params) => {
        navigation.navigate('WalletStack', {screen: 'Wallet'});
        navigation.navigate('FinilizeSwap', params);
    };

    const processCreateSwap = (params: {
        send: string;
        receive: string;
        sendAmount: string;
        receiveAmount: string;
        callback: string;
    }) => {
        navigation.navigate('WalletStack', {screen: 'Wallet'});
        navigation.navigate('CreateSwap', {
            baseCurrency: params?.send,
            quoteCurrency: params?.receive,
            sendAmount: params?.sendAmount,
            receiveAmount: params?.receiveAmount,
            callback: params?.callback,
        });
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

    const onSuccess = (e: any) => {
        const data = e.data.replace(/ /g, '');

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

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <QRCodeScannerComponent
                showMarker
                onRead={onSuccess}
                reactivateTimeout={2000}
                reactivate
                customMarker={
                    <View style={styles.cornersContainer}>
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
                }
                cameraStyle={{
                    height: Dimensions.get('window').height,
                    width: '100%',
                }}
                topViewStyle={{flex: 0}}
                bottomViewStyle={{flex: 0}}
                cameraProps={{flashMode: Camera.Constants.FlashMode.off}}
            />
        </View>
    );
};

export default QRCodeScanner;
