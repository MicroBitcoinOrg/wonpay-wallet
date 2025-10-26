import {useContext} from 'react';
import {PasswordContext} from '../../providers';
import {Wallet} from '../../types/Wallet';
import {createWalletChain as createMicrobitcoinWalletChain} from '../microbitcoin/utils/wallet';
import {createWalletChain as createTronWalletChain} from '../tron/utils/wallet';
import {v4 as uuidv4} from 'uuid';
import {encryptData} from '../../utils/common';

type CreateWalletArgs = {
    seedPhrase: string;
    title: string;
    type: 'create' | 'import';
    offset?: number;
};

const useWalletUtils = () => {
    const {unlockedPassword} = useContext(PasswordContext);

    const createWalletChain = (chain: Wallet.ChainEnum) => {
        switch (chain) {
            case Wallet.ChainEnum.MICROBITCOIN:
                return createMicrobitcoinWalletChain({
                    password: unlockedPassword!,
                });
            case Wallet.ChainEnum.TRON:
                return createTronWalletChain({
                    password: unlockedPassword!,
                });
            default:
                throw new Error(`useWalletUtils: unsupported chain: ${chain}`);
        }
    };

    const createWallet = async ({
        seedPhrase,
        title,
        type,
        offset = 20,
    }: CreateWalletArgs): Promise<Wallet.Wallet> => {
        const microbitcoinWalletChain = await createWalletChain(
            Wallet.ChainEnum.MICROBITCOIN,
        )({type, seedPhrase, offset});
        const tronWalletChain = await createWalletChain(Wallet.ChainEnum.TRON)({
            type,
            seedPhrase,
            offset,
        });

        return {
            title,
            createdAt: Date.now(),
            activeChain: Wallet.ChainEnum.MICROBITCOIN,
            uuid: uuidv4(),
            seedPhrase: encryptData(seedPhrase, unlockedPassword!),
            chains: {
                [Wallet.ChainEnum.MICROBITCOIN]: microbitcoinWalletChain,
                [Wallet.ChainEnum.TRON]: tronWalletChain,
            },
        };
    };

    return {createWalletChain, createWallet};
};

export default useWalletUtils;
