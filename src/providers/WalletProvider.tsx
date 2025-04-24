import React, {useState} from 'react';

import useAppStore from '../store/appStore';
import {CHAINS} from '../utils/constants';

interface WalletProviderProps {
    children: any;
}

type WalletContextType = {
    wallet?: Wallet.Wallet;
    walletChain?: Wallet.Chain;
    searchActivated?: boolean;
    setSearchActivated: (arg1: boolean) => void;
    deleteCache?: () => void;
    changeWalletTitle?: (arg0: string) => void;
};

const walletContextState: WalletContextType = {
    setSearchActivated: () => {},
};

export const WalletContext =
    React.createContext<WalletContextType>(walletContextState);

export const WalletProvider = ({children}: WalletProviderProps) => {
    const store = useAppStore();
    const [searchActivated, setSearchActivated] = useState<boolean>(false);
    const {uuid} = store;
    const wallet = store.wallets.find((w: Wallet.Wallet) => w.uuid === uuid);
    const walletChain = wallet ? CHAINS[wallet?.chain] : undefined;

    const deleteCache = () => {
        store.updateWallet(uuid!, {
            ...wallet,
            transactions: [],
        });
    };

    const changeWalletTitle = (title: string) => {
        store.updateWallet(uuid!, {title});
    };

    return (
        <WalletContext.Provider
            value={{
                wallet,
                walletChain: walletChain as Wallet.Chain,
                searchActivated,
                setSearchActivated,
                deleteCache,
                changeWalletTitle,
            }}>
            {children}
        </WalletContext.Provider>
    );
};
