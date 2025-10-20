/**
 * MicroBitcoin API v3 - Transaction Endpoints
 * Endpoints for querying and broadcasting transactions
 */

import {get, post} from './client';
import {
    BroadcastTransactionParams,
    GetTokenTransactionsParams,
    GetTransactionParams,
    PaginatedResponse,
    TransactionResponse,
} from './types';

/**
 * Get transactions by token
 *
 * Retrieves all transactions for a specific token.
 *
 * @param params - Request parameters
 * @returns Paginated list of transactions
 *
 * @example
 * ```ts
 * const transactions = await getTokenTransactions({
 *   token: 'DOGE',
 *   page: 1
 * });
 * console.log(`Token DOGE has ${transactions.pagination.total} transactions`);
 * ```
 */
export async function getTokenTransactions(
    params: GetTokenTransactionsParams,
): Promise<PaginatedResponse<TransactionResponse>> {
    const {token, page} = params;
    return get<PaginatedResponse<TransactionResponse>>(
        `/transactions/list/${token}`,
        {page},
    );
}

/**
 * Get mempool transactions
 *
 * Retrieves all unconfirmed transactions currently in the mempool.
 *
 * @returns Array of mempool transactions
 *
 * @example
 * ```ts
 * const mempoolTxs = await getMempool();
 * console.log(`There are ${mempoolTxs.length} transactions in the mempool`);
 * ```
 */
export async function getMempool(): Promise<TransactionResponse[]> {
    return get<TransactionResponse[]>('/transactions/mempool');
}

/**
 * Get transaction info
 *
 * Retrieves detailed information about a specific transaction by its ID.
 *
 * @param params - Request parameters
 * @returns Transaction information
 *
 * @example
 * ```ts
 * const tx = await getTransaction({
 *   txid: 'a1b2c3d4e5f6...'
 * });
 * console.log(`Transaction has ${tx.confirmations} confirmations`);
 * console.log(`Fee: ${tx.fee} satoshis`);
 * ```
 */
export async function getTransaction(
    params: GetTransactionParams,
): Promise<TransactionResponse> {
    const {txid} = params;
    return get<TransactionResponse>(`/transactions/${txid}`);
}

/**
 * Broadcast transaction
 *
 * Broadcasts a signed raw transaction to the network.
 *
 * @param params - Request parameters
 * @returns Broadcast response (typically contains txid)
 *
 * @example
 * ```ts
 * const result = await broadcastTransaction({
 *   raw: '0100000001abcdef...'
 * });
 * console.log('Transaction broadcast successfully');
 * ```
 */
export async function broadcastTransaction(
    params: BroadcastTransactionParams,
): Promise<Record<string, unknown>> {
    const {raw} = params;
    return post<Record<string, unknown>>('/transactions/broadcast', {raw});
}

/**
 * Ping endpoint
 *
 * Simple health check endpoint to verify API connectivity.
 *
 * @returns Ping response
 *
 * @example
 * ```ts
 * const response = await ping();
 * console.log('API is reachable');
 * ```
 */
export async function ping(): Promise<Record<string, unknown>> {
    return get<Record<string, unknown>>('/ping');
}
