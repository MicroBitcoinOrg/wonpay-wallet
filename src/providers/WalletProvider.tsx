import React, {useCallback, useContext, useEffect, useState} from 'react';

import useAppStore from '../store/appStore';
import {CHAINS} from '../utils/constants';
import {Wallet} from '../types/Wallet';
import useWalletUtils from '../services/hooks/useWalletUtils';
import {PasswordContext} from './PasswordProvider';
import {decryptData} from '../utils/common';

interface WalletProviderProps {
    children: any;
}

type WalletContextType = {
    wallet?: Wallet.Wallet;
    chain?: Wallet.Chain;
    chainKey?: Wallet.ChainEnum.MICROBITCOIN | Wallet.ChainEnum.TRON;
    walletChain?: Wallet.WalletChain;
    searchActivated?: boolean;
    setSearchActivated: (arg1: boolean) => void;
    deleteCache?: () => void;
    changeWalletTitle?: (arg0: string) => void;
};

const walletContextState: WalletContextType = {
    setSearchActivated: () => {},
};

export const useWallet = () => {
    return useContext(WalletContext);
};

export const WalletContext =
    React.createContext<WalletContextType>(walletContextState);

export const WalletProvider = ({children}: WalletProviderProps) => {
    const store = useAppStore();
    const [searchActivated, setSearchActivated] = useState<boolean>(false);
    const {uuid} = store;
    const wallet: Wallet.Wallet | undefined = store.wallets.find(
        (w: Wallet.Wallet) => w.uuid === uuid,
    );
    const {createWalletChain} = useWalletUtils();
    const {unlockedPassword} = useContext(PasswordContext);

    const chainKey =
        wallet && wallet.activeChain
            ? wallet.activeChain
            : Wallet.ChainEnum.MICROBITCOIN;
    const chain = CHAINS[chainKey];

    const walletChain = wallet && wallet.chains[chainKey];

    const deleteCache = useCallback(() => {
        if (!wallet) return;

        store.updateWallet(uuid!, {
            ...wallet,
            chains: {
                [Wallet.ChainEnum.MICROBITCOIN]: {
                    ...wallet.chains[Wallet.ChainEnum.MICROBITCOIN],
                    transactions: [],
                },
                [Wallet.ChainEnum.TRON]: {
                    ...wallet.chains[Wallet.ChainEnum.TRON],
                    transactions: [],
                },
            },
        });
    }, [wallet, uuid, chainKey]);

    const changeWalletTitle = useCallback(
        (title: string) => {
            store.updateWallet(uuid!, {title});
        },
        [uuid],
    );

    const checkWalletChain = async (
        _chainKey: Wallet.ChainEnum.MICROBITCOIN | Wallet.ChainEnum.TRON,
    ) => {
        if (
            wallet!.chains[_chainKey].depositAddress === '' &&
            wallet!.chains[_chainKey].addresses.length === 0
        ) {
            store.setLoading(true);
            const walletChain = await createWalletChain(_chainKey)({
                seedPhrase: decryptData(wallet!.seedPhrase, unlockedPassword!),
                type: 'create',
            });

            store.updateWalletChain(wallet!.uuid, _chainKey, walletChain);
            store.setLoading(false);
        }
    };

    useEffect(() => {
        if (wallet && unlockedPassword) {
            checkWalletChain(Wallet.ChainEnum.MICROBITCOIN);
            checkWalletChain(Wallet.ChainEnum.TRON);
        }
    }, [wallet, unlockedPassword]);

    return (
        <WalletContext.Provider
            value={{
                wallet,
                walletChain,
                chainKey,
                chain: chain as Wallet.Chain,
                searchActivated,
                setSearchActivated,
                deleteCache,
                changeWalletTitle,
            }}>
            {children}
        </WalletContext.Provider>
    );
};
