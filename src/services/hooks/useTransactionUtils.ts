import {useContext} from 'react';
import {useWallet, WalletContext} from '@/providers';
import {getWalletTransactions as getWalletTransactionsTron} from '@/services/tron/utils/transaction';
import {getWalletTransactions as getWalletTransactionsMicrobitcoin} from '@/services/microbitcoin/utils/transaction';
import useAppStore from '@/store/appStore';
import {Wallet} from '@/types/Wallet';
import {CHAINS} from '@/utils/constants';

interface Props {
    chain: Wallet.ChainEnum;
}

const useTransactionUtils = ({chain}: Props) => {
    const {wallet, walletChain, chainKey} = useWallet();
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
                throw new Error(
                    `useTransactionUtils: unsupported chain: ${chain}`,
                );
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
                    ? [...walletChain!.transactions]
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
                    store.updateWalletChain(store.uuid!, chainKey!, {
                        transactions: transactions.slice(0, 100),
                    });
                }
            }

            return transactions;
        } catch (e) {
            console.error(e);

            return walletChain!.transactions;
        }
    };

    return {updateTransactions};
};

export default useTransactionUtils;
