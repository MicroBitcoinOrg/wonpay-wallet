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
        messagePrefix: '\x19Bitcoin Signed Message:\n',
        bech32: 'mbc',
    },
    currency: {
        ticker: 'MBC',
        units: 4,
    },
    name: 'MicroBitcoin',
    regex: {
        address: '[BM][a-zA-HJ-NP-Z0-9]{33}',
        transaction: '^[a-fA-F0-9]{64}$',
    },
    explorerLink: 'https://microbitcoinorg.github.io/explorer/#',
    apiLink: 'https://apiv2.mbc.wiki',
    tokensApiLink: 'https://tokens.mbc.wiki',
    minFee: 1,
    active: true,
    key: 'microbitcoin',
};

export const ETHEREUM: Partial<Wallet.Chain> = {
    currency: {
        ticker: 'ETH',
        units: 0,
    },
    name: 'Ethereum',
    active: false,
    key: 'ethereum',
};

export const SOLANA: Partial<Wallet.Chain> = {
    currency: {
        ticker: 'SOL',
        units: 0,
    },
    name: 'Solana',
    active: false,
    key: 'solana',
};

export const TRON: Partial<Wallet.Chain> = {
    currency: {
        ticker: 'TRX',
        units: 0,
    },
    name: 'Tron',
    active: false,
    key: 'tron',
};

export const BINANCECHAIN: Partial<Wallet.Chain> = {
    currency: {
        ticker: 'BNB',
        units: 0,
    },
    name: 'Binance Chain',
    active: false,
    key: 'binancechain',
};

export const CHAINS = {
    microbitcoin: MICROBITCOIN,
    ethereum: ETHEREUM,
    solana: SOLANA,
    tron: TRON,
    binancechain: BINANCECHAIN,
};
