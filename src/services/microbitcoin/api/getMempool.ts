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
        const response = await fetch(
            `${MICROBITCOIN.links.api.url}/mempool/${params.address}`,
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {result, error} = await response.json();

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
