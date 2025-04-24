import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

type Mempool = {
    index: number;
    satoshis: number;
    timestamp: number;
    txid: string;
    prevout?: number;
    prevtxid?: string;
};

interface Response {
    tx: Mempool[];
    txcount: number;
}

export default async function (params: {address: string}): Promise<Response> {
    try {
        const {
            data: {result, error},
        } = await axios.get(
            `${MICROBITCOIN.apiLink}/mempool/${params.address}`,
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
