import {MICROBITCOIN} from '../../../utils/constants';
import {Wallet} from '../../../types/Wallet';

type Params = {
    txid: string;
};

export default async function (params: Params): Promise<Wallet.Transaction> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.api.url}/wallet/transaction/${params.txid}`,
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
