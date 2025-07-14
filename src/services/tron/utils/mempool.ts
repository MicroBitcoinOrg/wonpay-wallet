import {CHAINS} from '../../../utils/constants';

type Mempool = {
    index: number;
    satoshis: number;
    timestamp: number;
    txid: string;
    prevout?: number;
    prevtxid?: string;
};

interface Response {
    tx: Mempool[];
    txcount: number;
}

export const getMempool = async (params: {
    address: string;
}): Promise<Response> => {
    try {
        // TRON doesn't have a traditional mempool like Bitcoin
        // Instead, we get recent transactions and filter for unconfirmed ones
        const res = await fetch(
            `${CHAINS.tron.links.tronscanApi.url}/api/transaction?address=${params.address}&start=0&limit=50&sort=-timestamp&asset=trx`,
        );
        const data = await res.json();

        if (!data || !data.data) {
            // Return empty mempool if no data
            return {
                tx: [],
                txcount: 0,
            };
        }

        const transactions = data.data || [];
        // Filter for unconfirmed transactions (mempool equivalents)
        const pendingTxs: Mempool[] = transactions
            .filter((tx: any) => !tx.confirmed) // Only unconfirmed transactions
            .map((tx: any) => ({
                index: tx.block || 0,
                satoshis: Number(tx.amount || 0),
                timestamp: tx.timestamp || Date.now(),
                txid: tx.hash || '',
                prevout: undefined,
                prevtxid: undefined,
            }));

        return {
            tx: pendingTxs,
            txcount: pendingTxs.length,
        };
    } catch (e) {
        console.error('TRON mempool error:', e);
        // Return empty mempool on error
        return {
            tx: [],
            txcount: 0,
        };
    }
};
