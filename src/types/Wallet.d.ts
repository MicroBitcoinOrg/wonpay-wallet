declare namespace Wallet {
    type Address = {
        address: string;
        wif: string;
        index: number;
    };

    type Balance = {
        balance: number;
        currency: Currency;
        main: boolean;
    };

    type AddressBook = {
        address: string;
        title: string;
        favorite: boolean;
        chain: Wallet.ChainKey;
    };

    type Currency = {
        ticker: string;
        units: number;
    };

    type Transaction = {
        type: 'sent' | 'received';
        confirmations: number;
        hash: string;
        amount: number;
        to?: string;
        from?: string;
        time: number;
        fee: number;
        currency: Currency;
    };

    type Wallet = {
        title: string;
        seedPhrase: string;
        transactions: Transaction[];
        balances: Balance[];
        depositAddress: string;
        addresses: Address[];
        createdAt: number;
        uuid: string;
        chain: ChainKey;
    };

    type Chain = {
        derivationPath: string;
        network: {
            scriptHash: number;
            pubKeyHash: number;
            wif: number;
            bip32: {
                public: number;
                private: number;
            };
            messagePrefix: string;
            bech32: string;
        };
        currency: {
            ticker: string;
            units: number;
        };
        name: string;
        regex: {
            address: string;
            transaction: string;
        };
        explorerLink: string;
        apiLink: string;
        tokensApiLink: string;
        minFee: number;
        active: boolean;
        key: ChainKey;
    };

    type ChainKey =
        | 'microbitcoin'
        | 'solana'
        | 'tron'
        | 'ethereum'
        | 'binancechain';
}
