/**
 * MicroBitcoin Exchange (MEX) API
 *
 * A complete, type-safe TypeScript client for the MicroBitcoin Exchange API.
 * Provides access to all 30 endpoints including trading, user management, and admin functions.
 *
 * @module mex
 *
 * @example Basic usage
 * ```ts
 * import * as MEX from './services/microbitcoin/mex';
 *
 * // Login
 * const authMessage = await MEX.getAuthMessage();
 * const token = await MEX.login({
 *   message: authMessage.message,
 *   signature: '0x...',
 *   address: 'M8T1B...'
 * });
 *
 * // Get balances
 * const balances = await MEX.getBalances(token.access_token);
 *
 * // List offers
 * const offers = await MEX.listOffers({ currency: 'MBC' });
 * ```
 *
 * @example Error handling
 * ```ts
 * import * as MEX from './services/microbitcoin/mex';
 *
 * try {
 *   const user = await MEX.getMyProfile(token);
 * } catch (error) {
 *   if (error instanceof MEX.MexApiError) {
 *     console.error(`API Error: ${error.code} - ${error.message}`);
 *   }
 * }
 * ```
 */

// Export client and error classes
export {MexApiError, MexApiValidationError} from './client';

// Export all types
export * from './types';

// Export authentication endpoints
export {getAuthMessage, login} from './auth';

// Export user endpoints
export {getMyProfile, getUserProfile} from './user';

// Export finance endpoints
export {getAddresses, getBalances, getHistory} from './finance';

// Export offers endpoints
export {
    listOffers,
    getOfferInfo,
    createOffer,
    updateOffer,
    deleteOffer,
    getOfferTrades,
} from './offers';

// Export trades endpoints
export {
    createTrade,
    getTradeInfo,
    getOutgoingTrades,
    getIncomingTrades,
} from './trades';

// Export withdrawal endpoints
export {createWithdrawal, listWithdrawals} from './withdrawal';

// Export settings endpoints
export {updateUsername} from './settings';

// Export admin endpoints
export {
    listUsers,
    getUser,
    getUserBalances,
    banUser,
    unbanUser,
    listTrades,
    getAdminTradeInfo,
    closeOffer,
    getAdminHistory,
    getFlowStats,
} from './admin';

// Ping endpoint
import {get} from './client';

/**
 * Ping endpoint
 *
 * Simple health check endpoint to verify API connectivity.
 *
 * @returns Ping response
 *
 * @example
 * ```ts
 * const response = await ping();
 * console.log('MEX API is reachable');
 * ```
 */
export async function ping(): Promise<Record<string, unknown>> {
    return get<Record<string, unknown>>('/ping');
}

// ============================================================================
// Convenience re-exports for organized access
// ============================================================================

/**
 * Authentication endpoints
 */
export * as auth from './auth';

/**
 * User endpoints
 */
export * as user from './user';

/**
 * Finance endpoints
 */
export * as finance from './finance';

/**
 * Offers endpoints
 */
export * as offers from './offers';

/**
 * Trades endpoints
 */
export * as trades from './trades';

/**
 * Withdrawal endpoints
 */
export * as withdrawal from './withdrawal';

/**
 * Settings endpoints
 */
export * as settings from './settings';

/**
 * Admin endpoints
 */
export * as admin from './admin';
