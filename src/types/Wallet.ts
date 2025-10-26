import {ImageSourcePropType} from 'react-native';

export namespace Wallet {
    export type Address = {
        address: string;
        wif: string;
        privateKey?: string;
        index: number;
    };

    export type Balance = {
        balance: number;
        currency: Currency;
        main: boolean;
    };

    export type AddressBook = {
        address: string;
        title: string;
        favorite: boolean;
        chain: Wallet.ChainEnum;
    };

    export type Currency = {
        ticker: string;
        units: number;
        contract?: string;
        iconLink?: string;
        type?: string;
    };

    export type Transaction = {
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

    export type WalletChain = {
        transactions: Transaction[];
        balances: Balance[];
        depositAddress: string;
        addresses: Address[];
    };

    export type Wallet = {
        title: string;
        seedPhrase: string;
        chains: Record<ChainEnum.MICROBITCOIN | ChainEnum.TRON, WalletChain>;
        createdAt: number;
        uuid: string;
        activeChain: ChainEnum.MICROBITCOIN | ChainEnum.TRON;
    };

    export type ChainLink = {
        url: string;
        key?: string;
    };

    export type Chain = {
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
            address: string[];
            transaction: string[];
        };
        links: {
            explorer: ChainLink;
            api: ChainLink;
            tokensApi?: ChainLink;
        } & Record<string, ChainLink>;
        minFee: number;
        active: boolean;
        key: ChainEnum;
        logo?: ImageSourcePropType;
        color?: string;
    };

    export enum ChainEnum {
        MICROBITCOIN = 'microbitcoin',
        SOLANA = 'solana',
        TRON = 'tron',
        ETHEREUM = 'ethereum',
        BINANCECHAIN = 'binancechain',
    }
}
