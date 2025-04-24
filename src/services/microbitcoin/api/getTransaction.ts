import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    txid: string;
};

export default async function (params: Params): Promise<Wallet.Transaction> {
    try {
        const {
            data: {result, error},
        } = await axios.get(
            `${MICROBITCOIN.apiLink}/wallet/transaction/${params.txid}`,
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
