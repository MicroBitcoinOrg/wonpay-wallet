import {useContext} from 'react';
import {PasswordContext, WalletContext} from '@/providers';
import {sendTransaction as sendTransactionMicrobitcoin} from '@/services/microbitcoin/utils/withdrawal';
import {sendTransaction as sendTransactionTron} from '@/services/tron/utils/withdrawal';
import {Wallet} from '@/types/Wallet';

interface Props {
    chain: Wallet.ChainEnum;
}

const useWithdrawalUtils = ({chain}: Props) => {
    const {wallet} = useContext(WalletContext);
    const {unlockedPassword} = useContext(PasswordContext);

    const getWithdrawalUtils = () => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return {
                    sendTransaction: sendTransactionMicrobitcoin({
                        wallet: wallet!,
                        password: unlockedPassword!,
                    }),
                };
            case Wallet.ChainEnum.TRON:
                return {
                    sendTransaction: sendTransactionTron({
                        wallet: wallet!,
                        password: unlockedPassword!,
                    }),
                };
            default:
                throw new Error(
                    `useWithdrawalUtils: unsupported chain: ${chain}`,
                );
        }
    };

    return getWithdrawalUtils();
};

export default useWithdrawalUtils;
