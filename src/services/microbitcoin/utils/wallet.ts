import {Wallet} from '../../../types/Wallet';
import {generateAddressesAsync} from '../../../utils/address';
import {encryptData} from '../../../utils/common';
import {checkAddresses} from '../api';
import {v4 as uuidv4} from 'uuid';

const findAddresses = async ({
    seedPhrase,
    walletChain,
    offset = 20,
}: {
    seedPhrase: string;
    walletChain: Wallet.Chain;
    offset: number;
}) => {
    let addressesWithHistory: Wallet.Address[] = [];
    let synced = false;
    const searchRange = [0, offset];

    while (!synced) {
        const addresses = await generateAddressesAsync({
            seedPhrase,
            startIndex: searchRange[0],
            endIndex: searchRange[1],
            derive: 0,
            networkAddress: walletChain.network,
            derivePath: walletChain.derivationPath,
        });
        addressesWithHistory = [...addressesWithHistory, addresses[0]];

        const filteredAddresses = await checkAddresses({addresses});

        if (filteredAddresses.length > 0) {
            addressesWithHistory = [
                ...addressesWithHistory,
                ...addresses.filter(address =>
                    filteredAddresses.includes(address.address),
                ),
            ];
            searchRange[0] += offset;
            searchRange[1] += offset;
        } else {
            synced = true;
        }
    }

    return [...new Set(addressesWithHistory)];
};

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
            let addresses =
                type === 'create'
                    ? await generateAddressesAsync({
                          seedPhrase,
                          startIndex: 0,
                          endIndex: 1,
                          derive: 0,
                          networkAddress: externalData.walletChain.network,
                          derivePath: externalData.walletChain.derivationPath,
                      })
                    : await findAddresses({
                          seedPhrase,
                          walletChain: externalData.walletChain,
                          offset,
                      });

            addresses = addresses.map(address => {
                return {
                    ...address,
                    wif: encryptData(address.wif, externalData.password),
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
