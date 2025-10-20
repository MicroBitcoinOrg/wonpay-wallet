/**
 * MEX React Query Hooks - User Management
 */

import {useQuery} from '@tanstack/react-query';
import * as MEX from '../api';
import {mexKeys} from './keys';
import {QueryOptions} from './types';

/**
 * Get current user profile
 *
 * @param token - Authentication token
 * @param options - React Query options
 *
 * @example
 * ```tsx
 * const { data: profile } = useMyProfile(token);
 * ```
 */
export function useMyProfile(
    token: string | null,
    options?: QueryOptions<MEX.UserResponse>,
) {
    return useQuery({
        queryKey: token ? mexKeys.users.me(token) : [],
        queryFn: () => MEX.getMyProfile(token!),
        enabled: !!token,
        ...options,
    });
}

/**
 * Get user profile by username
 *
 * @param username - Username to fetch
 * @param options - React Query options
 *
 * @example
 * ```tsx
 * const { data: userProfile } = useUserProfile('john_doe');
 * ```
 */
export function useUserProfile(
    username: string | null,
    options?: QueryOptions<MEX.UserResponse>,
) {
    return useQuery({
        queryKey: username ? mexKeys.users.byUsername(username) : [],
        queryFn: () => MEX.getUserProfile({username: username!}),
        enabled: !!username,
        ...options,
    });
}
