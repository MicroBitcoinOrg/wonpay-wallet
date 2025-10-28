import React, {useState, useEffect, useContext} from 'react';
import useAppStore from '../store/appStore';
import {useAuthMessage, useLogin} from '../services/mex/hooks';
import {useWallet, WalletContext} from './WalletProvider';
import {signMessage} from '../utils/address';
import {PasswordContext} from './PasswordProvider';
import {decryptData} from '../utils/common';
import {MICROBITCOIN} from '../utils/constants';

interface P2PProviderProps {
    children: any;
}

type P2PContextType = {
    token: string | null;
    isAuthenticated: boolean;
    error: string | null;
};

const p2pContextState: P2PContextType = {
    token: null,
    isAuthenticated: false,
    error: null,
};

export const P2PContext = React.createContext<P2PContextType>(p2pContextState);

export const P2PProvider = ({children}: P2PProviderProps) => {
    const {wallet} = useWallet();
    const {unlockedPassword} = useContext(PasswordContext);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {mutateAsync: mutateAuthMessageAsync} = useAuthMessage({
        retry: 1,
    });

    const loginMutation = useLogin();

    const login = async () => {
        if (!wallet) {
            setError('No wallet available');
            return;
        }

        try {
            setError(null);

            const authMessage = await mutateAuthMessageAsync();

            // Get the auth message
            if (!authMessage) {
                throw new Error('Failed to get authentication message');
            }

            const wif = decryptData(
                wallet.chains.microbitcoin.addresses[0].wif,
                unlockedPassword!,
            );

            // Sign the message with the wallet
            const signature = signMessage(
                wif,
                authMessage,
                MICROBITCOIN.network,
            );

            // Login with the signed message
            const response = await loginMutation.mutateAsync({
                message: authMessage,
                signature,
                address: wallet.chains.microbitcoin.addresses[0].address,
            });

            setToken(response.secret);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        }
    };

    useEffect(() => {
        if (wallet) {
            login();
        }
    }, [wallet?.uuid]);

    return (
        <P2PContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                error,
            }}>
            {children}
        </P2PContext.Provider>
    );
};
