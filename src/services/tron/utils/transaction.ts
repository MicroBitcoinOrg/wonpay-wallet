import {Wallet} from '../../../types/Wallet';
import {TRON} from '../../../utils/constants';

// Helper to extract wallet addresses from wallet data
const extractWalletAddresses = (wallet: Wallet.Wallet): string[] => {
    return wallet
        ? [...new Set(wallet.addresses.map((a: Wallet.Address) => a.address))]
        : [];
};

// Helper to map TRX transaction from new API format to Wallet.Transaction
const mapTrxTransactionNew = (
    tx: any,
    walletAddresses: string[],
): Wallet.Transaction => {
    const isSent = walletAddresses.includes(tx.transferFromAddress);
    const amount = Number(tx.amount || 0);
    const ticker = tx.tokenInfo?.tokenAbbr || 'TRX';
    const units = tx.tokenInfo?.tokenDecimal || 6;

    return {
        hash: tx.transactionHash,
        confirmations: tx.confirmed ? 1 : 0,
        amount: amount,
        fee: 0, // New API doesn't provide fee information
        time: Math.floor(tx.timestamp / 1000),
        type: isSent ? 'sent' : 'received',
        currency: TRON.currency,
        from: tx.transferFromAddress,
        to: tx.transferToAddress,
    };
};

// Helper to map TRC20 transaction from new API format to Wallet.Transaction
const mapTrc20Transaction = (
    tx: any,
    walletAddresses: string[],
): Wallet.Transaction => {
    const isSent = walletAddresses.includes(tx.from_address);
    const amount = Number(tx.quant || tx.amount || 0);
    const ticker = tx.tokenInfo?.tokenAbbr.toUpperCase() || 'TOKEN';
    const units = tx.tokenInfo?.tokenDecimal || 6;

    return {
        hash: tx.transaction_id,
        confirmations: tx.confirmed ? 1 : 0,
        amount: amount,
        fee: 0, // New API doesn't provide fee information in the same way
        time: Math.floor(tx.block_ts / 1000),
        type: isSent ? 'sent' : 'received',
        currency: {
            ticker,
            units,
            contract:
                tx.contract_address || (tx.tokenInfo && tx.tokenInfo.tokenId),
        },
        from: tx.from_address,
        to: tx.to_address,
    };
};

// Fetch TRX (native) transactions using new API endpoint
export const getWalletMainTransactions = async (data: {
    wallet: Wallet.Wallet;
}): Promise<Wallet.Transaction[]> => {
    const walletAddresses = extractWalletAddresses(data.wallet);
    const address = data.wallet.depositAddress;

    try {
        // Use the new TRX transfer endpoint
        const url = `${TRON.links.tronscanApi.url}/api/new/trx/transfer`;
        const params = new URLSearchParams({
            sort: '-timestamp',
            count: 'true',
            limit: '50',
            start: '0',
            address: address,
            filterTokenValue: '0',
        });

        const res = await fetch(`${url}?${params}`);
        const responseData = await res.json();

        // The new API returns data array
        const txs = responseData.data || [];

        return txs.map((tx: any) => mapTrxTransactionNew(tx, walletAddresses));
    } catch (e) {
        console.error('Error fetching TRX transactions:', e);
        return [];
    }
};

// Fetch TRC20 token transactions using new API
export const getWalletTokenTransactions = async (data: {
    wallet: Wallet.Wallet;
    currency: Wallet.Currency;
}): Promise<Wallet.Transaction[]> => {
    const walletAddresses = extractWalletAddresses(data.wallet);
    const address = data.wallet.depositAddress;
    const contractAddress = data.currency.contract;

    try {
        if (!contractAddress) return [];

        // Use the new API endpoint for TRC20 tokens
        const url = `${TRON.links.tronscanApi.url}/api/new/filter/trc20/transfers`;
        const params = new URLSearchParams({
            limit: '50',
            start: '0',
            sort: '-timestamp',
            count: 'true',
            filterTokenValue: '0',
            relatedAddress: address,
            tokens: contractAddress,
        });

        const res = await fetch(`${url}?${params}`);
        const responseData = await res.json();

        // The new API returns token_transfers array
        const txs = responseData.token_transfers || [];

        return txs.map((tx: any) => mapTrc20Transaction(tx, walletAddresses));
    } catch (e) {
        console.error('Error fetching TRC20 transactions:', e);
        return [];
    }
};

// Unified function to get wallet transactions - decides between TRX and TRC20
export const getWalletTransactions =
    (walletData: {wallet: Wallet.Wallet}) =>
    async (data: {
        currency: Wallet.Currency;
    }): Promise<Wallet.Transaction[]> => {
        if (data.currency.ticker === TRON.currency.ticker) {
            return getWalletMainTransactions(walletData);
        } else {
            return getWalletTokenTransactions({
                ...walletData,
                currency: data.currency,
            });
        }
    };
