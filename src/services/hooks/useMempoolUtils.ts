import {Wallet} from '../../types/Wallet';

import getMicrobitcoinMempool from '../microbitcoin/api/getMempool';
import {getMempool as getTronMempool} from '../tron/utils/mempool';

interface Props {
    chain: Wallet.ChainEnum;
}

const useMempoolUtils = ({chain}: Props) => {
    const getMempoolUtils = () => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return {
                    getMempool: getMicrobitcoinMempool,
                };
            case Wallet.ChainEnum.TRON:
                return {
                    getMempool: undefined,
                };
            default:
                return {
                    getMempool: getMicrobitcoinMempool,
                };
        }
    };

    return getMempoolUtils();
};

export default useMempoolUtils;
