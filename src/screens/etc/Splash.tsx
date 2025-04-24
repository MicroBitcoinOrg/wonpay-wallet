import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Container, FocusAwareStatusBar} from '../../components/common';
import {PasswordContext} from '../../providers';

import LottieView from 'lottie-react-native';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

interface SplashProps {
    navigation: any;
    route: any;
}

const Splash: React.FC<SplashProps> = ({navigation, route}: SplashProps) => {
    const {unlockedPassword} = useContext(PasswordContext);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);
    const store = useAppStore();
    const params = route.params;

    useEffect(() => {
        if (store.isLoading) {
            store.setLoading(false);
        }

        /*const addresses = appReducer.wallets.reduce((a: string[], wallet: AOK.Wallet) => {
            return [...a, wallet.depositAddress];
        }, []);*/
    }, []);

    useEffect(() => {
        if (params?.action) {
            switch (params.action) {
                case 'deposit':
                    if (params?.address && store.wallets.length > 0) {
                        store.setDeepLinkData({
                            qrRequest: {
                                address: params?.address,
                                amount: params?.amount,
                                token: params?.token,
                            },
                        });
                    }
                    break;
                case 'sign':
                    if (params?.callback) {
                        store.setDeepLinkData({
                            authRequest: {
                                callback: params?.callback,
                                message: params?.message,
                            },
                        });
                    }
                    break;
            }
        }
    }, [params?.action]);

    useEffect(() => {
        if (isAnimationFinished) {
            if (
                store.password.value !== undefined &&
                store.wallets.length > 0
            ) {
                if (store.uuid) {
                    if (!unlockedPassword) {
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'PasswordStack',
                                    state: {
                                        routes: [
                                            {
                                                name: 'Password',
                                                params: {
                                                    type: 'unlock',
                                                    next: {
                                                        stack: 'MainTabs',
                                                        screen: 'WalletStack',
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        });
                    } else {
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'MainTabs',
                                    state: {
                                        routes: [
                                            {
                                                name: 'WalletStack',
                                            },
                                        ],
                                    },
                                },
                            ],
                        });
                    }
                } else {
                    store.setUUID(store.wallets[0].uuid);
                }
            } else if (
                store.password.value !== undefined &&
                unlockedPassword === undefined
            ) {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'PasswordStack',
                            state: {
                                routes: [
                                    {
                                        name: 'Password',
                                        params: {
                                            type: 'unlock',
                                            next: {
                                                stack: 'OnboardingStack',
                                                screen: 'Welcome',
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                });
            } else if (!store.password.value) {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'PasswordStack',
                            state: {
                                routes: [
                                    {
                                        name: 'Password',
                                        params: {type: 'new-password'},
                                    },
                                ],
                            },
                        },
                    ],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'OnboardingStack',
                            state: {
                                routes: [
                                    {
                                        name: 'Welcome',
                                    },
                                ],
                            },
                        },
                    ],
                });
            }
        }
    }, [store.uuid, isAnimationFinished]);

    return (
        <Container gradient style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <LottieView
                speed={1}
                style={{height: 100, width: 100}}
                source={require('../../assets/loader.json')}
                autoPlay
                loop={false}
                onAnimationFinish={() => setIsAnimationFinished(true)}
            />
        </Container>
    );
};

export default Splash;
