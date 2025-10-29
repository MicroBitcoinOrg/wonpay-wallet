import {TRON} from '@/utils/constants';

export type TRXTransaction = {
    amount: number;
    block: number;
    block_timestamp: number;
    cheatStatus: boolean;
    confirmed: number;
    contractType: number;
    contract_ret: string;
    contract_type: string;
    decimals: number;
    direction: number;
    from: string;
    hash: string;
    issue_address: string;
    revert: number;
    symbol: string;
    to: string;
    token_name: string;
};

export type TRC20Transaction = {
    amount: string;
    approval_amount: string;
    block: number;
    block_timestamp: number;
    confirmed: number;
    contractType: number;
    contract_ret: string;
    contract_type: string;
    decimals: number;
    direction: number;
    event_type: string;
    from: string;
    hash: string;
    id: string;
    issue_address: string;
    revert: number;
    status: number;
    to: string;
    token_name: string;
};

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
