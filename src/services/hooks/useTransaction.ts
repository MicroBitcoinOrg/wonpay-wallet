import {useContext} from 'react';
import {WalletContext} from '../../providers';

import {
    getWalletTokenTransactions,
    getWalletTransactions,
} from '../microbitcoin/utils/transaction';
import useAppStore from '../../store/appStore';

interface Props {
    chain: Wallet.ChainKey;
}

const useTransaction = ({chain}: Props) => {
    const {wallet} = useContext(WalletContext);
    const store = useAppStore();

    const getUtils = () => {
        switch (chain) {
            case 'microbitcoin':
                return {
                    getWalletTokenTransactions: getWalletTokenTransactions({
                        wallet: wallet!,
                    }),
                    getWalletTransactions: getWalletTransactions({
                        wallet: wallet!,
                    }),
                };
            default:
                return {
                    getWalletTokenTransactions: getWalletTokenTransactions({
                        wallet: wallet!,
                    }),
                    getWalletTransactions: getWalletTransactions({
                        wallet: wallet!,
                    }),
                };
        }
    };

    const utils = getUtils();

    const updateTransactions = async (currency?: string) => {
        try {
            const mainTransactions = !currency
                ? await utils.getWalletTransactions()
                : [];
            const tokenTransactions = currency
                ? await utils.getWalletTokenTransactions(currency)
                : [];

            let transactions: Wallet.Transaction[] = !currency
                ? [...wallet!.transactions]
                : [];

            if (mainTransactions.length > 0 || tokenTransactions.length > 0) {
                transactions = [
                    ...tokenTransactions,
                    ...mainTransactions,
                    ...transactions,
                ]
                    .filter(
                        (transaction, index, self) =>
                            index ===
                            self.findIndex(t => t.hash === transaction.hash),
                    )
                    .filter(t => t.amount !== 0 && t.amount - t.fee > 0)
                    .sort(function (a, b) {
                        const keyA = new Date(a.time * 1000);
                        const keyB = new Date(b.time * 1000);

                        if (keyA > keyB) return -1;
                        if (keyA < keyB) return 1;
                        return 0;
                    });

                if (!currency) {
                    store.updateWallet(store.uuid!, {
                        transactions: transactions.slice(0, 100),
                    });
                }
            }

            return transactions;
        } catch (e) {
            console.error(e);

            return wallet!.transactions;
        }
    };

    return {updateTransactions};
};

export default useTransaction;
