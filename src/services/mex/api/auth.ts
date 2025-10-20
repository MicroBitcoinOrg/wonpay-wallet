/**
 * MEX API - Authentication Endpoints
 */

import {get, post} from './client';
import {LoginPayload, TokenResponse} from './types';

/**
 * Get authentication message
 *
 * Retrieves a message that needs to be signed for authentication.
 *
 * @returns Authentication message object
 *
 * @example
 * ```ts
 * const messageData = await getAuthMessage();
 * // Sign the message and use it for login
 * ```
 */
export async function getAuthMessage(): Promise<string> {
    return get<string>('/auth/message');
}

/**
 * Login with signed message
 *
 * Authenticates a user with a signed message and returns an access token.
 *
 * @param payload - Login credentials
 * @returns Authentication token
 *
 * @example
 * ```ts
 * const token = await login({
 *   message: '...',
 *   signature: '0x...',
 *   address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe'
 * });
 * console.log(`Token: ${token.access_token}`);
 * ```
 */
export async function login(payload: LoginPayload): Promise<TokenResponse> {
    return post<TokenResponse>('/auth/login', payload);
}
