/**
 * MEX API - Offers Endpoints
 */

import {del, get, post, put} from './client';
import {
    CryptoOfferArgs,
    CryptoOfferResponse,
    CryptoOfferResponsePagination,
    CryptoTradeResponsePagination,
    DeleteOfferParams,
    GetOfferInfoParams,
    GetOfferTradesParams,
    OfferEditArgs,
    OfferFilterArgs,
    PaginationParams,
    UpdateOfferParams,
} from './types';

/**
 * List offers
 *
 * Retrieves a paginated list of offers with optional filters.
 *
 * @param filter - Filter criteria
 * @param pagination - Pagination parameters
 * @returns Paginated list of offers
 *
 * @example
 * ```ts
 * const offers = await listOffers({
 *   status: 'pending',
 *   currency: 'MBC',
 *   side: SideEnum.BUY
 * }, { page: 1 });
 * ```
 */
export async function listOffers(
    filter: OfferFilterArgs = {},
    pagination?: PaginationParams,
): Promise<CryptoOfferResponsePagination> {
    return post<CryptoOfferResponsePagination>(
        '/offers',
        filter,
        undefined,
        pagination || {},
    );
}

/**
 * Get offer information
 *
 * Retrieves detailed information about a specific offer.
 *
 * @param params - Request parameters
 * @returns Offer details
 *
 * @example
 * ```ts
 * const offer = await getOfferInfo({ reference: 'abc123' });
 * console.log(`Price: ${offer.price}, Quantity: ${offer.quantity}`);
 * ```
 */
export async function getOfferInfo(
    params: GetOfferInfoParams,
): Promise<CryptoOfferResponse> {
    const {reference} = params;
    return get<CryptoOfferResponse>(`/offers/${reference}`);
}

/**
 * Create offer
 *
 * Creates a new buy or sell offer.
 *
 * @param authToken - Authentication token
 * @param args - Offer creation arguments
 * @returns Created offer details
 *
 * @example
 * ```ts
 * const offer = await createOffer(token, {
 *   currency: 'MBC',
 *   side_currency: 'USD',
 *   side: SideEnum.SELL,
 *   quantity: 100,
 *   price: 0.5,
 *   limit_min: 10,
 *   limit_max: 100,
 *   sns_name: 'Telegram',
 *   sns_id: '@username',
 *   memo: 'Fast trades only'
 * });
 * ```
 */
export async function createOffer(
    authToken: string,
    args: CryptoOfferArgs,
): Promise<CryptoOfferResponse> {
    return post<CryptoOfferResponse>('/offers/create', args, authToken);
}

/**
 * Update offer
 *
 * Updates an existing offer.
 *
 * @param authToken - Authentication token
 * @param params - Update parameters
 * @returns Updated offer details
 *
 * @example
 * ```ts
 * const offer = await updateOffer(token, {
 *   reference: 'abc123',
 *   data: {
 *     quantity: 150,
 *     sns_name: 'Telegram',
 *     sns_id: '@newusername',
 *     memo: 'Updated memo'
 *   }
 * });
 * ```
 */
export async function updateOffer(
    authToken: string,
    params: UpdateOfferParams,
): Promise<CryptoOfferResponse> {
    const {reference, data} = params;
    return put<CryptoOfferResponse>(`/offers/${reference}`, data, authToken);
}

/**
 * Delete offer
 *
 * Deletes (closes) an offer.
 *
 * @param authToken - Authentication token
 * @param params - Delete parameters
 * @returns Deleted offer details
 *
 * @example
 * ```ts
 * const offer = await deleteOffer(token, { reference: 'abc123' });
 * console.log(`Offer ${offer.reference} deleted`);
 * ```
 */
export async function deleteOffer(
    authToken: string,
    params: DeleteOfferParams,
): Promise<CryptoOfferResponse> {
    const {reference} = params;
    return del<CryptoOfferResponse>(`/offers/${reference}`, authToken);
}

/**
 * Get offer trades
 *
 * Retrieves all trades for a specific offer.
 *
 * @param authToken - Authentication token (optional for public offers)
 * @param params - Request parameters
 * @returns Paginated list of trades
 *
 * @example
 * ```ts
 * const trades = await getOfferTrades(token, {
 *   reference: 'abc123',
 *   page: 1
 * });
 * ```
 */
export async function getOfferTrades(
    authToken: string | undefined,
    params: GetOfferTradesParams,
): Promise<CryptoTradeResponsePagination> {
    const {reference, page} = params;
    return get<CryptoTradeResponsePagination>(
        `/offers/${reference}/trades`,
        authToken,
        {page},
    );
}
