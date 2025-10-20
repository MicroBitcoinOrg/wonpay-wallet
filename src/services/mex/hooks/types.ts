/**
 * MEX React Query Hooks - Common Types
 */

import {UseQueryOptions, UseMutationOptions} from '@tanstack/react-query';
import {CryptoOfferResponse, MexApiError} from '../api';

/**
 * Common query options type
 */
export type QueryOptions<TData, TError = MexApiError> = Omit<
    UseQueryOptions<TData, TError>,
    'queryKey' | 'queryFn'
>;

/**
 * Common mutation options type
 */
export type MutationOptions<TData, TVariables, TError = MexApiError> = Omit<
    UseMutationOptions<TData, TError, TVariables>,
    'mutationFn'
>;

/**
 * Authentication context
 */
export interface AuthContext {
    token: string | null;
}
