import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    raw: string;
};

export default async function (params: Params): Promise<any> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.api.url}/wallet/decode`,
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
