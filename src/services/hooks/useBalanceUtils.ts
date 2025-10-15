import {Wallet} from '../../types/Wallet';

import {getBalance as getMicrobitcoinBalance} from '../microbitcoin/api/getBalance';
import {registerAddress as registerMicrobitcoinAddress} from '../microbitcoin/api/registerAddress';
import {getCurrencyIcon as getMicrobitcoinCurrencyIcon} from '../microbitcoin/utils/balance';
import {
    getBalance as getTronBalance,
    getCurrencyIcon as getTronCurrencyIcon,
} from '../tron/utils/balance';

interface Props {
    chain: Wallet.ChainEnum;
}

const useBalanceUtils = ({chain}: Props) => {
    const getBalanceUtils = () => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return {
                    registerAddress: registerMicrobitcoinAddress,
                    getBalance: getMicrobitcoinBalance,
                    getCurrencyIcon: getMicrobitcoinCurrencyIcon,
                };
            case Wallet.ChainEnum.TRON:
                return {
                    registerAddress: () => null,
                    getBalance: getTronBalance,
                    getCurrencyIcon: getTronCurrencyIcon,
                };
            default:
                throw new Error(`useBalanceUtils: unsupported chain: ${chain}`);
        }
    };

    return getBalanceUtils();
};

export default useBalanceUtils;
