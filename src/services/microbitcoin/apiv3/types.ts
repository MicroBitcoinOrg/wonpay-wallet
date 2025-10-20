/**
 * MicroBitcoin API v3 Types
 * Generated from OpenAPI specification at https://apiv3.mbc.wiki/openapi.json
 */

// ============================================================================
// Response Types
// ============================================================================

/**
 * Pagination metadata for paginated responses
 */
export interface PaginationDataResponse {
    /** Total number of items */
    total: number;
    /** Total number of pages */
    pages: number;
    /** Current page number */
    page: number;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
    pagination: PaginationDataResponse;
    list: T[];
}

/**
 * Balance information for an address
 */
export interface BalanceResponse {
    /** Currency ticker (e.g., 'MBC', 'DOGE') */
    currency: string;
    /** Number of decimal places */
    units: number;
    /** Balance amount in smallest units */
    balance: number;
}

/**
 * Block information
 */
export interface BlockResponse {
    /** Block creation timestamp (Unix time) */
    created: number;
    /** Block hash */
    blockhash: string;
    /** Block height */
    height: number;
    /** Number of transactions in block */
    tx: number;
}

/**
 * Transaction output information
 */
export interface OutputResponse {
    /** Destination address */
    address: string;
    /** Transaction ID */
    txid: string;
    /** Currency ticker */
    currency: string;
    /** Amount in smallest units */
    amount: number;
    /** Timelock value */
    timelock: number;
    /** Output type */
    type: string;
    /** Whether the output has been spent */
    spent: boolean;
    /** Script hex */
    script: string;
    /** Script assembly */
    asm: string;
    /** Output index */
    index: number;
}

/**
 * Full transaction output information (includes units)
 */
export interface OutputFullResponse extends OutputResponse {
    /** Number of decimal places */
    units: number;
}

/**
 * Transaction input information
 */
export interface InputFullResponse {
    /** Input amount in smallest units */
    amount: number;
    /** Number of decimal places */
    units: number;
    /** Currency ticker */
    currency: string;
    /** Source address */
    address: string;
}

/**
 * Full transaction information
 */
export interface TransactionResponse {
    /** Block height (null for mempool transactions) */
    height: number | null;
    /** Block hash (null for mempool transactions) */
    blockhash: string | null;
    /** Transaction timestamp (null for mempool transactions) */
    timestamp: number | null;
    /** Transaction ID */
    txid: string;
    /** Amounts by currency */
    amount: Record<string, number>;
    /** Transaction outputs */
    outputs: OutputFullResponse[];
    /** Transaction inputs */
    inputs: InputFullResponse[];
    /** Number of confirmations */
    confirmations: number;
    /** Transaction fee */
    fee: number;
}

/**
 * Error response from API
 */
export interface ErrorResponse {
    /** Error message */
    message: string;
    /** Error code */
    code: string;
}

/**
 * Validation error details
 */
export interface ValidationError {
    /** Error location in request */
    loc: (string | number)[];
    /** Error message */
    msg: string;
    /** Error type */
    type: string;
}

/**
 * HTTP validation error response
 */
export interface HTTPValidationError {
    /** Validation errors */
    detail: ValidationError[];
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * Transaction broadcast request
 */
export interface TransactionBroadcastArgs {
    /** Raw transaction hex */
    raw: string;
}

/**
 * Common pagination parameters
 */
export interface PaginationParams {
    /** Page number (must be > 0) */
    page?: number;
}

/**
 * Parameters for getting unspent outputs
 */
export interface GetUnspentOutputsParams extends PaginationParams {
    /** Address to query */
    address: string;
    /** Currency ticker */
    currency: string;
}

/**
 * Parameters for getting UTXO for a specific amount
 */
export interface GetUTXOParams extends PaginationParams {
    /** Address to query */
    address: string;
    /** Currency ticker */
    currency: string;
    /** Target amount */
    amount: number;
}

/**
 * Parameters for getting address transactions
 */
export interface GetAddressTransactionsParams extends PaginationParams {
    /** Address to query */
    address: string;
}

/**
 * Parameters for getting address mempool transactions
 */
export interface GetAddressMempoolParams {
    /** Address to query */
    address: string;
}

/**
 * Parameters for getting address balances
 */
export interface GetBalancesParams {
    /** Address to query */
    address: string;
}

/**
 * Parameters for getting blocks
 */
export interface GetBlocksParams extends PaginationParams {}

/**
 * Parameters for getting a specific block
 */
export interface GetBlockParams {
    /** Block hash or height */
    hash: string;
}

/**
 * Parameters for getting block transactions
 */
export interface GetBlockTransactionsParams extends PaginationParams {
    /** Block hash or height */
    hash: string;
}

/**
 * Parameters for getting transactions by token
 */
export interface GetTokenTransactionsParams extends PaginationParams {
    /** Token ticker */
    token: string;
}

/**
 * Parameters for getting transaction info
 */
export interface GetTransactionParams {
    /** Transaction ID */
    txid: string;
}

/**
 * Parameters for broadcasting a transaction
 */
export interface BroadcastTransactionParams {
    /** Raw transaction hex */
    raw: string;
}

// ============================================================================
// API Response Wrappers
// ============================================================================

/**
 * Successful API response
 */
export interface ApiSuccess<T> {
    success: true;
    data: T;
}

/**
 * Failed API response
 */
export interface ApiError {
    success: false;
    error: ErrorResponse;
}

/**
 * Generic API response type
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
