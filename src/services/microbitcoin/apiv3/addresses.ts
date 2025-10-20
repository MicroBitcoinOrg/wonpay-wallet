/**
 * MicroBitcoin API v3 - Address Endpoints
 * Endpoints for querying address-related data
 */

import {get} from './client';
import {
    BalanceResponse,
    GetAddressMempoolParams,
    GetAddressTransactionsParams,
    GetBalancesParams,
    GetUnspentOutputsParams,
    GetUTXOParams,
    PaginatedResponse,
    OutputResponse,
    TransactionResponse,
} from './types';

/**
 * Get unspent outputs for an address
 *
 * Retrieves all unspent transaction outputs (UTXOs) for a given address and currency.
 *
 * @param params - Request parameters
 * @returns Paginated list of unspent outputs
 *
 * @example
 * ```ts
 * const outputs = await getUnspentOutputs({
 *   address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe',
 *   currency: 'MBC',
 *   page: 1
 * });
 * ```
 */
export async function getUnspentOutputs(
    params: GetUnspentOutputsParams,
): Promise<PaginatedResponse<OutputResponse>> {
    const {address, currency, page} = params;
    return get<PaginatedResponse<OutputResponse>>(
        `/address/${address}/outputs/${currency}`,
        {page},
    );
}

/**
 * Get UTXO for a specified amount
 *
 * Retrieves UTXOs that can cover a specific amount for a given address and currency.
 * This is useful for transaction building where you need to select inputs to cover a payment.
 *
 * @param params - Request parameters
 * @returns Paginated list of outputs that can cover the amount
 *
 * @example
 * ```ts
 * const utxos = await getUTXO({
 *   address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe',
 *   currency: 'MBC',
 *   amount: 1000000,
 *   page: 1
 * });
 * ```
 */
export async function getUTXO(
    params: GetUTXOParams,
): Promise<PaginatedResponse<OutputResponse>> {
    const {address, currency, amount, page} = params;
    return get<PaginatedResponse<OutputResponse>>(
        `/address/${address}/utxo/${currency}`,
        {amount, page},
    );
}

/**
 * Get transactions for an address
 *
 * Retrieves all transactions associated with a given address, including both
 * sent and received transactions.
 *
 * @param params - Request parameters
 * @returns Paginated list of transactions
 *
 * @example
 * ```ts
 * const transactions = await getAddressTransactions({
 *   address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe',
 *   page: 1
 * });
 * ```
 */
export async function getAddressTransactions(
    params: GetAddressTransactionsParams,
): Promise<PaginatedResponse<TransactionResponse>> {
    const {address, page} = params;
    return get<PaginatedResponse<TransactionResponse>>(
        `/address/${address}/transactions`,
        {page},
    );
}

/**
 * List mempool transactions by destination address
 *
 * Retrieves all unconfirmed transactions in the mempool that are destined
 * for the given address.
 *
 * @param params - Request parameters
 * @returns Array of unconfirmed transactions
 *
 * @example
 * ```ts
 * const mempoolTxs = await getAddressMempool({
 *   address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe'
 * });
 * ```
 */
export async function getAddressMempool(
    params: GetAddressMempoolParams,
): Promise<TransactionResponse[]> {
    const {address} = params;
    return get<TransactionResponse[]>(`/address/${address}/mempool`);
}

/**
 * Get balances for an address
 *
 * Retrieves all balances (MBC and tokens) for a given address.
 *
 * @param params - Request parameters
 * @returns Array of balance information for each currency
 *
 * @example
 * ```ts
 * const balances = await getBalances({
 *   address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe'
 * });
 * // Returns: [
 * //   { currency: 'MBC', units: 4, balance: 1000000 },
 * //   { currency: 'DOGE', units: 8, balance: 5000000 }
 * // ]
 * ```
 */
export async function getBalances(
    params: GetBalancesParams,
): Promise<BalanceResponse[]> {
    const {address} = params;
    return get<BalanceResponse[]>(`/address/${address}/balances`);
}
