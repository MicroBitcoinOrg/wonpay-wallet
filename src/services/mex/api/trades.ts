/**
 * MEX API - Trades Endpoints
 */

import {get, post} from './client';
import {
    CreateTradeParams,
    CryptoTradeResponse,
    CryptoTradeResponsePagination,
    GetTradeInfoParams,
    GetTradesParams,
    PaginationParams,
} from './types';

/**
 * Create trade
 *
 * Creates a new trade on a specific offer.
 *
 * @param authToken - Authentication token
 * @param params - Trade creation parameters
 * @returns Created trade details
 *
 * @example
 * ```ts
 * const trade = await createTrade(token, {
 *   reference: 'offer_abc123',
 *   data: { amount: 50 }
 * });
 * console.log(`Trade created: ${trade.reference}`);
 * ```
 */
export async function createTrade(
    authToken: string,
    params: CreateTradeParams,
): Promise<CryptoTradeResponse> {
    const {reference, data} = params;
    return post<CryptoTradeResponse>(
        `/trades/create/${reference}`,
        data,
        authToken,
    );
}

/**
 * Get trade information
 *
 * Retrieves detailed information about a specific trade.
 *
 * @param authToken - Authentication token
 * @param params - Request parameters
 * @returns Trade details
 *
 * @example
 * ```ts
 * const trade = await getTradeInfo(token, {
 *   trade_reference: 'trade_xyz789'
 * });
 * console.log(`Status: ${trade.status}, Amount: ${trade.amount}`);
 * ```
 */
export async function getTradeInfo(
    authToken: string,
    params: GetTradeInfoParams,
): Promise<CryptoTradeResponse> {
    const {trade_reference} = params;
    return get<CryptoTradeResponse>(
        `/trades/${trade_reference}/info`,
        authToken,
    );
}

/**
 * Get trade list
 *
 * Retrieves all user trades.
 *
 * @param authToken - Authentication token
 * @param pagination - Pagination parameters
 * @returns Paginated list of outgoing trades
 *
 * @example
 * ```ts
 * const trades = await getTrades(token, { direction: 'any' }, { page: 1 });
 * console.log(`You have ${trades.pagination.total} trades`);
 * ```
 */
export async function getTrades(
    authToken: string,
    params: GetTradesParams,
    pagination?: PaginationParams,
): Promise<CryptoTradeResponsePagination> {
    return post<CryptoTradeResponsePagination>(
        '/trades/list',
        params,
        authToken,
        pagination || {},
    );
}

/**
 * Get outgoing trades
 *
 * Retrieves all trades where the authenticated user is the buyer/seller.
 *
 * @param authToken - Authentication token
 * @param pagination - Pagination parameters
 * @returns Paginated list of outgoing trades
 *
 * @example
 * ```ts
 * const trades = await getOutgoingTrades(token, { page: 1 });
 * console.log(`You have ${trades.pagination.total} outgoing trades`);
 * ```
 */
export async function getOutgoingTrades(
    authToken: string,
    pagination?: PaginationParams,
): Promise<CryptoTradeResponsePagination> {
    return post<CryptoTradeResponsePagination>(
        '/trades/outgoing',
        {},
        authToken,
        pagination || {},
    );
}

/**
 * Get incoming trades
 *
 * Retrieves all trades on the authenticated user's offers.
 *
 * @param authToken - Authentication token
 * @param pagination - Pagination parameters
 * @returns Paginated list of incoming trades
 *
 * @example
 * ```ts
 * const trades = await getIncomingTrades(token, { page: 1 });
 * console.log(`You have ${trades.pagination.total} incoming trades`);
 * ```
 */
export async function getIncomingTrades(
    authToken: string,
    pagination?: PaginationParams,
): Promise<CryptoTradeResponsePagination> {
    return post<CryptoTradeResponsePagination>(
        '/trades/incoming',
        {},
        authToken,
        pagination || {},
    );
}
