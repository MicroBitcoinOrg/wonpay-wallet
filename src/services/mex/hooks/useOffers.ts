/**
 * MEX React Query Hooks - Offers Management
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import * as MEX from '../api';
import {mexKeys} from './keys';
import {QueryOptions, MutationOptions} from './types';

/**
 * List offers with optional filters
 *
 * @example
 * ```tsx
 * const { data: offers } = useOffers({
 *   currency: 'MBC',
 *   side: MEX.SideEnum.SELL
 * }, { page: 1 });
 * ```
 */

export function useOffers(
    filter: MEX.OfferFilterArgs = {},
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.CryptoOfferResponsePagination>,
) {
    return useQuery({
        queryKey: mexKeys.offers.list(filter, pagination),
        queryFn: () => MEX.listOffers(filter, pagination),
        ...options,
    });
}

/**
 * Get offer details
 *
 * @example
 * ```tsx
 * const { data: offer } = useOffer('offer_reference');
 * ```
 */
export function useOffer(
    reference: string | null,
    options?: QueryOptions<MEX.CryptoOfferResponse>,
) {
    return useQuery({
        queryKey: reference ? mexKeys.offers.detail(reference) : [],
        queryFn: () => MEX.getOfferInfo({reference: reference!}),
        enabled: !!reference,
        ...options,
    });
}

/**
 * Get offer trades
 *
 * @example
 * ```tsx
 * const { data: trades } = useOfferTrades(token, 'offer_ref', { page: 1 });
 * ```
 */
export function useOfferTrades(
    token: string | null | undefined,
    reference: string | null,
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.CryptoTradeResponsePagination>,
) {
    return useQuery({
        queryKey: reference
            ? mexKeys.offers.trades(reference, token || undefined, pagination)
            : [],
        queryFn: () =>
            MEX.getOfferTrades(token || undefined, {
                reference: reference!,
                ...pagination,
            }),
        enabled: !!reference,
        ...options,
    });
}

/**
 * Create offer mutation
 *
 * @example
 * ```tsx
 * const createOffer = useCreateOffer(token);
 *
 * await createOffer.mutateAsync({
 *   currency: 'MBC',
 *   side_currency: 'USD',
 *   side: MEX.SideEnum.SELL,
 *   // ... other fields
 * });
 * ```
 */
export function useCreateOffer(
    token: string,
    options?: MutationOptions<MEX.CryptoOfferResponse, MEX.CryptoOfferArgs>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (args: MEX.CryptoOfferArgs) => MEX.createOffer(token, args),
        onSuccess: () => {
            // Invalidate offers list
            queryClient.invalidateQueries({queryKey: mexKeys.offers.all()});
            queryClient.invalidateQueries({queryKey: mexKeys.finance.all()});
        },
        ...options,
    });
}

/**
 * Update offer mutation
 *
 * @example
 * ```tsx
 * const updateOffer = useUpdateOffer(token);
 *
 * await updateOffer.mutateAsync({
 *   reference: 'offer_ref',
 *   data: { quantity: 150, ... }
 * });
 * ```
 */
export function useUpdateOffer(
    token: string,
    options?: MutationOptions<MEX.CryptoOfferResponse, MEX.UpdateOfferParams>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: MEX.UpdateOfferParams) =>
            MEX.updateOffer(token, params),
        onSuccess: data => {
            // Invalidate specific offer and list
            queryClient.invalidateQueries({
                queryKey: mexKeys.offers.detail(data.reference),
            });
            queryClient.invalidateQueries({queryKey: mexKeys.offers.all()});
        },
        ...options,
    });
}

/**
 * Delete offer mutation
 *
 * @example
 * ```tsx
 * const deleteOffer = useDeleteOffer(token);
 *
 * await deleteOffer.mutateAsync({ reference: 'offer_ref' });
 * ```
 */
export function useDeleteOffer(
    token: string,
    options?: MutationOptions<MEX.CryptoOfferResponse, MEX.DeleteOfferParams>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: MEX.DeleteOfferParams) =>
            MEX.deleteOffer(token, params),
        onSuccess: data => {
            // Invalidate specific offer and list
            queryClient.invalidateQueries({
                queryKey: mexKeys.offers.detail(data.reference),
            });
            queryClient.invalidateQueries({queryKey: mexKeys.offers.all()});
            queryClient.invalidateQueries({queryKey: mexKeys.finance.all()});
        },
        ...options,
    });
}
