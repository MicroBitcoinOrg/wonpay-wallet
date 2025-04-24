import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    address: string;
    amount?: number;
    token?: string;
};

export default async function (params: Params): Promise<MBC.UTXO[]> {
    try {
        const {
            data: {result, error},
        } = await axios.get(
            `${MICROBITCOIN.apiLink}/wallet/unspent/${params.address}`,
            {
                params,
            },
        );

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
