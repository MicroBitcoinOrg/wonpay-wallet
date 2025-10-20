/**
 * MEX API - Settings Endpoints
 */

import {post} from './client';
import {UpdateUsername, UserResponse} from './types';

/**
 * Update username
 *
 * Updates the authenticated user's username.
 *
 * @param authToken - Authentication token
 * @param args - Username update arguments
 * @returns Updated user profile
 *
 * @example
 * ```ts
 * const user = await updateUsername(token, {
 *   username: 'new_username'
 * });
 * console.log(`Username updated to: ${user.username}`);
 * ```
 */
export async function updateUsername(
    authToken: string,
    args: UpdateUsername,
): Promise<UserResponse> {
    return post<UserResponse>('/settings/username', args, authToken);
}
