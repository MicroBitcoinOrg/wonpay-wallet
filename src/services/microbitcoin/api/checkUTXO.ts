import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    outputs: MBC.UTXO[];
};

export default async function (params: Params): Promise<MBC.UTXO[]> {
    try {
        const {
            data: {result, error},
        } = await axios.post(`${MICROBITCOIN.apiLink}/wallet/utxo`, {
            outputs: params.outputs,
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
