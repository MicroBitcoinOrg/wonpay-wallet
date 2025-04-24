import React, { useEffect } from 'react';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import { onlineManager } from 'react-query';

interface NetworkProviderProps {
    children: any;
}

type NetworkContextType = {
    network?: {
        isConnected: boolean | null;
        type: string;
    };
};

const networkContextState: NetworkContextType = {};

export const NetworkContext = React.createContext<NetworkContextType>(networkContextState);

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
    const { t } = useTranslation();
    const netInfo = useNetInfo();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (!state.isConnected)
                showMessage({
                    message: t('network.alerts.message'),
                    description: t('network.alerts.description'),
                    type: 'danger',
                });
            onlineManager.setOnline(state.isConnected !== null ? state.isConnected : undefined);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <NetworkContext.Provider value={{ network: { type: netInfo.type, isConnected: netInfo.isConnected } }}>
            {children}
        </NetworkContext.Provider>
    );
};
