/**
 * MEX React Query Hooks - Trades Management
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import * as MEX from '../api';
import {mexKeys} from './keys';
import {QueryOptions, MutationOptions} from './types';

/**
 * Get trade details
 *
 * @example
 * ```tsx
 * const { data: trade } = useTrade(token, 'trade_reference');
 * ```
 */
export function useTrade(
    token: string | null,
    tradeReference: string | null,
    options?: QueryOptions<MEX.CryptoTradeResponse>,
) {
    return useQuery({
        queryKey:
            token && tradeReference
                ? mexKeys.trades.detail(tradeReference, token)
                : [],
        queryFn: () =>
            MEX.getTradeInfo(token!, {trade_reference: tradeReference!}),
        enabled: !!token && !!tradeReference,
        ...options,
    });
}

/**
 * Get outgoing trades
 *
 * @example
 * ```tsx
 * const { data: outgoing } = useOutgoingTrades(token, { page: 1 });
 * ```
 */
export function useOutgoingTrades(
    token: string | null,
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.CryptoTradeResponsePagination>,
) {
    return useQuery({
        queryKey: token ? mexKeys.trades.outgoing(token, pagination) : [],
        queryFn: () => MEX.getOutgoingTrades(token!, pagination),
        enabled: !!token,
        ...options,
    });
}

/**
 * Get trades
 *
 * @example
 * ```tsx
 * const { data: trades } = useTrades(token, { direction: 'any' }, { page: 1 });
 * ```
 */
export function useTrades(
    token: string | null,
    params: MEX.GetTradesParams,
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.CryptoTradeResponsePagination>,
) {
    return useQuery({
        queryKey: token ? mexKeys.trades.list(token, params, pagination) : [],
        queryFn: () => MEX.getTrades(token!, params, pagination),
        enabled: !!token,
        ...options,
    });
}

/**
 * Get incoming trades
 *
 * @example
 * ```tsx
 * const { data: incoming } = useIncomingTrades(token, { page: 1 });
 * ```
 */
export function useIncomingTrades(
    token: string | null,
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.CryptoTradeResponsePagination>,
) {
    return useQuery({
        queryKey: token ? mexKeys.trades.incoming(token, pagination) : [],
        queryFn: () => MEX.getIncomingTrades(token!, pagination),
        enabled: !!token,
        ...options,
    });
}

/**
 * Create trade mutation
 *
 * @example
 * ```tsx
 * const createTrade = useCreateTrade(token);
 *
 * await createTrade.mutateAsync({
 *   reference: 'offer_ref',
 *   data: { amount: 50 }
 * });
 * ```
 */
export function useCreateTrade(
    token: string,
    options?: MutationOptions<MEX.CryptoTradeResponse, MEX.CreateTradeParams>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: MEX.CreateTradeParams) =>
            MEX.createTrade(token, params),
        onSuccess: () => {
            // Invalidate trades and related queries
            queryClient.invalidateQueries({queryKey: mexKeys.trades.all()});
            queryClient.invalidateQueries({queryKey: mexKeys.offers.all()});
            queryClient.invalidateQueries({queryKey: mexKeys.finance.all()});
        },
        ...options,
    });
}
