/**
 * MicroBitcoin API v3 - Block Endpoints
 * Endpoints for querying block-related data
 */

import {get} from './client';
import {
    BlockResponse,
    GetBlockParams,
    GetBlocksParams,
    GetBlockTransactionsParams,
    PaginatedResponse,
    TransactionResponse,
} from './types';

/**
 * Get the latest block
 *
 * Retrieves information about the most recently mined block in the blockchain.
 *
 * @returns Latest block information
 *
 * @example
 * ```ts
 * const latestBlock = await getLatestBlock();
 * console.log(`Latest block height: ${latestBlock.height}`);
 * ```
 */
export async function getLatestBlock(): Promise<BlockResponse> {
    return get<BlockResponse>('/blocks/latest');
}

/**
 * Get blocks
 *
 * Retrieves a paginated list of blocks from the blockchain.
 *
 * @param params - Request parameters (optional)
 * @returns Paginated list of blocks
 *
 * @example
 * ```ts
 * const blocks = await getBlocks({ page: 1 });
 * blocks.list.forEach(block => {
 *   console.log(`Block ${block.height}: ${block.blockhash}`);
 * });
 * ```
 */
export async function getBlocks(
    params: GetBlocksParams = {},
): Promise<PaginatedResponse<BlockResponse>> {
    const {page} = params;
    return get<PaginatedResponse<BlockResponse>>('/blocks/', {page});
}

/**
 * Get a specific block
 *
 * Retrieves detailed information about a specific block by its hash or height.
 *
 * @param params - Request parameters
 * @returns Block information
 *
 * @example
 * ```ts
 * // Get by hash
 * const block = await getBlock({
 *   hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f'
 * });
 *
 * // Get by height
 * const block = await getBlock({ hash: '12345' });
 * ```
 */
export async function getBlock(params: GetBlockParams): Promise<BlockResponse> {
    const {hash} = params;
    return get<BlockResponse>(`/blocks/${hash}`);
}

/**
 * Get block transactions
 *
 * Retrieves all transactions contained in a specific block.
 *
 * @param params - Request parameters
 * @returns Paginated list of transactions in the block
 *
 * @example
 * ```ts
 * const transactions = await getBlockTransactions({
 *   hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
 *   page: 1
 * });
 * console.log(`Block contains ${transactions.pagination.total} transactions`);
 * ```
 */
export async function getBlockTransactions(
    params: GetBlockTransactionsParams,
): Promise<PaginatedResponse<TransactionResponse>> {
    const {hash, page} = params;
    return get<PaginatedResponse<TransactionResponse>>(
        `/blocks/${hash}/transactions`,
        {page},
    );
}
