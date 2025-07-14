import {MICROBITCOIN} from '../../../utils/constants';
import {Wallet} from '../../../types/Wallet';

type Params = {
    addresses: Wallet.Address[];
};

export default async function (params: Params): Promise<string[]> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.api.url}/wallet/check`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    addresses: params.addresses.map(a => a.address),
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
