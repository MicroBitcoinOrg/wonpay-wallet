import {Wallet} from '../../types/Wallet';

import {getBalance as getMicrobitcoinBalance} from '../microbitcoin/api/getBalance';
import {getBalance as getTronBalance} from '../tron/utils/balance';

interface Props {
    chain: Wallet.ChainEnum;
}

const useBalanceUtils = ({chain}: Props) => {
    const getBalanceUtils = () => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return {
                    getBalance: getMicrobitcoinBalance,
                };
            case Wallet.ChainEnum.TRON:
                return {
                    getBalance: getTronBalance,
                };
            default:
                throw new Error(`useBalanceUtils: unsupported chain: ${chain}`);
        }
    };

    return getBalanceUtils();
};

export default useBalanceUtils;
