import {Wallet} from '../../../types/Wallet';
import {TRON} from '../../../utils/constants';
import {
    fetchTrc10Transfers,
    fetchTrc20Transfers,
    fetchTrxTransfers,
} from '../api/getTransactions';

const extractWalletAddresses = (wallet: Wallet.Wallet): string[] => {
    return wallet
        ? [
              ...new Set(
                  wallet.chains.tron.addresses.map(
                      (a: Wallet.Address) => a.address,
                  ),
              ),
          ]
        : [];
};

const mapTransaction = (
    tx: any,
    walletAddresses: string[],
    currency: Wallet.Currency,
): Wallet.Transaction => {
    const isSent = walletAddresses.includes(tx.from);
    const amount = Number(tx.amount || 0);

    return {
        hash: tx.hash,
        confirmations: tx.confirmed,
        amount: amount,
        fee: 0,
        time: Math.floor(tx.block_timestamp / 1000),
        type: isSent ? 'sent' : 'received',
        currency: currency,
        from: tx.from,
        to: tx.to,
    };
};

export const getWalletMainTransactions = async (data: {
    wallet: Wallet.Wallet;
}): Promise<Wallet.Transaction[]> => {
    const walletAddresses = extractWalletAddresses(data.wallet);
    const address = data.wallet.chains.tron.depositAddress;

    try {
        const responseData = await fetchTrxTransfers(address);

        const txs = responseData.data || [];

        return txs.map((tx: any) =>
            mapTransaction(tx, walletAddresses, TRON.currency),
        );
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
    const address = data.wallet.chains.tron.depositAddress;
    const contractAddress = data.currency.contract;
    const type = data.currency.type;

    try {
        if (!contractAddress) return [];

        const responseData =
            type === 'TRC20'
                ? await fetchTrc20Transfers(address, contractAddress)
                : await fetchTrc10Transfers(address, contractAddress);

        const txs = responseData.token_transfers || [];

        return txs.map((tx: any) =>
            mapTransaction(tx, walletAddresses, data.currency),
        );
    } catch (e) {
        console.error('Error fetching token transactions:', e);
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
