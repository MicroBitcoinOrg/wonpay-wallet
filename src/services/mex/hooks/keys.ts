/**
 * MEX React Query - Query Keys
 * Centralized query key management for cache invalidation and updates
 */

import {GetTradesParams, PaginationParams} from '../api';
/**
 * Query key factory for MEX API
 */
export const mexKeys = {
    // Base keys
    all: ['mex'] as const,

    // Authentication
    auth: {
        all: () => [...mexKeys.all, 'auth'] as const,
        message: () => [...mexKeys.auth.all(), 'message'] as const,
    },

    // Users
    users: {
        all: () => [...mexKeys.all, 'users'] as const,
        me: (token?: string) => [...mexKeys.users.all(), 'me', token] as const,
        byUsername: (username: string) =>
            [...mexKeys.users.all(), 'username', username] as const,
    },

    // Finance
    finance: {
        all: () => [...mexKeys.all, 'finance'] as const,
        addresses: (token: string) =>
            [...mexKeys.finance.all(), 'addresses', token] as const,
        balances: (token: string) =>
            [...mexKeys.finance.all(), 'balances', token] as const,
        history: (
            token: string,
            args: unknown,
            pagination?: PaginationParams,
        ) =>
            [
                ...mexKeys.finance.all(),
                'history',
                token,
                args,
                pagination,
            ] as const,
    },

    // Offers
    offers: {
        all: () => [...mexKeys.all, 'offers'] as const,
        list: (filter: unknown, pagination?: PaginationParams) =>
            [...mexKeys.offers.all(), 'list', filter, pagination] as const,
        detail: (reference: string) =>
            [...mexKeys.offers.all(), 'detail', reference] as const,
        trades: (
            reference: string,
            token?: string,
            pagination?: PaginationParams,
        ) =>
            [
                ...mexKeys.offers.all(),
                'trades',
                reference,
                token,
                pagination,
            ] as const,
    },

    // Trades
    trades: {
        all: () => [...mexKeys.all, 'trades'] as const,
        detail: (reference: string, token: string) =>
            [...mexKeys.trades.all(), 'detail', reference, token] as const,
        list: (
            token: string,
            params: GetTradesParams,
            pagination?: PaginationParams,
        ) =>
            [
                ...mexKeys.trades.all(),
                'list',
                params,
                token,
                pagination,
            ] as const,
        outgoing: (token: string, pagination?: PaginationParams) =>
            [...mexKeys.trades.all(), 'outgoing', token, pagination] as const,
        incoming: (token: string, pagination?: PaginationParams) =>
            [...mexKeys.trades.all(), 'incoming', token, pagination] as const,
    },

    // Withdrawals
    withdrawals: {
        all: () => [...mexKeys.all, 'withdrawals'] as const,
        list: (token: string, pagination?: PaginationParams) =>
            [...mexKeys.withdrawals.all(), 'list', token, pagination] as const,
    },

    // Admin
    admin: {
        all: () => [...mexKeys.all, 'admin'] as const,
        users: (token: string, args: unknown, pagination?: PaginationParams) =>
            [...mexKeys.admin.all(), 'users', token, args, pagination] as const,
        user: (token: string, reference: string) =>
            [...mexKeys.admin.all(), 'user', token, reference] as const,
        userBalances: (token: string, reference: string) =>
            [...mexKeys.admin.all(), 'userBalances', token, reference] as const,
        trades: (token: string, args: unknown, pagination?: PaginationParams) =>
            [
                ...mexKeys.admin.all(),
                'trades',
                token,
                args,
                pagination,
            ] as const,
        trade: (token: string, reference: string) =>
            [...mexKeys.admin.all(), 'trade', token, reference] as const,
        history: (
            token: string,
            args: unknown,
            pagination?: PaginationParams,
        ) =>
            [
                ...mexKeys.admin.all(),
                'history',
                token,
                args,
                pagination,
            ] as const,
        flowStats: (token: string) =>
            [...mexKeys.admin.all(), 'flowStats', token] as const,
    },
} as const;
