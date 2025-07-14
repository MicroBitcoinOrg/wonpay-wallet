import {Wallet} from '../../../types/Wallet';
import {generateAddressesAsync} from '../../../utils/address';
import {encryptData} from '../../../utils/common';
import {v4 as uuidv4} from 'uuid';

export const createWallet =
    (externalData: {walletChain: Wallet.Chain; password: string}) =>
    async ({
        seedPhrase,
        title,
        offset = 20,
        type = 'create',
    }: {
        seedPhrase: string;
        title: string;
        offset: number;
        type: 'create' | 'import';
    }): Promise<Wallet.Wallet> => {
        try {
            let addresses = await generateAddressesAsync({
                seedPhrase,
                startIndex: 0,
                endIndex: 0,
                derive: 0,
                networkAddress: externalData.walletChain.network,
                derivePath: externalData.walletChain.derivationPath,
            });

            addresses = addresses.map(address => {
                return {
                    ...address,
                    wif: encryptData(address.wif, externalData.password),
                    privateKey: encryptData(
                        address.privateKey,
                        externalData.password,
                    ),
                };
            });

            return {
                title,
                transactions: [],
                createdAt: Date.now(),
                chain: externalData.walletChain.key,
                uuid: uuidv4(),
                seedPhrase: encryptData(seedPhrase, externalData.password),
                addresses,
                depositAddress: addresses[0].address,
                balances: [
                    {
                        balance: 0,
                        currency: externalData.walletChain.currency,
                        main: true,
                    },
                ],
            };
        } catch (e) {
            throw e;
        }
    };
