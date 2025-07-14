import {useContext} from 'react';
import {WalletContext} from '../../providers';
import {getWalletTransactions as getWalletTransactionsTron} from '../tron/utils/transaction';
import {getWalletTransactions as getWalletTransactionsMicrobitcoin} from '../microbitcoin/utils/transaction';
import useAppStore from '../../store/appStore';
import {Wallet} from '../../types/Wallet';
import {CHAINS} from '../../utils/constants';

interface Props {
    chain: Wallet.ChainEnum;
}

const useTransactionUtils = ({chain}: Props) => {
    const {wallet} = useContext(WalletContext);
    const store = useAppStore();

    const getTransactionUtils = () => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return {
                    getWalletTransactions: getWalletTransactionsMicrobitcoin({
                        wallet: wallet!,
                    }),
                };
            case Wallet.ChainEnum.TRON:
                return {
                    getWalletTransactions: getWalletTransactionsTron({
                        wallet: wallet!,
                    }),
                };
            default:
                return {
                    getWalletTransactions: getWalletTransactionsMicrobitcoin({
                        wallet: wallet!,
                    }),
                };
        }
    };

    const utils = getTransactionUtils();

    const updateTransactions = async (data: {currency: Wallet.Currency}) => {
        try {
            const apiTransactions = await utils.getWalletTransactions({
                currency: data.currency,
            });

            let transactions: Wallet.Transaction[] =
                data.currency.ticker === CHAINS[chain].currency!.ticker
                    ? [...wallet!.transactions]
                    : [];

            if (apiTransactions.length > 0) {
                transactions = [...apiTransactions, ...transactions]
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

                if (data.currency.ticker === CHAINS[chain].currency!.ticker) {
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

export default useTransactionUtils;
