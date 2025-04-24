import AsyncStorage from '@react-native-async-storage/async-storage';
import {StateCreator, create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

interface AppStore {
    password: {
        type: 'pin' | 'password';
        useBiometric?: boolean;
        value?: string;
    };
    isLegalAgreed: boolean;
    wallets: Wallet.Wallet[];
    addressBook: Wallet.AddressBook[];
    name: string;
    qrRequestData?: {
        token?: string;
        address: string;
        amount?: string;
    };
    authRequestData?: {
        message: string;
        callback: string;
    };
    deeplinkData?: Record<string, any>;
    sortWalletsBy: 'balance' | 'date' | 'title';
    uuid?: string;
    migration: Record<string, boolean>;
    isLoading?: boolean;
}

interface AppActions {
    setLoading: (isLoading: boolean) => void;
    setLegal: (isLegalAgreed: boolean) => void;
    setName: (name: string) => void;
    setPassword: (password: {
        type?: 'pin' | 'password';
        value?: string;
        useBiometric?: boolean;
    }) => void;
    setNewWallet: (wallet: Partial<Wallet.Wallet>) => void;

    saveAddressBookItem: (addressBook: Wallet.AddressBook) => void;
    deleteAddressBook: () => void;
    deleteAddressBookItem: (address: string) => void;
    updateWallet: (uuid: string, data: Partial<Wallet.Wallet>) => void;
    deleteWallet: (uuid: string) => void;
    updateWallets: (wallets: Wallet.Wallet[]) => void;
    addTransactions: (uuid: string, transactions: Wallet.Transaction[]) => void;
    setQrRequestData: (data: {
        address: string;
        amount?: string;
        token?: string;
    }) => void;
    setDeepLinkData: (data?: Record<string, any>) => void;
    setSortWalletsBy: (sortWalletsBy: 'balance' | 'date' | 'title') => void;
    setUUID: (uuid: string) => void;
    setMigration: (migration: Record<string, boolean>) => void;
    reset: () => void;
}

const initialState: AppStore = {
    isLegalAgreed: false,
    password: {
        type: 'pin',
        value: undefined,
        useBiometric: undefined,
    },
    wallets: [],
    addressBook: [],
    name: '',
    qrRequestData: undefined,
    authRequestData: undefined,
    deeplinkData: undefined,
    sortWalletsBy: 'balance',
    uuid: undefined,
    migration: {
        '2.2.0': false,
        '2.2.2': false,
    },
    isLoading: false,
};

const initialWallet: Wallet.Wallet = {
    title: '',
    seedPhrase: '',
    transactions: [],
    balances: [],
    depositAddress: '',
    addresses: [],
    createdAt: Date.now() / 1000,
    uuid: '',
    chain: 'microbitcoin',
};

const appStore: StateCreator<
    AppStore & AppActions,
    [],
    [],
    AppStore
> = set => ({
    ...initialState,
});

const appActions: StateCreator<
    AppStore & AppActions,
    [],
    [],
    AppActions
> = set => ({
    setLoading: isLoading => set(state => ({isLoading})),
    setLegal: isLegalAgreed => set(state => ({isLegalAgreed})),
    setName: name => set(state => ({name})),
    setPassword: password =>
        set(state => ({password: {...state.password, ...password}})),
    setNewWallet: wallet =>
        set(state => ({
            wallets: [
                ...state.wallets,
                {
                    ...initialWallet,
                    ...wallet,
                    createdAt: Date.now() / 1000,
                },
            ],
            uuid: wallet.uuid,
        })),
    saveAddressBookItem: (addressBook: Wallet.AddressBook) =>
        set(state => ({
            addressBook: [
                ...state.addressBook.filter(
                    addressBookItem =>
                        addressBookItem.address !== addressBook.address,
                ),
                addressBook,
            ],
        })),
    deleteAddressBook: () =>
        set(state => ({
            addressBook: [],
        })),
    deleteAddressBookItem: (address: string) =>
        set(state => ({
            addressBook: [
                ...state.addressBook.filter(
                    addressBookItem => addressBookItem.address !== address,
                ),
            ],
        })),
    updateWallet: (uuid, data) =>
        set(state => ({
            wallets: state.wallets.map((wallet: Wallet.Wallet) => {
                if (wallet.uuid === uuid) {
                    return {...wallet, ...data};
                } else {
                    return wallet;
                }
            }),
        })),
    deleteWallet: (uuid: string) =>
        set(state => {
            const newWallets = state.wallets.filter(
                wallet => wallet.uuid !== uuid,
            );

            if (newWallets.length >= 1) {
                return {
                    ...state,
                    wallets: newWallets,
                    uuid: newWallets[0].uuid,
                };
            }

            return {
                wallets: newWallets,
                uuid: undefined,
            };
        }),
    updateWallets: (wallets: Wallet.Wallet[]) =>
        set(state => ({
            wallets,
        })),
    addTransactions: (uuid: string, transactions: Wallet.Transaction[]) =>
        set(state => ({
            wallets: state.wallets.map((wallet: Wallet.Wallet) => {
                if (wallet.uuid === uuid) {
                    return {
                        ...wallet,
                        transactions: [...transactions, ...wallet.transactions]
                            .filter(
                                (transaction, index, self) =>
                                    index ===
                                    self.findIndex(
                                        t => t.hash === transaction.hash,
                                    ),
                            )
                            .sort((a, b) => {
                                const keyA = new Date(a.time * 1000);
                                const keyB = new Date(b.time * 1000);

                                if (keyA > keyB) return -1;
                                if (keyA < keyB) return 1;
                                return 0;
                            }),
                    };
                } else {
                    return wallet;
                }
            }),
        })),
    setQrRequestData: (data: {
        address: string;
        amount?: string;
        token?: string;
    }) =>
        set(state => ({
            qrRequestData: data,
        })),
    setDeepLinkData: data =>
        set(state => ({
            deeplinkData: data,
        })),
    setSortWalletsBy: (sortWalletsBy: 'balance' | 'date' | 'title') =>
        set(state => ({
            sortWalletsBy,
        })),
    setUUID: (uuid: string) =>
        set(state => ({
            uuid,
        })),
    setMigration: (migration: Record<string, boolean>) =>
        set(state => ({
            migration: {...state.migration, ...migration},
        })),
    reset: () => set(state => ({...initialState})),
});

const useAppStore = create<AppStore & AppActions>()(
    persist(
        (...a) => ({
            ...appStore(...a),
            ...appActions(...a),
        }),
        {name: 'root', storage: createJSONStorage(() => AsyncStorage)},
    ),
);

export default useAppStore;
