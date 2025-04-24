import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

export default async function (): Promise<{
    blocks: number;
    mediantime: number;
}> {
    try {
        const {
            data: {result, error},
        } = await axios.get(`${MICROBITCOIN.apiLink}/wallet/info`);

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
