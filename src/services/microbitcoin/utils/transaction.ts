import {getTransactions} from '../api';
import {MICROBITCOIN} from '../../../utils/constants';
import getTokenTransactions from '../api/getTokenTransactions';

export const createTransactionFromAPI = async (
    transactionVerbose: any,
    walletAddresses: string[],
) => {
    const transaction: Wallet.Transaction = {
        hash: transactionVerbose.txid,
        confirmations: transactionVerbose.confirmations
            ? transactionVerbose.confirmations
            : 0,
        amount: 0,
        fee: transactionVerbose.fee,
        time:
            'timestamp' in transactionVerbose
                ? transactionVerbose.timestamp
                : Math.round(Date.now() / 1000),
        type: 'received',
        currency: {
            ticker: MICROBITCOIN.currency.ticker,
            units: Number(MICROBITCOIN.currency.units),
        },
    };

    transactionVerbose.inputs.forEach((vin: any) => {
        if (transactionVerbose.coinbase) {
            transaction.from = 'coinbase';
            return;
        }

        if (
            walletAddresses.includes(vin.address) &&
            vin.currency === transaction.currency.ticker
        ) {
            transaction.amount += vin.amount;
            transaction.type = 'sent';
            transaction.from = vin.address;
        }
    });

    if (transaction.amount === 0) {
        transaction.type = 'received';

        transactionVerbose.outputs.forEach((vout: any) => {
            if (vout.currency === transaction.currency.ticker) {
                if (walletAddresses.includes(vout.address)) {
                    transaction.amount += vout.amount;
                    transaction.to = vout.address;
                } else if (!transactionVerbose.coinbase) {
                    transaction.from = vout.address;
                }
            }
        });
    } else {
        transactionVerbose.outputs.forEach((vout: any) => {
            if (vout.currency === transaction.currency.ticker) {
                if (walletAddresses.includes(vout.address)) {
                    transaction.amount -= vout.amount;
                    // transaction.to = vout.address;
                } else {
                    transaction.to = vout.address;
                }
            }
        });

        if (!('to' in transaction)) {
            transaction.to = transaction.from;
        }

        if (transaction.amount < 0) {
            transaction.type = 'received';
            transaction.amount *= -1;
        }
    }

    return transaction;
};

export const createTokenTransactionFromAPI = async (
    transactionVerbose: any,
    walletAddresses: string[],
) => {
    const transaction: Wallet.Transaction = {
        hash: transactionVerbose.txid,
        confirmations: 1,
        amount: transactionVerbose.value,
        fee: 0,
        time:
            'created' in transactionVerbose
                ? transactionVerbose.created
                : Math.round(Date.now() / 1000),
        type: walletAddresses.includes(transactionVerbose.receiver)
            ? 'received'
            : 'sent',
        currency: {
            ticker: transactionVerbose.token,
            units: transactionVerbose.decimals,
        },
        from: transactionVerbose.sender,
        to: transactionVerbose.receiver,
    };

    return transaction;
};

export const getWalletTokenTransactions =
    (walletData: {wallet: Wallet.Wallet}) => async (currency?: string) => {
        const walletAddresses: string[] = walletData.wallet
            ? [
                  ...new Set(
                      walletData.wallet.addresses.map(
                          (a: Wallet.Address) => a.address,
                      ),
                  ),
              ]
            : [];

        try {
            const promises: any[] = [];
            const transactions: Wallet.Transaction[] = [];
            let apiTransactions: any[] = [];

            apiTransactions = await getTokenTransactions({
                address: walletData.wallet.depositAddress!,
                currency,
            });

            if (apiTransactions.length > 0) {
                for (let i = 0; i < apiTransactions.length; i++) {
                    if (apiTransactions[i].category === 'transfer') {
                        promises.push(
                            createTokenTransactionFromAPI(
                                apiTransactions[i],
                                walletAddresses,
                            ).then((transaction: Wallet.Transaction) => {
                                transactions.push(transaction);
                            }),
                        );
                    }
                }

                await Promise.all(promises);
            }

            return transactions;
        } catch (e) {
            console.error(e);

            return [];
        }
    };

export const getWalletTransactions =
    (walletData: {wallet: Wallet.Wallet}) => async () => {
        const walletAddresses: string[] = walletData.wallet
            ? [
                  ...new Set(
                      walletData.wallet.addresses.map(
                          (a: Wallet.Address) => a.address,
                      ),
                  ),
              ]
            : [];

        try {
            const promises: any[] = [];
            const transactions: Wallet.Transaction[] = [];
            let apiTransactions: any[] = [];

            apiTransactions = await getTransactions({
                addresses: walletAddresses,
            });

            if (apiTransactions.length > 0) {
                for (let i = 0; i < apiTransactions.length; i++) {
                    promises.push(
                        createTransactionFromAPI(
                            apiTransactions[i],
                            walletAddresses,
                        ).then((transaction: Wallet.Transaction) => {
                            transactions.push(transaction);
                        }),
                    );
                }

                await Promise.all(promises);
            }

            return transactions;
        } catch (e) {
            console.error(e);

            return [];
        }
    };
