import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    raw: string;
};

export default async function (params: Params): Promise<string> {
    try {
        const {
            data: {result, error},
        } = await axios.post(`${MICROBITCOIN.apiLink}/wallet/broadcast`, {
            raw: params.raw,
        });

        if (result === null && error) {
            console.error({error});

            throw Error(error.message);
        }

        return result;
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            if (e.response) {
                console.error({error: e.response.data});
            }
        }

        throw e;
    }
}
