/**
 * MicroBitcoin API v3 Client
 * Base HTTP client with error handling for API v3 endpoints
 */

import {ErrorResponse, HTTPValidationError} from './types';

/**
 * API v3 base URL
 */
const API_V3_BASE_URL = 'https://apiv3.mbc.wiki';

/**
 * Custom error class for API errors
 */
export class ApiV3Error extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode?: number,
    ) {
        super(message);
        this.name = 'ApiV3Error';
    }
}

/**
 * Custom error class for validation errors
 */
export class ApiV3ValidationError extends ApiV3Error {
    constructor(
        public validationErrors: HTTPValidationError,
        statusCode?: number,
    ) {
        super(
            'validation:error',
            'Request validation failed',
            statusCode || 422,
        );
        this.name = 'ApiV3ValidationError';
    }
}

/**
 * HTTP client configuration options
 */
interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Build URL with query parameters
 */
function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path, API_V3_BASE_URL);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

/**
 * Parse error response from API
 */
async function parseErrorResponse(response: Response): Promise<ApiV3Error> {
    try {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();

            // Handle validation errors (422)
            if (response.status === 422 && 'detail' in errorData) {
                return new ApiV3ValidationError(
                    errorData as HTTPValidationError,
                    response.status,
                );
            }

            // Handle standard error responses
            if ('message' in errorData && 'code' in errorData) {
                const error = errorData as ErrorResponse;
                return new ApiV3Error(
                    error.code,
                    error.message,
                    response.status,
                );
            }
        }

        // Fallback for non-JSON or unexpected responses
        return new ApiV3Error(
            'http:error',
            `HTTP error! status: ${response.status}`,
            response.status,
        );
    } catch (e) {
        // If parsing fails, return generic error
        return new ApiV3Error(
            'http:error',
            `HTTP error! status: ${response.status}`,
            response.status,
        );
    }
}

/**
 * Make HTTP request to API v3
 *
 * @param path - API endpoint path
 * @param options - Request options
 * @returns Parsed response data
 * @throws {ApiV3Error} When request fails
 */
export async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const {method = 'GET', headers = {}, body, params} = options;

    const url = buildUrl(path, params);

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    try {
        const response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        // Handle error responses
        if (!response.ok) {
            throw await parseErrorResponse(response);
        }

        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return {} as T;
        }

        // Parse and return JSON response
        const data = await response.json();
        return data as T;
    } catch (error) {
        // Re-throw ApiV3Error instances
        if (error instanceof ApiV3Error) {
            throw error;
        }

        // Handle network errors and other exceptions
        if (error instanceof TypeError) {
            throw new ApiV3Error(
                'network:error',
                'Network error: Failed to connect to API',
            );
        }

        // Handle unknown errors
        throw new ApiV3Error(
            'unknown:error',
            error instanceof Error ? error.message : 'Unknown error occurred',
        );
    }
}

/**
 * Make GET request to API v3
 */
export async function get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
    return request<T>(path, {method: 'GET', params});
}

/**
 * Make POST request to API v3
 */
export async function post<T>(
    path: string,
    body?: unknown,
    params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
    return request<T>(path, {method: 'POST', body, params});
}
