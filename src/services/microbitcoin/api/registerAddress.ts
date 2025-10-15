import {MICROBITCOIN} from '../../../utils/constants';

interface Params {
    address: string;
    service: 'wonpay' | 'web-wallet';
}

export async function registerAddress({address, service}: Params): Promise<{
    success: boolean;
}> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.statsApi.url}/address/${service}/${address}`,
            {
                method: 'POST',
            },
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log(result);

        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
