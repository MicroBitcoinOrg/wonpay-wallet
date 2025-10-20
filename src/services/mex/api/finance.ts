/**
 * MEX API - Finance Endpoints
 */

import {get, post} from './client';
import {AddressResponse, BalanceResponse, HistoryListArgs, HistoryListResponse, PaginationParams} from './types';

/**
 * Get deposit addresses
 *
 * Retrieves all deposit addresses for the authenticated user.
 *
 * @param authToken - Authentication token
 * @returns Array of address information
 *
 * @example
 * ```ts
 * const addresses = await getAddresses(token);
 * addresses.forEach(addr => {
 *   console.log(`${addr.network}: ${addr.address}`);
 * });
 * ```
 */
export async function getAddresses(
    authToken: string,
): Promise<AddressResponse[]> {
    return get<AddressResponse[]>('/finance/addresses', authToken);
}

/**
 * Get balances
 *
 * Retrieves all balances for the authenticated user.
 *
 * @param authToken - Authentication token
 * @returns Array of balance information
 *
 * @example
 * ```ts
 * const balances = await getBalances(token);
 * balances.forEach(balance => {
 *   console.log(`${balance.currency}: ${balance.balance} (${balance.frozen} frozen)`);
 * });
 * ```
 */
export async function getBalances(
    authToken: string,
): Promise<BalanceResponse[]> {
    return get<BalanceResponse[]>('/finance/balances', authToken);
}

/**
 * Get transaction history
 *
 * Retrieves transaction history for the authenticated user.
 *
 * @param authToken - Authentication token
 * @param args - Filter arguments
 * @param pagination - Pagination parameters
 * @returns Paginated history list
 *
 * @example
 * ```ts
 * const history = await getHistory(token, {
 *   categories: ['trade_completed', 'deposit']
 * }, { page: 1 });
 * ```
 */
export async function getHistory(
    authToken: string,
    args: HistoryListArgs = {},
    pagination?: PaginationParams,
): Promise<HistoryListResponse> {
    return post<HistoryListResponse>(
        '/finance/history',
        args,
        authToken,
        pagination || {},
    );
}
