/**
 * MEX React Query Hooks - Finance Operations
 */

import {useQuery} from '@tanstack/react-query';
import * as MEX from '../api';
import {mexKeys} from './keys';
import {QueryOptions} from './types';

/**
 * Get deposit addresses
 *
 * @param token - Authentication token
 * @param options - React Query options
 *
 * @example
 * ```tsx
 * const { data: addresses } = useAddresses(token);
 * ```
 */
export function useAddresses(
    token: string | null,
    options?: QueryOptions<MEX.AddressResponse[]>,
) {
    return useQuery({
        queryKey: token ? mexKeys.finance.addresses(token) : [],
        queryFn: () => MEX.getAddresses(token!),
        enabled: !!token,
        ...options,
    });
}

/**
 * Get balances
 *
 * @param token - Authentication token
 * @param options - React Query options
 *
 * @example
 * ```tsx
 * const { data: balances } = useBalances(token);
 * ```
 */
export function useBalances(
    token: string | null,
    options?: QueryOptions<MEX.BalanceResponse[]>,
) {
    return useQuery({
        queryKey: token ? mexKeys.finance.balances(token) : [],
        queryFn: () => MEX.getBalances(token!),
        enabled: !!token,
        ...options,
    });
}

/**
 * Get transaction history
 *
 * @param token - Authentication token
 * @param args - Filter arguments
 * @param pagination - Pagination parameters
 * @param options - React Query options
 *
 * @example
 * ```tsx
 * const { data: history } = useHistory(token, {
 *   categories: ['trade_completed']
 * }, { page: 1 });
 * ```
 */
export function useHistory(
    token: string | null,
    args: MEX.HistoryListArgs = {},
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.HistoryListResponse>,
) {
    return useQuery({
        queryKey: token ? mexKeys.finance.history(token, args, pagination) : [],
        queryFn: () => MEX.getHistory(token!, args, pagination),
        enabled: !!token,
        ...options,
    });
}
