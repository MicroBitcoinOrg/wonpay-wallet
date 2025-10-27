import {TRON} from '@/utils/constants';

export const fetchTrxTransfers = async (address: string) => {
    const url = `${TRON.links.tronscanApi.url}/trx/transfers`;
    const params = new URLSearchParams({
        direction: '0',
        limit: '50',
        start: '0',
        address: address,
    });

    const res = await fetch(`${url}?${params}`);

    return res.json();
};

export const fetchTrc20Transfers = async (
    address: string,
    contractAddress: string,
) => {
    const url = `${TRON.links.tronscanApi.url}/trc20/transfers`;
    const params = new URLSearchParams({
        limit: '50',
        start: '0',
        direction: '0',
        address: address,
        trc20Id: contractAddress,
    });

    const res = await fetch(`${url}?${params}`);
    return res.json();
};

export const fetchTrc10Transfers = async (
    address: string,
    contractAddress: string,
) => {
    const url = `${TRON.links.tronscanApi.url}/trc10/transfers`;
    const params = new URLSearchParams({
        limit: '50',
        start: '0',
        direction: '0',
        address: address,
        trc20Id: contractAddress,
    });

    const res = await fetch(`${url}?${params}`);
    return res.json();
};
