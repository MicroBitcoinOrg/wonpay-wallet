import {Wallet} from '@/types/Wallet';

import {getBalance as getMicrobitcoinBalance} from '@/services/microbitcoin/api/getBalance';
import {registerAddress as registerMicrobitcoinAddress} from '@/services/microbitcoin/api/registerAddress';
import {getCurrencyIcon as getMicrobitcoinCurrencyIcon} from '@/services/microbitcoin/utils/balance';
import {
    getBalance as getTronBalance,
    getCurrencyIcon as getTronCurrencyIcon,
} from '../tron/utils/balance';

const useBalanceUtils = () => {
    const getCurrencyIcon = (chain: Wallet.ChainEnum) => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return getMicrobitcoinCurrencyIcon;
            case Wallet.ChainEnum.TRON:
                return getTronCurrencyIcon;
            default:
                throw new Error(`useBalanceUtils: unsupported chain: ${chain}`);
        }
    };

    const registerAddress = (chain: Wallet.ChainEnum) => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return registerMicrobitcoinAddress;
            case Wallet.ChainEnum.TRON:
                return () => null;
            default:
                throw new Error(`useBalanceUtils: unsupported chain: ${chain}`);
        }
    };

    const getBalance = (chain: Wallet.ChainEnum) => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return getMicrobitcoinBalance;
            case Wallet.ChainEnum.TRON:
                return getTronBalance;
            default:
                throw new Error(`useBalanceUtils: unsupported chain: ${chain}`);
        }
    };

    return {getCurrencyIcon, registerAddress, getBalance};
};

export default useBalanceUtils;
