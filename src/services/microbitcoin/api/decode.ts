import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    raw: string;
};

export default async function (params: Params): Promise<any> {
    try {
        const {
            data: {result, error},
        } = await axios.post(`${MICROBITCOIN.apiLink}/wallet/decode`, {
            raw: params.raw,
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
