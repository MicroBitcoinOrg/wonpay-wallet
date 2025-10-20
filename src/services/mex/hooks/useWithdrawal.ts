/**
 * MEX React Query Hooks - Withdrawals
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import * as MEX from '../api';
import {mexKeys} from './keys';
import {QueryOptions, MutationOptions} from './types';

/**
 * List withdrawals
 *
 * @param token - Authentication token
 * @param pagination - Pagination parameters
 * @param options - React Query options
 *
 * @example
 * ```tsx
 * const { data: withdrawals } = useWithdrawals(token, { page: 1 });
 * ```
 */
export function useWithdrawals(
    token: string | null,
    pagination?: MEX.PaginationParams,
    options?: QueryOptions<MEX.WithdrawalListResponse>,
) {
    return useQuery({
        queryKey: token ? mexKeys.withdrawals.list(token, pagination) : [],
        queryFn: () => MEX.listWithdrawals(token!, pagination),
        enabled: !!token,
        ...options,
    });
}

/**
 * Create withdrawal mutation
 *
 * @param token - Authentication token
 * @param options - Mutation options
 *
 * @example
 * ```tsx
 * const createWithdrawal = useCreateWithdrawal(token);
 *
 * await createWithdrawal.mutateAsync({
 *   currency: 'MBC',
 *   network: 'MBC',
 *   amount: 100,
 *   address: 'M8T1B...'
 * });
 * ```
 */
export function useCreateWithdrawal(
    token: string,
    options?: MutationOptions<MEX.WithdrawalResponse, MEX.WithdrawalArgs>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (args: MEX.WithdrawalArgs) =>
            MEX.createWithdrawal(token, args),
        onSuccess: () => {
            // Invalidate withdrawals and balances
            queryClient.invalidateQueries({
                queryKey: mexKeys.withdrawals.all(),
            });
            queryClient.invalidateQueries({queryKey: mexKeys.finance.all()});
        },
        ...options,
    });
}
