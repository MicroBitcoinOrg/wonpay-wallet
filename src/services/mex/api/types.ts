/**
 * MicroBitcoin Exchange (MEX) API Types
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Trade side enum
 */
export enum SideEnum {
    BUY = 'buy',
    SELL = 'sell',
}

/**
 * History category enum
 */
export enum HistoryCategoryEnum {
    TRADE_COMPLETED = 'trade_completed',
    OFFER_CREATE = 'offer_create',
    OFFER_CLOSE = 'offer_close',
    WITHDRAWAL = 'withdrawal',
    DEPOSIT = 'deposit',
}

/**
 * History status enum
 */
export enum HistoryStatusEnum {
    SUCCESS = 'success',
    PENDING = 'pending',
    FAILED = 'failed',
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Pagination metadata
 */
export interface PaginationResponse {
    total: number;
    pages: number;
    page: number;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
    pagination: PaginationResponse;
    list: T[];
}

/**
 * User profile information
 */
export interface UserResponse {
    reference: string;
    created: number;
    address: string;
    username: string | null;
    role: string;
}

/**
 * Admin user response with additional fields
 */
export interface AdminUserResponse extends UserResponse {
    banned: boolean;
}

/**
 * Balance information
 */
export interface BalanceResponse {
    balance: number;
    frozen: number;
    currency: string;
    network: string;
    type: string;
}

/**
 * Address information
 */
export type SupportedCurrency = {
    currency: string;
    min_withdrawal: number;
    min_deposit: number;
};

export interface AddressResponse {
    supported_currencies: SupportedCurrency[];
    min_withdrawal: number;
    address: string | null;
    confirmations: number;
    min_deposit: number;
    network: string;
}

export type Currency = {
    currency: string;
    network: string;
};

/**
 * Crypto offer response
 */
export interface CryptoOfferResponse {
    created: number;
    updated: number;
    side_currency: Currency;
    currency: Currency;
    offeror_currency: Currency;
    trader_currency: Currency;
    weighted_liquidity: number;
    weighted_quantity: number;
    weighted_filled: number;
    user: UserResponse;
    liquidity: number;
    limit_min: number;
    limit_max: number;
    quantity: number;
    reference: string;
    filled: number;
    price: number;
    status: string;
    side: string;
}

/**
 * Crypto trade response
 */
export interface CryptoTradeResponse {
    offer: CryptoOfferResponse;
    memo: string | null;
    created: number;
    updated: number;
    amount: number;
    user: UserResponse;
    reference: string;
    status: string;
}

/**
 * History item response
 */
export interface HistoryResponse {
    network: string | null;
    txid: string | null;
    created: number;
    user: UserResponse;
    reference: string;
    category: string;
    currency: string;
    amount: number;
    status: string;
    data: Record<string, unknown>;
}

/**
 * Withdrawal response
 */
export interface WithdrawalResponse {
    reference: string;
    created: number;
    updated: number;
    currency: string;
    network: string;
    amount: number;
    address: string;
    status: string;
    txid: string | null;
}

/**
 * Withdrawal list response
 */
export interface WithdrawalListResponse
    extends PaginatedResponse<WithdrawalResponse> {}

/**
 * Admin user list response
 */
export interface AdminUserListResponse
    extends PaginatedResponse<AdminUserResponse> {}

/**
 * History list response
 */
export interface HistoryListResponse
    extends PaginatedResponse<HistoryResponse> {}

/**
 * Crypto offer pagination response
 */
export interface CryptoOfferResponsePagination
    extends PaginatedResponse<CryptoOfferResponse> {}

/**
 * Crypto trade pagination response
 */
export interface CryptoTradeResponsePagination
    extends PaginatedResponse<CryptoTradeResponse> {}

/**
 * Flow stats response
 */
export interface FlowStatsResponse {
    outcome: number;
    income: number;
    total: number;
    currency: string;
}

/**
 * Authentication token response
 */
export interface TokenResponse {
    created: number;
    secret: string;
    expiration: number;
}

/**
 * Error response
 */
export interface ErrorResponse {
    message: string;
    code: string;
}

/**
 * Validation error details
 */
export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

/**
 * HTTP validation error response
 */
export interface HTTPValidationError {
    message: string;
    code: string;
}

// ============================================================================
// Request Types
// ============================================================================

/**
 * Login request payload
 */
export interface LoginPayload {
    message: string;
    signature: string;
    address: string;
}

/**
 * Update username request
 */
export interface UpdateUsername {
    username: string;
}

/**
 * Create crypto offer arguments
 */
export interface CryptoOfferArgs {
    limit_min: number | string;
    limit_max: number | string;
    quantity: number | string;
    price: number | string;
    currency: string;
    side_currency: string;
    side: SideEnum;
}

/**
 * Edit offer arguments
 */
export interface OfferEditArgs {
    quantity: number | string;
    sns_name: string;
    sns_id: string;
    memo: string;
}

/**
 * Offer filter arguments
 */
export interface OfferFilterArgs {
    status?: string;
    currency?: string | null;
    side_currency?: string | null;
    side?: SideEnum | null;
    user?: string | null;
    sort?: string[];
}

/**
 * Create trade arguments
 */
export interface TradeArgs {
    amount: number | string;
}

/**
 * Withdrawal creation arguments
 */
export interface WithdrawalArgs {
    crypto_currency: string;
    network: string;
    amount: number | string;
    address: string;
}

/**
 * History list filter arguments
 */
export interface HistoryListArgs {
    categories?: string[];
}

/**
 * Search user arguments (admin)
 */
export interface SearchUserArgs {
    sort?: string[];
    address?: string | null;
    username?: string | null;
    banned?: boolean | null;
    role?: string | null;
}

/**
 * Search trade arguments (admin)
 */
export interface SearchTradeArgs {
    sort?: string[];
    reference?: string | null;
    status?: string | null;
    side?: SideEnum | null;
    currency?: string | null;
    side_currency?: string | null;
    offer_reference?: string | null;
}

/**
 * Search history arguments (admin)
 */
export interface SearchHistoryArgs {
    sort?: string[];
    txid?: string | null;
    category?: HistoryCategoryEnum | null;
    status?: HistoryStatusEnum | null;
    address?: string | null;
    username?: string | null;
}

// ============================================================================
// Common Pagination Parameters
// ============================================================================

export type PaginationParams = Record<
    string,
    string | number | boolean | undefined
>;

// ============================================================================
// Endpoint Parameter Types
// ============================================================================

export interface GetOfferInfoParams {
    reference: string;
}

export interface UpdateOfferParams {
    reference: string;
    data: OfferEditArgs;
}

export interface DeleteOfferParams {
    reference: string;
}

export interface GetOfferTradesParams extends PaginationParams {
    reference: string;
}

export interface CreateTradeParams {
    reference: string;
    data: TradeArgs;
}

export interface GetTradesParams {
    direction: 'incoming' | 'outgoing' | 'any';
}

export interface GetTradeInfoParams {
    trade_reference: string;
}

export interface GetUserParams {
    reference: string;
}

export interface GetUserBalancesParams {
    reference: string;
}

export interface BanUserParams {
    reference: string;
}

export interface UnbanUserParams {
    reference: string;
}

export interface GetAdminTradeInfoParams {
    trade_reference: string;
}

export interface CloseOfferParams {
    reference: string;
}

export interface GetProfileParams {
    username: string;
}
