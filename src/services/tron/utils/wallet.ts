import {Wallet} from '@/types/Wallet';
import {generateAddressesAsync} from '@/utils/address';
import {encryptData} from '@/utils/common';
import {CHAINS} from '@/utils/constants';

export const createWalletChain =
    (externalData: {password: string}) =>
    async ({
        seedPhrase,
        offset = 20,
        type = 'create',
    }: {
        seedPhrase: string;
        offset?: number;
        type: 'create' | 'import';
    }): Promise<Wallet.WalletChain> => {
        try {
            let addresses = await generateAddressesAsync({
                seedPhrase,
                startIndex: 0,
                endIndex: 0,
                derive: 0,
                networkAddress: CHAINS.tron.network,
                derivePath: CHAINS.tron.derivationPath!,
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
                transactions: [],
                addresses,
                depositAddress: addresses[0].address,
                balances: [
                    {
                        balance: 0,
                        currency: CHAINS.tron.currency!,
                        main: true,
                    },
                ],
            };
        } catch (e) {
            throw e;
        }
    };
