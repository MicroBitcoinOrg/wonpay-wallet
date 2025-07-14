import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';
import {Wallet} from '../../../types/Wallet';

type Params = {
    addresses: Wallet.Address[];
};

export default async function (params: Params): Promise<string[]> {
    try {
        const {
            data: {result, error},
        } = await axios.post(`${MICROBITCOIN.links.api.url}/wallet/check`, {
            addresses: params.addresses.map(a => a.address),
        });

        if (result === null && error) {
            console.error({error});

            throw Error(error.message);
        }

        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
