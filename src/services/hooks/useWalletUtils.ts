import {useContext} from 'react';
import {PasswordContext} from '../../providers';
import {Wallet} from '../../types/Wallet';
import {createWallet as createMicrobitcoinWallet} from '../microbitcoin/utils/wallet';
import {createWallet as createTronWallet} from '../tron/utils/wallet';
import {CHAINS} from '../../utils/constants';

interface Props {
    chain: Wallet.ChainEnum;
}

const useWalletUtils = ({chain}: Props) => {
    const {unlockedPassword} = useContext(PasswordContext);

    if (!chain)
        return {
            createWallet: () => {
                throw new Error('useWalletUtils: chain is undefined');
            },
        };

    const getWalletUtils = () => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return {
                    createWallet: createMicrobitcoinWallet({
                        walletChain: CHAINS.microbitcoin,
                        password: unlockedPassword!,
                    }),
                };
            case Wallet.ChainEnum.TRON:
                return {
                    createWallet: createTronWallet({
                        walletChain: CHAINS.tron,
                        password: unlockedPassword!,
                    }),
                };
            default:
                throw new Error(`useWalletUtils: unsupported chain: ${chain}`);
        }
    };

    return getWalletUtils();
};

export default useWalletUtils;
