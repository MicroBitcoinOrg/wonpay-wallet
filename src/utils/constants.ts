import Config from 'react-native-config';
import {Wallet} from '../types/Wallet';
import {Currency} from '../services/mex/api';

export const MICROBITCOIN: Wallet.Chain = {
    derivationPath: "m/44'/0'/0'/",
    network: {
        scriptHash: 0x33,
        pubKeyHash: 0x1a,
        wif: 0x80,
        bip32: {
            public: 76067358,
            private: 76066276,
        },
        messagePrefix: '\x1dMicroBitcoin Signed Message:\n',
        bech32: 'mbc',
    },
    currency: {
        ticker: 'MBC',
        units: 4,
    },
    name: 'MicroBitcoin',
    regex: {
        address: ['[BM][a-zA-HJ-NP-Z0-9]{33}', '^mbc1[q|p][0-9a-z]{38}$'],
        transaction: ['^[a-fA-F0-9]{64}$'],
    },
    links: {
        explorer: {
            url: 'https://microbitcoinorg.github.io/explorer/#',
        },
        api: {
            url: 'https://apiv2.mbc.wiki',
        },
        tokensApi: {
            url: 'https://tokens.mbc.wiki',
        },
        iconsApi: {
            url: 'https://icons.mbc.wiki',
        },
        statsApi: {
            url: 'https://stats.mbc.wiki',
        },
    },
    minFee: 1,
    active: true,
    key: Wallet.ChainEnum.MICROBITCOIN,
    logo: require('../assets/chains/microbitcoin/MBC.jpg'),
    color: '#0214B0',
};

export const TRON: Wallet.Chain = {
    derivationPath: "m/44'/195'/0'/",
    network: {
        scriptHash: 0x00,
        pubKeyHash: 0x41,
        wif: 0x80,
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        messagePrefix: '\x19TRON Signed Message:\n',
        bech32: '',
    },
    currency: {
        ticker: 'TRX',
        units: 6,
    },
    name: 'TRON',
    regex: {
        address: ['^T[1-9A-HJ-NP-Za-km-z]{33}$'],
        transaction: ['^[a-fA-F0-9]{64}$'],
    },
    links: {
        explorer: {
            url: 'https://tronscan.org/#/transaction/',
        },
        api: {
            url: 'https://api.trongrid.io',
            key: '988f5144-6a7c-410a-be76-2e7270831c4d',
        },
        tronscanApi: {
            url: 'https://tp.mbc.wiki',
        },
    },
    /* links: {
        explorer: {
            url: 'https://nile.tronscan.org/#',
        },
        api: {
            url: 'https://nile.trongrid.io',
            key: Config.TRONGRID_API_KEY,
        },
        tronscanApi: {
            url: 'https://nileapi.tronscan.org',
        },
    }, */
    minFee: 0,
    active: true,
    key: Wallet.ChainEnum.TRON,
    logo: require('../assets/chains/tron/TRON.jpg'),
    color: '#FF060A',
};

export const ETHEREUM: Partial<Wallet.Chain> = {
    currency: {
        ticker: 'ETH',
        units: 0,
    },
    name: 'Ethereum',
    active: false,
    key: Wallet.ChainEnum.ETHEREUM,
};

export const SOLANA: Partial<Wallet.Chain> = {
    currency: {
        ticker: 'SOL',
        units: 0,
    },
    name: 'Solana',
    active: false,
    key: Wallet.ChainEnum.SOLANA,
};

export const BINANCECHAIN: Partial<Wallet.Chain> = {
    currency: {
        ticker: 'BNB',
        units: 0,
    },
    name: 'Binance Chain',
    active: false,
    key: Wallet.ChainEnum.BINANCECHAIN,
};

export const CHAINS: Record<
    Wallet.ChainEnum,
    Partial<Wallet.Chain> | Wallet.Chain
> = {
    [Wallet.ChainEnum.MICROBITCOIN]: MICROBITCOIN,
    [Wallet.ChainEnum.TRON]: TRON,
    [Wallet.ChainEnum.ETHEREUM]: ETHEREUM,
    [Wallet.ChainEnum.SOLANA]: SOLANA,
    [Wallet.ChainEnum.BINANCECHAIN]: BINANCECHAIN,
};

export const MEX_CURRENCIES: Currency[] = [
    {network: Wallet.ChainEnum.MICROBITCOIN, currency: 'TEST'},
    {network: Wallet.ChainEnum.MICROBITCOIN, currency: 'SATOSHI'},
    {network: Wallet.ChainEnum.TRON, currency: 'USDT'},
];
