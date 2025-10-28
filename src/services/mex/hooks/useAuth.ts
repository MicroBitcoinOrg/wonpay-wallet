/**
 * MEX React Query Hooks - Authentication
 */

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import * as MEX from '../api';
import {mexKeys} from './keys';
import {QueryOptions, MutationOptions} from './types';

/**
 * Get authentication message
 *
 * @example
 * ```tsx
 * const { data: authMessage } = useAuthMessage();
 * ```
 */
export function useAuthMessage(options?: MutationOptions<string, void>) {
    return useMutation({
        mutationKey: mexKeys.auth.message(),
        mutationFn: () => MEX.getAuthMessage(),
        ...options,
    });
}

/**
 * Login with signed message
 *
 * @example
 * ```tsx
 * const loginMutation = useLogin();
 *
 * await loginMutation.mutateAsync({
 *   message: '...',
 *   signature: '0x...',
 *   address: 'M8T1B...'
 * });
 * ```
 */
export function useLogin(
    options?: MutationOptions<MEX.TokenResponse, MEX.LoginPayload>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: MEX.LoginPayload) => MEX.login(payload),
        onSuccess: () => {
            // Invalidate all user-related queries on login
            queryClient.invalidateQueries({queryKey: mexKeys.users.all()});
            queryClient.invalidateQueries({queryKey: mexKeys.finance.all()});
        },
        ...options,
    });
}
