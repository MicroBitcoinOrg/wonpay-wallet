/**
 * MEX API - Withdrawal Endpoints
 */

import {get, post} from './client';
import {PaginationParams, WithdrawalArgs, WithdrawalListResponse, WithdrawalResponse} from './types';

/**
 * Create withdrawal
 *
 * Creates a new withdrawal request.
 *
 * @param authToken - Authentication token
 * @param args - Withdrawal arguments
 * @returns Created withdrawal details
 *
 * @example
 * ```ts
 * const withdrawal = await createWithdrawal(token, {
 *   currency: 'MBC',
 *   network: 'MBC',
 *   amount: 100,
 *   address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe'
 * });
 * console.log(`Withdrawal created: ${withdrawal.reference}`);
 * ```
 */
export async function createWithdrawal(
    authToken: string,
    args: WithdrawalArgs,
): Promise<WithdrawalResponse> {
    return post<WithdrawalResponse>('/withdrawal/create', args, authToken);
}

/**
 * List withdrawals
 *
 * Retrieves all withdrawals for the authenticated user.
 *
 * @param authToken - Authentication token
 * @param pagination - Pagination parameters
 * @returns Paginated list of withdrawals
 *
 * @example
 * ```ts
 * const withdrawals = await listWithdrawals(token, { page: 1 });
 * console.log(`Total withdrawals: ${withdrawals.pagination.total}`);
 * ```
 */
export async function listWithdrawals(
    authToken: string,
    pagination?: PaginationParams,
): Promise<WithdrawalListResponse> {
    return get<WithdrawalListResponse>(
        '/withdrawal/list',
        authToken,
        pagination || {},
    );
}
