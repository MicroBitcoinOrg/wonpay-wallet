import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { navigationRef } from '../routes';

interface PasswordProviderProps {
    children: any;
}

type PasswordContextType = {
    unlockedPassword?: string;
    setUnlockedPassword: (arg0: string) => void;
};

const passwordContextState: PasswordContextType = {
    setUnlockedPassword: () => {},
};

export const PasswordContext = React.createContext<PasswordContextType>(passwordContextState);

export const PasswordProvider = ({ children }: PasswordProviderProps) => {
    const [unlockedPassword, setUnlocked] = useState<string | undefined>();
    const appState = useRef(AppState.currentState);
    const [isBlurActive, setIsBlurActive] = useState<boolean>(false);
    const lastUnlocked = useRef<number | undefined>();

    const setUnlockedPassword = (password: string) => {
        setUnlocked(password);
        lastUnlocked.current = Date.now();
        console.log(lastUnlocked);
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            if (lastUnlocked.current !== undefined) {
                if (Date.now() - lastUnlocked.current > 600000) {
                    // @ts-ignore
                    navigationRef.navigate('PasswordStack', {
                        screen: 'Password',
                        params: { type: 'unlock' },
                    });
                }
            } else {
                lastUnlocked.current = Date.now();
            }
        }

        setIsBlurActive(nextAppState !== 'active');
        appState.current = nextAppState;
    };

    useEffect(() => {
        const sub = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            sub.remove();
        };
    }, []);

    return (
        <PasswordContext.Provider value={{ unlockedPassword, setUnlockedPassword }}>
            <Modal visible={isBlurActive} transparent animationType="fade">
                <BlurView
                    style={{ flex: 1 }}
                    blurType="light"
                    blurAmount={20}
                    reducedTransparencyFallbackColor="white"
                />
            </Modal>
            {children}
        </PasswordContext.Provider>
    );
};
