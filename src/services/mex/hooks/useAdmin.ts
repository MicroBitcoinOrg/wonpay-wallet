/**
 * MEX React Query Hooks - Admin Operations
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import * as MEX from '../api';
import {mexKeys} from './keys';
import {QueryOptions, MutationOptions} from './types';

/**
 * List users (Admin)
 *
 * @example
 * ```tsx
 * const { data: users } = useAdminUsers(adminToken, {
 *   username: 'john'
 * }, { page: 1 });
 * ```
 */
export function useAdminUsers(
    token: string | null,
    args: MEX.SearchUserArgs = {},
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.AdminUserListResponse>,
) {
    return useQuery({
        queryKey: token ? mexKeys.admin.users(token, args, pagination) : [],
        queryFn: () => MEX.listUsers(token!, args, pagination),
        enabled: !!token,
        ...options,
    });
}

/**
 * Get user details (Admin)
 *
 * @example
 * ```tsx
 * const { data: user } = useAdminUser(adminToken, 'user_reference');
 * ```
 */
export function useAdminUser(
    token: string | null,
    reference: string | null,
    options?: QueryOptions<MEX.AdminUserResponse>,
) {
    return useQuery({
        queryKey:
            token && reference ? mexKeys.admin.user(token, reference) : [],
        queryFn: () => MEX.getUser(token!, {reference: reference!}),
        enabled: !!token && !!reference,
        ...options,
    });
}

/**
 * Get user balances (Admin)
 *
 * @example
 * ```tsx
 * const { data: balances } = useAdminUserBalances(adminToken, 'user_reference');
 * ```
 */
export function useAdminUserBalances(
    token: string | null,
    reference: string | null,
    options?: QueryOptions<MEX.BalanceResponse[]>,
) {
    return useQuery({
        queryKey:
            token && reference
                ? mexKeys.admin.userBalances(token, reference)
                : [],
        queryFn: () => MEX.getUserBalances(token!, {reference: reference!}),
        enabled: !!token && !!reference,
        ...options,
    });
}

/**
 * List trades (Admin)
 *
 * @example
 * ```tsx
 * const { data: trades } = useAdminTrades(adminToken, {
 *   status: 'completed'
 * }, { page: 1 });
 * ```
 */
export function useAdminTrades(
    token: string | null,
    args: MEX.SearchTradeArgs = {},
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.CryptoTradeResponsePagination>,
) {
    return useQuery({
        queryKey: token ? mexKeys.admin.trades(token, args, pagination) : [],
        queryFn: () => MEX.listTrades(token!, args, pagination),
        enabled: !!token,
        ...options,
    });
}

/**
 * Get trade details (Admin)
 *
 * @example
 * ```tsx
 * const { data: trade } = useAdminTrade(adminToken, 'trade_reference');
 * ```
 */
export function useAdminTrade(
    token: string | null,
    tradeReference: string | null,
    options?: QueryOptions<MEX.CryptoTradeResponse>,
) {
    return useQuery({
        queryKey:
            token && tradeReference
                ? mexKeys.admin.trade(token, tradeReference)
                : [],
        queryFn: () =>
            MEX.getAdminTradeInfo(token!, {trade_reference: tradeReference!}),
        enabled: !!token && !!tradeReference,
        ...options,
    });
}

/**
 * Get admin history
 *
 * @example
 * ```tsx
 * const { data: history } = useAdminHistory(adminToken, {
 *   category: MEX.HistoryCategoryEnum.TRADE_COMPLETED
 * }, { page: 1 });
 * ```
 */
export function useAdminHistory(
    token: string | null,
    args: MEX.SearchHistoryArgs = {},
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.HistoryListResponse>,
) {
    return useQuery({
        queryKey: token ? mexKeys.admin.history(token, args, pagination) : [],
        queryFn: () => MEX.getAdminHistory(token!, args, pagination),
        enabled: !!token,
        ...options,
    });
}

/**
 * Get flow stats (Admin)
 *
 * @example
 * ```tsx
 * const { data: stats } = useFlowStats(adminToken);
 * ```
 */
export function useFlowStats(
    token: string | null,
    options?: QueryOptions<MEX.FlowStatsResponse[]>,
) {
    return useQuery({
        queryKey: token ? mexKeys.admin.flowStats(token) : [],
        queryFn: () => MEX.getFlowStats(token!),
        enabled: !!token,
        ...options,
    });
}

/**
 * Ban user mutation (Admin)
 *
 * @example
 * ```tsx
 * const banUser = useBanUser(adminToken);
 *
 * await banUser.mutateAsync({ reference: 'user_reference' });
 * ```
 */
export function useBanUser(
    token: string,
    options?: MutationOptions<MEX.AdminUserResponse, MEX.BanUserParams>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: MEX.BanUserParams) => MEX.banUser(token, params),
        onSuccess: data => {
            // Invalidate user queries
            queryClient.invalidateQueries({
                queryKey: mexKeys.admin.user(token, data.reference),
            });
            queryClient.invalidateQueries({queryKey: mexKeys.admin.all()});
        },
        ...options,
    });
}

/**
 * Unban user mutation (Admin)
 *
 * @example
 * ```tsx
 * const unbanUser = useUnbanUser(adminToken);
 *
 * await unbanUser.mutateAsync({ reference: 'user_reference' });
 * ```
 */
export function useUnbanUser(
    token: string,
    options?: MutationOptions<MEX.AdminUserResponse, MEX.UnbanUserParams>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: MEX.UnbanUserParams) =>
            MEX.unbanUser(token, params),
        onSuccess: data => {
            // Invalidate user queries
            queryClient.invalidateQueries({
                queryKey: mexKeys.admin.user(token, data.reference),
            });
            queryClient.invalidateQueries({queryKey: mexKeys.admin.all()});
        },
        ...options,
    });
}

/**
 * Close offer mutation (Admin)
 *
 * @example
 * ```tsx
 * const closeOffer = useCloseOffer(adminToken);
 *
 * await closeOffer.mutateAsync({ reference: 'offer_reference' });
 * ```
 */
export function useCloseOffer(
    token: string,
    options?: MutationOptions<MEX.CryptoOfferResponse, MEX.CloseOfferParams>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: MEX.CloseOfferParams) =>
            MEX.closeOffer(token, params),
        onSuccess: data => {
            // Invalidate offer queries
            queryClient.invalidateQueries({
                queryKey: mexKeys.offers.detail(data.reference),
            });
            queryClient.invalidateQueries({queryKey: mexKeys.offers.all()});
        },
        ...options,
    });
}
