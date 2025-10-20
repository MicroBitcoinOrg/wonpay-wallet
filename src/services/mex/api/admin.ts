/**
 * MEX API - Admin Endpoints
 * Administrative functions for managing users, trades, offers, and viewing stats
 */

import {del, get, post} from './client';
import {
    AdminUserListResponse,
    AdminUserResponse,
    BalanceResponse,
    BanUserParams,
    CloseOfferParams,
    CryptoOfferResponse,
    CryptoTradeResponse,
    CryptoTradeResponsePagination,
    FlowStatsResponse,
    GetAdminTradeInfoParams,
    GetUserBalancesParams,
    GetUserParams,
    HistoryListResponse,
    PaginationParams,
    SearchHistoryArgs,
    SearchTradeArgs,
    SearchUserArgs,
    UnbanUserParams,
} from './types';

/**
 * List users (Admin)
 *
 * Searches and lists users with optional filters.
 *
 * @param authToken - Admin authentication token
 * @param args - Search criteria
 * @param pagination - Pagination parameters
 * @returns Paginated list of users
 *
 * @example
 * ```ts
 * const users = await listUsers(adminToken, {
 *   username: 'john',
 *   banned: false
 * }, { page: 1 });
 * ```
 */
export async function listUsers(
    authToken: string,
    args: SearchUserArgs = {},
    pagination?: PaginationParams,
): Promise<AdminUserListResponse> {
    return post<AdminUserListResponse>(
        '/admin/users',
        args,
        authToken,
        pagination || {},
    );
}

/**
 * Get user details (Admin)
 *
 * Retrieves detailed information about a specific user.
 *
 * @param authToken - Admin authentication token
 * @param params - Request parameters
 * @returns User details
 *
 * @example
 * ```ts
 * const user = await getUser(adminToken, {
 *   reference: 'c773d0bf-1c42-4c18-aec8-1bdd8cb0a434'
 * });
 * ```
 */
export async function getUser(
    authToken: string,
    params: GetUserParams,
): Promise<AdminUserResponse> {
    const {reference} = params;
    return get<AdminUserResponse>(`/admin/users/${reference}`, authToken);
}

/**
 * View user balances (Admin)
 *
 * Retrieves all balances for a specific user.
 *
 * @param authToken - Admin authentication token
 * @param params - Request parameters
 * @returns Array of user balances
 *
 * @example
 * ```ts
 * const balances = await getUserBalances(adminToken, {
 *   reference: 'c773d0bf-1c42-4c18-aec8-1bdd8cb0a434'
 * });
 * ```
 */
export async function getUserBalances(
    authToken: string,
    params: GetUserBalancesParams,
): Promise<BalanceResponse[]> {
    const {reference} = params;
    return get<BalanceResponse[]>(
        `/admin/users/${reference}/balances`,
        authToken,
    );
}

/**
 * Ban user (Admin)
 *
 * Bans a user from the platform.
 *
 * @param authToken - Admin authentication token
 * @param params - Request parameters
 * @returns Updated user details
 *
 * @example
 * ```ts
 * const user = await banUser(adminToken, {
 *   reference: 'c773d0bf-1c42-4c18-aec8-1bdd8cb0a434'
 * });
 * console.log(`User banned: ${user.banned}`);
 * ```
 */
export async function banUser(
    authToken: string,
    params: BanUserParams,
): Promise<AdminUserResponse> {
    const {reference} = params;
    return post<AdminUserResponse>(
        `/admin/users/${reference}/ban`,
        {},
        authToken,
    );
}

/**
 * Unban user (Admin)
 *
 * Removes ban from a user.
 *
 * @param authToken - Admin authentication token
 * @param params - Request parameters
 * @returns Updated user details
 *
 * @example
 * ```ts
 * const user = await unbanUser(adminToken, {
 *   reference: 'c773d0bf-1c42-4c18-aec8-1bdd8cb0a434'
 * });
 * console.log(`User unbanned: ${!user.banned}`);
 * ```
 */
export async function unbanUser(
    authToken: string,
    params: UnbanUserParams,
): Promise<AdminUserResponse> {
    const {reference} = params;
    return post<AdminUserResponse>(
        `/admin/users/${reference}/unban`,
        {},
        authToken,
    );
}

/**
 * List trades (Admin)
 *
 * Searches and lists trades with optional filters.
 *
 * @param authToken - Admin authentication token
 * @param args - Search criteria
 * @param pagination - Pagination parameters
 * @returns Paginated list of trades
 *
 * @example
 * ```ts
 * const trades = await listTrades(adminToken, {
 *   status: 'completed',
 *   currency: 'MBC'
 * }, { page: 1 });
 * ```
 */
export async function listTrades(
    authToken: string,
    args: SearchTradeArgs = {},
    pagination?: PaginationParams,
): Promise<CryptoTradeResponsePagination> {
    return post<CryptoTradeResponsePagination>(
        '/admin/trades',
        args,
        authToken,
        pagination || {},
    );
}

/**
 * Get trade details (Admin)
 *
 * Retrieves detailed information about a specific trade.
 *
 * @param authToken - Admin authentication token
 * @param params - Request parameters
 * @returns Trade details
 *
 * @example
 * ```ts
 * const trade = await getAdminTradeInfo(adminToken, {
 *   trade_reference: 'trade_xyz789'
 * });
 * ```
 */
export async function getAdminTradeInfo(
    authToken: string,
    params: GetAdminTradeInfoParams,
): Promise<CryptoTradeResponse> {
    const {trade_reference} = params;
    return get<CryptoTradeResponse>(
        `/admin/trades/${trade_reference}/info`,
        authToken,
    );
}

/**
 * Close offer (Admin)
 *
 * Forcefully closes an offer.
 *
 * @param authToken - Admin authentication token
 * @param params - Request parameters
 * @returns Closed offer details
 *
 * @example
 * ```ts
 * const offer = await closeOffer(adminToken, {
 *   reference: 'offer_abc123'
 * });
 * console.log(`Offer ${offer.reference} closed by admin`);
 * ```
 */
export async function closeOffer(
    authToken: string,
    params: CloseOfferParams,
): Promise<CryptoOfferResponse> {
    const {reference} = params;
    return del<CryptoOfferResponse>(`/admin/offers/${reference}`, authToken);
}

/**
 * Get transaction history (Admin)
 *
 * Retrieves transaction history with advanced filters.
 *
 * @param authToken - Admin authentication token
 * @param args - Search criteria
 * @param pagination - Pagination parameters
 * @returns Paginated history list
 *
 * @example
 * ```ts
 * const history = await getAdminHistory(adminToken, {
 *   category: HistoryCategoryEnum.TRADE_COMPLETED,
 *   status: HistoryStatusEnum.SUCCESS
 * }, { page: 1 });
 * ```
 */
export async function getAdminHistory(
    authToken: string,
    args: SearchHistoryArgs = {},
    pagination?: PaginationParams,
): Promise<HistoryListResponse> {
    return post<HistoryListResponse>(
        '/admin/history',
        args,
        authToken,
        pagination || {},
    );
}

/**
 * Get flow statistics (Admin)
 *
 * Retrieves platform-wide flow statistics showing income and outcome.
 *
 * @param authToken - Admin authentication token
 * @returns Array of flow statistics per currency
 *
 * @example
 * ```ts
 * const stats = await getFlowStats(adminToken);
 * stats.forEach(stat => {
 *   console.log(`${stat.currency}: In=${stat.income}, Out=${stat.outcome}`);
 * });
 * ```
 */
export async function getFlowStats(
    authToken: string,
): Promise<FlowStatsResponse[]> {
    return get<FlowStatsResponse[]>('/admin/stats/flow', authToken);
}
