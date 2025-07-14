import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {createTransactionFromAPI} from '../utils/transaction';
import {MICROBITCOIN} from '../../../utils/constants';
import {Wallet} from '../../../types/Wallet';

type Params = {
    addresses: Wallet.Address[];
    after?: string | undefined;
    before?: string | undefined;
    count?: number | undefined;
};

async function fetch(params: Params) {
    try {
        const walletAddresses = [
            ...new Set(params.addresses.map((address: any) => address.address)),
        ];

        const {
            data: {result, error},
        } = await axios.post(`${MICROBITCOIN.links.api.url}/wallet/history/`, {
            ...params,
            addresses: walletAddresses,
        });

        if (result === null && error) {
            console.error({error});

            throw Error(error.message);
        }

        const promises = [];
        const transactions: Wallet.Transaction[] = [];

        for (let i = 0; i < result.length; i++) {
            promises.push(
                createTransactionFromAPI(result[i], walletAddresses).then(
                    (transaction: any) => {
                        transactions.push(transaction);
                    },
                ),
            );
        }

        await Promise.all(promises);

        return transactions;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default function (options?: Record<string, any>) {
    return useMutation({mutationFn: fetch, ...options});
}
