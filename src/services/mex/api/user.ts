/**
 * MEX API - User Endpoints
 */

import {get} from './client';
import {GetProfileParams, UserResponse} from './types';

/**
 * Get current user profile
 *
 * Retrieves the authenticated user's profile information.
 *
 * @param authToken - Authentication token
 * @returns User profile data
 *
 * @example
 * ```ts
 * const profile = await getMyProfile(token);
 * console.log(`Username: ${profile.username}`);
 * ```
 */
export async function getMyProfile(authToken: string): Promise<UserResponse> {
    return get<UserResponse>('/user/me', authToken);
}

/**
 * Get user profile by username
 *
 * Retrieves public profile information for a specific user.
 *
 * @param params - Request parameters
 * @returns User profile data
 *
 * @example
 * ```ts
 * const profile = await getUserProfile({ username: 'john_doe' });
 * console.log(`User address: ${profile.address}`);
 * ```
 */
export async function getUserProfile(
    params: GetProfileParams,
): Promise<UserResponse> {
    const {username} = params;
    return get<UserResponse>(`/user/${username}`);
}
