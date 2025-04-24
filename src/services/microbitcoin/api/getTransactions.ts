import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    addresses: string[];
    currency?: string;
    after?: string | undefined;
    before?: string | undefined;
    count?: number | undefined;
};

export default async function fetch(params: Params) {
    try {
        const {
            data: {result, error},
        } = await axios.post(`${MICROBITCOIN.apiLink}/wallet/history/`, {
            ...params,
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
