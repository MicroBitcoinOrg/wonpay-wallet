import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    outputs: MBC.UTXO[];
};

export async function checkUTXO(params: Params): Promise<MBC.UTXO[]> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.api.url}/wallet/utxo`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    outputs: params.outputs,
                }),
            },
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
