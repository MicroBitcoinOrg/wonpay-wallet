/**
 * MicroBitcoin Exchange (MEX) API Client
 * Base HTTP client with authentication support
 */

import {ErrorResponse, HTTPValidationError} from './types';

/**
 * MEX API base URL
 */
const MEX_BASE_URL = 'https://mex.mbc.wiki';

/**
 * Custom error class for MEX API errors
 */
export class MexApiError extends Error {
    constructor(
        public code: string,
        message: string,
        public statusCode?: number,
    ) {
        super(message);
        this.name = 'MexApiError';
    }
}

/**
 * Custom error class for validation errors
 */
export class MexApiValidationError extends MexApiError {
    constructor(
        public validationError: HTTPValidationError,
        statusCode?: number,
    ) {
        super(
            'validation:error',
            validationError.message || 'Request validation failed',
            statusCode || 422,
        );
        this.name = 'MexApiValidationError';
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
    authToken?: string;
}

/**
 * Build URL with query parameters
 */
function buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
): string {
    const url = new URL(path, MEX_BASE_URL);

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
async function parseErrorResponse(response: Response): Promise<MexApiError> {
    try {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();

            // Handle validation errors (422)
            if (response.status === 422) {
                if ('message' in errorData && 'code' in errorData) {
                    return new MexApiValidationError(
                        errorData as HTTPValidationError,
                        response.status,
                    );
                }
            }

            // Handle standard error responses
            if ('message' in errorData && 'code' in errorData) {
                const error = errorData as ErrorResponse;
                return new MexApiError(
                    error.code,
                    error.message,
                    response.status,
                );
            }
        }

        // Fallback for non-JSON or unexpected responses
        return new MexApiError(
            'http:error',
            `HTTP error! status: ${response.status}`,
            response.status,
        );
    } catch (e) {
        // If parsing fails, return generic error
        return new MexApiError(
            'http:error',
            `HTTP error! status: ${response.status}`,
            response.status,
        );
    }
}

/**
 * Make HTTP request to MEX API
 *
 * @param path - API endpoint path
 * @param options - Request options
 * @returns Parsed response data
 * @throws {MexApiError} When request fails
 */
export async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const {method = 'GET', headers = {}, body, params, authToken} = options;

    const url = buildUrl(path, params);

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Add authentication header if token is provided
    if (authToken) {
        requestHeaders['auth'] = authToken;
    }

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
        // Re-throw MexApiError instances
        if (error instanceof MexApiError) {
            throw error;
        }

        // Handle network errors and other exceptions
        if (error instanceof TypeError) {
            throw new MexApiError(
                'network:error',
                'Network error: Failed to connect to API',
            );
        }

        // Handle unknown errors
        throw new MexApiError(
            'unknown:error',
            error instanceof Error ? error.message : 'Unknown error occurred',
        );
    }
}

/**
 * Make authenticated GET request
 */
export async function get<T>(
    path: string,
    authToken?: string,
    params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
    return request<T>(path, {method: 'GET', params, authToken});
}

/**
 * Make authenticated POST request
 */
export async function post<T>(
    path: string,
    body?: unknown,
    authToken?: string,
    params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
    return request<T>(path, {method: 'POST', body, params, authToken});
}

/**
 * Make authenticated PUT request
 */
export async function put<T>(
    path: string,
    body?: unknown,
    authToken?: string,
    params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
    return request<T>(path, {method: 'PUT', body, params, authToken});
}

/**
 * Make authenticated DELETE request
 */
export async function del<T>(
    path: string,
    authToken?: string,
    params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
    return request<T>(path, {method: 'DELETE', params, authToken});
}
