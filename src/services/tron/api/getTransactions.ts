import {TRON} from '../../../utils/constants';

export const fetchTrxTransfers = async (address: string) => {
    const url = `${TRON.links.tronscanApi.url}/api/new/trx/transfer`;
    const params = new URLSearchParams({
        sort: '-timestamp',
        count: 'true',
        limit: '50',
        start: '0',
        address: address,
        filterTokenValue: '0',
    });

    const res = await fetch(`${url}?${params}`);
    return res.json();
};

export const fetchTrc20Transfers = async (
    address: string,
    contractAddress: string,
) => {
    const url = `${TRON.links.tronscanApi.url}/api/new/filter/trc20/transfers`;
    const params = new URLSearchParams({
        limit: '50',
        start: '0',
        sort: '-timestamp',
        count: 'true',
        filterTokenValue: '0',
        relatedAddress: address,
        tokens: contractAddress,
    });

    const res = await fetch(`${url}?${params}`);
    return res.json();
};

export const hasTransactions = async (address: string): Promise<boolean> => {
    const url = `${TRON.links.tronscanApi.url}/api/transaction`;
    const params = new URLSearchParams({
        count: 'true',
        limit: '1',
        start: '0',
        address: address,
    });
    const res = await fetch(`${url}?${params}`);
    const data = await res.json();
    return data.total > 0;
};
