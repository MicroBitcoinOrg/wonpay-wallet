import {Wallet} from '@/types/Wallet';

import {getMempool as getMicrobitcoinMempool} from '@/services/microbitcoin/api';

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
                throw new Error(`useMempoolUtils: unsupported chain: ${chain}`);
        }
    };

    return getMempoolUtils();
};

export default useMempoolUtils;
