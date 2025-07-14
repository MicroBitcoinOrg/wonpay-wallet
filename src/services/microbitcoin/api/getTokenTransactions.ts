import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    address: string;
    currency?: string;
};

export async function getTokenTransactions(params: Params) {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.tokensApi!.url}/layer/address/${
                params.address
            }/transfers${params.currency ? `/${params.currency}` : ''}`,
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const {list} = await response.json();

        return list;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
