import {Wallet} from '../../../types/Wallet';
import {generateAddressesAsync} from '../../../utils/address';
import {encryptData} from '../../../utils/common';
import {CHAINS} from '../../../utils/constants';
import {checkAddresses} from '../api';
import {v4 as uuidv4} from 'uuid';

const findAddresses = async ({
    seedPhrase,
    offset = 20,
}: {
    seedPhrase: string;
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
            networkAddress: CHAINS.microbitcoin.network,
            derivePath: CHAINS.microbitcoin.derivationPath!,
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
            let addresses =
                type === 'create'
                    ? await generateAddressesAsync({
                          seedPhrase,
                          startIndex: 0,
                          endIndex: 1,
                          derive: 0,
                          networkAddress: CHAINS.microbitcoin.network,
                          derivePath: CHAINS.microbitcoin.derivationPath!,
                      })
                    : await findAddresses({
                          seedPhrase,
                          offset,
                      });

            addresses = addresses.map(address => {
                return {
                    ...address,
                    wif: encryptData(address.wif, externalData.password),
                };
            });

            return {
                transactions: [],
                addresses,
                depositAddress: addresses[0].address,
                balances: [
                    {
                        balance: 0,
                        currency: CHAINS.microbitcoin.currency!,
                        main: true,
                    },
                ],
            };
        } catch (e) {
            throw e;
        }
    };
