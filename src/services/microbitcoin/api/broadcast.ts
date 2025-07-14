import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    raw: string;
};

export async function broadcast(params: Params): Promise<string> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.api.url}/wallet/broadcast`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raw: params.raw,
                }),
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error({error: errorData});
            throw new Error(
                errorData.error.message ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const {result, error} = await response.json();

        if (result === null && error) {
            console.error({error});
            throw Error(error.message);
        }

        return result;
    } catch (e: unknown) {
        throw e;
    }
}
