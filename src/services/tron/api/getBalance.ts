import {CHAINS} from '../../../utils/constants';

export const getAddressTokens = async (address: string) => {
    const res = await fetch(
        `${CHAINS.tron.links.tronscanApi.url}/api/account/tokens/v2?address=${address}&start=0&limit=50&hidden=1&show=0&showAvailable=0`,
    );
    const data = await res.json();
    return data?.data || [];
};
