import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    address: string;
    amount?: number;
    token?: string;
};

export async function getUTXO(params: Params): Promise<MBC.UTXO[]> {
    try {
        const url = new URL(
            `${MICROBITCOIN.links.api.url}/wallet/unspent/${params.address}`,
        );
        const queryParams: Record<string, string> = {address: params.address};
        if (params.amount) {
            queryParams.amount = params.amount.toString();
        }
        if (params.token) {
            queryParams.token = params.token;
        }
        url.search = new URLSearchParams(queryParams).toString();

        const response = await fetch(url.toString());

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
