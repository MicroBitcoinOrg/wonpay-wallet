import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    addresses: string[];
    currency?: string;
    after?: string | undefined;
    before?: string | undefined;
    count?: number | undefined;
};

export default async function getTransactions(params: Params): Promise<any[]> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.api.url}/wallet/history/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
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
