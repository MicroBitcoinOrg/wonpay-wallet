/**
 * MEX React Query Hooks - Settings
 */

import {useMutation, useQueryClient} from '@tanstack/react-query';
import * as MEX from '../api';
import {mexKeys} from './keys';
import {MutationOptions} from './types';

/**
 * Update username mutation
 *
 * @param token - Authentication token
 * @param options - Mutation options
 *
 * @example
 * ```tsx
 * const updateUsername = useUpdateUsername(token);
 *
 * await updateUsername.mutateAsync({
 *   username: 'new_username'
 * });
 * ```
 */
export function useUpdateUsername(
    token: string,
    options?: MutationOptions<MEX.UserResponse, MEX.UpdateUsername>,
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (args: MEX.UpdateUsername) =>
            MEX.updateUsername(token, args),
        onSuccess: () => {
            // Invalidate user profile queries
            queryClient.invalidateQueries({queryKey: mexKeys.users.all()});
        },
        ...options,
    });
}
