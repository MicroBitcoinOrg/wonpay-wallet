import {MICROBITCOIN} from '../../../utils/constants';

export async function getInfo(): Promise<{
    blocks: number;
    mediantime: number;
}> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.api.url}/wallet/info`,
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
