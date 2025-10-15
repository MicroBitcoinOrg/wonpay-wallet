import * as React from 'react';
import FlashMessage from 'react-native-flash-message';

import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
    Theme,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ModalStack, navigationRef} from './src/routes';
import {
    NetworkProvider,
    PasswordProvider,
    WalletProvider,
} from './src/providers';
import './localization';
import {useColorScheme, View} from 'react-native';
import {Colors} from './src/theme';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000,
        },
    },
});

const App = () => {
    const scheme = useColorScheme();

    const linking = {
        prefixes: ['wonpay://'],
        config: {
            screens: {
                RootStack: {
                    screens: {
                        Splash: ':action',
                    },
                },
            },
        },
    };

    const theme: Theme =
        scheme === 'dark'
            ? {
                  ...DarkTheme,
                  colors: {
                      ...DarkTheme.colors,
                      ...Colors.dark,
                  },
              }
            : {
                  ...DefaultTheme,
                  colors: {
                      ...DefaultTheme.colors,
                      ...Colors.light,
                  },
              };

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{flex: 1}}>
                <BottomSheetModalProvider>
                    <QueryClientProvider client={queryClient}>
                        <NetworkProvider>
                            <NavigationContainer
                                ref={navigationRef}
                                linking={linking}
                                theme={theme}>
                                <PasswordProvider>
                                    <WalletProvider>
                                        <ModalStack />
                                    </WalletProvider>
                                </PasswordProvider>
                            </NavigationContainer>

                            <FlashMessage
                                statusBarHeight={48}
                                animationDuration={200}
                                position="top"
                                floating
                            />
                        </NetworkProvider>
                    </QueryClientProvider>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
};

export default App;
