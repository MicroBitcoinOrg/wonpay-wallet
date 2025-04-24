import {useContext} from 'react';
import {PasswordContext, WalletContext} from '../../providers';
import {
    sendTokenTransaction,
    sendTransaction,
} from '../microbitcoin/utils/withdrawal';

interface Props {
    chain: Wallet.ChainKey;
}

const useWithdrawal = ({chain}: Props) => {
    const {wallet} = useContext(WalletContext);
    const {unlockedPassword} = useContext(PasswordContext);

    const getWithdrawal = () => {
        switch (chain) {
            case 'microbitcoin':
                return {
                    sendTransaction: sendTransaction({
                        wallet: wallet!,
                        password: unlockedPassword!,
                    }),
                    sendTokenTransaction: sendTokenTransaction({
                        wallet: wallet!,
                        password: unlockedPassword!,
                    }),
                };
            default:
                return {
                    sendTransaction: sendTransaction({
                        wallet: wallet!,
                        password: unlockedPassword!,
                    }),
                    sendTokenTransaction: sendTokenTransaction({
                        wallet: wallet!,
                        password: unlockedPassword!,
                    }),
                };
        }
    };

    return getWithdrawal();
};

export default useWithdrawal;
