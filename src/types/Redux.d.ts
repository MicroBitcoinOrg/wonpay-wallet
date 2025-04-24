declare namespace Redux {
    type Action = {
        type: string;
        payload?: Record<string, any>;
    };

    interface ReducerState {
        password: {
            type: 'pin' | 'password';
            useBiometric?: boolean;
            value?: string;
        };
        currencies?: MBC.Currency[];
        tokens?: MBC.Token[];
        currency?: MBC.Currency;
        isLegalAgreed: boolean;
        networks: MBC.Network[];
        network?: MBC.Network;
        wallets: MBC.Wallet[];
        addressBook: MBC.AddressBook[];
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

    interface RootState {
        app: ReducerState;
    }
}
