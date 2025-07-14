import {Wallet} from '../../../types/Wallet';
import {TRON} from '../../../utils/constants';
import {fetchTrc20Transfers, fetchTrxTransfers} from '../api/getTransactions';

const extractWalletAddresses = (wallet: Wallet.Wallet): string[] => {
    return wallet
        ? [...new Set(wallet.addresses.map((a: Wallet.Address) => a.address))]
        : [];
};

const mapTrxTransaction = (
    tx: any,
    walletAddresses: string[],
): Wallet.Transaction => {
    const isSent = walletAddresses.includes(tx.transferFromAddress);
    const amount = Number(tx.amount || 0);

    return {
        hash: tx.transactionHash,
        confirmations: tx.confirmed ? 1 : 0,
        amount: amount,
        fee: 0,
        time: Math.floor(tx.timestamp / 1000),
        type: isSent ? 'sent' : 'received',
        currency: TRON.currency,
        from: tx.transferFromAddress,
        to: tx.transferToAddress,
    };
};

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
        fee: 0,
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

export const getWalletMainTransactions = async (data: {
    wallet: Wallet.Wallet;
}): Promise<Wallet.Transaction[]> => {
    const walletAddresses = extractWalletAddresses(data.wallet);
    const address = data.wallet.depositAddress;

    try {
        const responseData = await fetchTrxTransfers(address);

        const txs = responseData.data || [];

        return txs.map((tx: any) => mapTrxTransaction(tx, walletAddresses));
    } catch (e) {
        console.error('Error fetching TRX transactions:', e);
        return [];
    }
};

export const getWalletTokenTransactions = async (data: {
    wallet: Wallet.Wallet;
    currency: Wallet.Currency;
}): Promise<Wallet.Transaction[]> => {
    const walletAddresses = extractWalletAddresses(data.wallet);
    const address = data.wallet.depositAddress;
    const contractAddress = data.currency.contract;

    try {
        if (!contractAddress) return [];

        const responseData = await fetchTrc20Transfers(
            address,
            contractAddress,
        );

        const txs = responseData.token_transfers || [];

        return txs.map((tx: any) => mapTrc20Transaction(tx, walletAddresses));
    } catch (e) {
        console.error('Error fetching TRC20 transactions:', e);
        return [];
    }
};

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
