/**
 * MicroBitcoin API v3
 *
 * A modern, type-safe API client for MicroBitcoin blockchain data.
 * Based on OpenAPI specification at https://apiv3.mbc.wiki/openapi.json
 *
 * @module apiv3
 *
 * @example Basic usage
 * ```ts
 * import * as apiv3 from './services/microbitcoin/apiv3';
 *
 * // Get address balances
 * const balances = await apiv3.getBalances({
 *   address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe'
 * });
 *
 * // Get latest block
 * const latestBlock = await apiv3.getLatestBlock();
 *
 * // Broadcast transaction
 * await apiv3.broadcastTransaction({
 *   raw: '0100000001...'
 * });
 * ```
 *
 * @example Error handling
 * ```ts
 * import * as apiv3 from './services/microbitcoin/apiv3';
 *
 * try {
 *   const tx = await apiv3.getTransaction({ txid: 'invalid' });
 * } catch (error) {
 *   if (error instanceof apiv3.ApiV3Error) {
 *     console.error(`API Error: ${error.code} - ${error.message}`);
 *   }
 * }
 * ```
 */

// Export client and error classes
export {ApiV3Error, ApiV3ValidationError} from './client';

// Export all types
export * from './types';

// Export address endpoints
export {
    getUnspentOutputs,
    getUTXO,
    getAddressTransactions,
    getAddressMempool,
    getBalances,
} from './addresses';

// Export block endpoints
export {
    getLatestBlock,
    getBlocks,
    getBlock,
    getBlockTransactions,
} from './blocks';

// Export transaction endpoints
export {
    getTokenTransactions,
    getMempool,
    getTransaction,
    broadcastTransaction,
    ping,
} from './transactions';

// ============================================================================
// Convenience re-exports for common patterns
// ============================================================================

/**
 * Address-related endpoints
 */
export * as addresses from './addresses';

/**
 * Block-related endpoints
 */
export * as blocks from './blocks';

/**
 * Transaction-related endpoints
 */
export * as transactions from './transactions';
