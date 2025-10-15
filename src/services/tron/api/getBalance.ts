import {TRON} from '../../../utils/constants';

export const getAddressTokens = async (address: string) => {
    const url = `${TRON.links.tronscanApi.url}/account/wallet`;
    const params = new URLSearchParams({
        asset_type: '1',
        address: address,
    });

    const res = await fetch(`${url}?${params}`);

    return res.json();
};
