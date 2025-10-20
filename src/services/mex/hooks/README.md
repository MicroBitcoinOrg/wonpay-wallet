# MEX React Query Hooks

Complete React Query hooks for all 30 MicroBitcoin Exchange (MEX) API endpoints. These hooks provide automatic caching, background refetching, request deduplication, and optimistic updates.

## Features

-   **Automatic Caching** - Query results are cached and reused
-   **Background Refetching** - Data stays fresh automatically
-   **Request Deduplication** - Multiple components requesting the same data share a single request
-   **Optimistic Updates** - UI updates immediately on mutations
-   **Error Handling** - Built-in error states and retry logic
-   **TypeScript Support** - Full type safety for all hooks
-   **Query Invalidation** - Related queries automatically refresh after mutations

## Installation

The hooks are already part of the project:

```typescript
import {useBalances, useOffers, useCreateTrade} from '@/services/mex/hooks';
```

## Quick Start

### Authentication Flow

```tsx
import {useAuthMessage, useLogin} from '@/services/mex/hooks';

function LoginComponent() {
    const {data: authMessage} = useAuthMessage();
    const loginMutation = useLogin();

    const handleLogin = async () => {
        const signature = await wallet.signMessage(authMessage.message);

        const token = await loginMutation.mutateAsync({
            message: authMessage.message,
            signature,
            address: wallet.address,
        });

        // Save token for future requests
        setAuthToken(token.access_token);
    };

    return (
        <button onClick={handleLogin} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
    );
}
```

### Viewing Balances

```tsx
import {useBalances} from '@/services/mex/hooks';

function BalancesDisplay({token}: {token: string}) {
    const {data: balances, isLoading, error} = useBalances(token);

    if (isLoading) return <Spinner />;
    if (error) return <Error message={error.message} />;

    return (
        <div>
            {balances?.map(balance => (
                <div key={balance.currency}>
                    {balance.currency}: {balance.balance}
                    {balance.frozen > 0 && ` (${balance.frozen} frozen)`}
                </div>
            ))}
        </div>
    );
}
```

### Listing and Filtering Offers

```tsx
import {useOffers} from '@/services/mex/hooks';
import {SideEnum} from '@/services/microbitcoin/mex';

function OffersList() {
    const [page, setPage] = useState(1);

    const {data, isLoading} = useOffers(
        {
            currency: 'MBC',
            side: SideEnum.SELL,
            status: 'pending',
            sort: ['price:asc'],
        },
        {page},
    );

    return (
        <div>
            {data?.list.map(offer => (
                <OfferCard key={offer.reference} offer={offer} />
            ))}

            <Pagination
                current={page}
                total={data?.pagination.pages || 0}
                onChange={setPage}
            />
        </div>
    );
}
```

### Creating a Trade

```tsx
import {useCreateTrade, useBalances} from '@/services/mex/hooks';

function TradeButton({token, offerRef}: Props) {
    const createTrade = useCreateTrade(token);
    const {data: balances} = useBalances(token);

    const handleTrade = async () => {
        try {
            const trade = await createTrade.mutateAsync({
                reference: offerRef,
                data: {amount: 50},
            });

            // Balances and trades are automatically refetched!
            console.log('Trade created:', trade.reference);
        } catch (error) {
            console.error('Trade failed:', error);
        }
    };

    return (
        <button onClick={handleTrade} disabled={createTrade.isPending}>
            {createTrade.isPending ? 'Creating...' : 'Buy'}
        </button>
    );
}
```

## API Reference

### Authentication Hooks

#### `useAuthMessage(options?)`

Get authentication message to sign.

```tsx
const {data, isLoading, error} = useAuthMessage();
```

#### `useLogin(options?)`

Login mutation with signed message.

```tsx
const loginMutation = useLogin({
    onSuccess: token => {
        console.log('Logged in!', token.access_token);
    },
});

await loginMutation.mutateAsync(loginPayload);
```

### User Hooks

#### `useMyProfile(token, options?)`

Get authenticated user's profile.

```tsx
const {data: profile} = useMyProfile(token);
```

#### `useUserProfile(username, options?)`

Get public user profile by username.

```tsx
const {data: userProfile} = useUserProfile('john_doe');
```

### Finance Hooks

#### `useAddresses(token, options?)`

Get deposit addresses.

```tsx
const {data: addresses} = useAddresses(token);
```

#### `useBalances(token, options?)`

Get all balances.

```tsx
const {data: balances} = useBalances(token, {
    refetchInterval: 5000, // Refetch every 5 seconds
});
```

#### `useHistory(token, args?, pagination?, options?)`

Get transaction history.

```tsx
const {data: history} = useHistory(
    token,
    {categories: ['trade_completed']},
    {page: 1},
);
```

### Offers Hooks

#### `useOffers(filter?, pagination?, options?)`

List offers with filters.

```tsx
const {data: offers} = useOffers(
    {
        currency: 'MBC',
        side: SideEnum.SELL,
    },
    {page: 1},
);
```

#### `useOffer(reference, options?)`

Get offer details.

```tsx
const {data: offer} = useOffer('offer_reference');
```

#### `useOfferTrades(token, reference, pagination?, options?)`

Get trades for a specific offer.

```tsx
const {data: trades} = useOfferTrades(token, 'offer_ref', {page: 1});
```

#### `useCreateOffer(token, options?)`

Create new offer mutation.

```tsx
const createOffer = useCreateOffer(token);
await createOffer.mutateAsync(offerData);
```

#### `useUpdateOffer(token, options?)`

Update offer mutation.

```tsx
const updateOffer = useUpdateOffer(token);
await updateOffer.mutateAsync({
    reference: 'offer_ref',
    data: {quantity: 150},
});
```

#### `useDeleteOffer(token, options?)`

Delete offer mutation.

```tsx
const deleteOffer = useDeleteOffer(token);
await deleteOffer.mutateAsync({reference: 'offer_ref'});
```

### Trades Hooks

#### `useTrade(token, tradeReference, options?)`

Get trade details.

```tsx
const {data: trade} = useTrade(token, 'trade_reference');
```

#### `useOutgoingTrades(token, pagination?, options?)`

Get outgoing trades.

```tsx
const {data: outgoing} = useOutgoingTrades(token, {page: 1});
```

#### `useIncomingTrades(token, pagination?, options?)`

Get incoming trades.

```tsx
const {data: incoming} = useIncomingTrades(token, {page: 1});
```

#### `useCreateTrade(token, options?)`

Create trade mutation.

```tsx
const createTrade = useCreateTrade(token);
await createTrade.mutateAsync({
    reference: 'offer_ref',
    data: {amount: 50},
});
```

### Withdrawal Hooks

#### `useWithdrawals(token, pagination?, options?)`

List withdrawals.

```tsx
const {data: withdrawals} = useWithdrawals(token, {page: 1});
```

#### `useCreateWithdrawal(token, options?)`

Create withdrawal mutation.

```tsx
const createWithdrawal = useCreateWithdrawal(token);
await createWithdrawal.mutateAsync({
    currency: 'MBC',
    network: 'MBC',
    amount: 100,
    address: 'M8T1B...',
});
```

### Settings Hooks

#### `useUpdateUsername(token, options?)`

Update username mutation.

```tsx
const updateUsername = useUpdateUsername(token);
await updateUsername.mutateAsync({username: 'new_username'});
```

### Admin Hooks

#### `useAdminUsers(token, args?, pagination?, options?)`

List users (admin only).

```tsx
const {data: users} = useAdminUsers(
    adminToken,
    {
        banned: false,
    },
    {page: 1},
);
```

#### `useAdminUser(token, reference, options?)`

Get user details (admin only).

```tsx
const {data: user} = useAdminUser(adminToken, 'user_reference');
```

#### `useAdminUserBalances(token, reference, options?)`

View user balances (admin only).

```tsx
const {data: balances} = useAdminUserBalances(adminToken, 'user_reference');
```

#### `useAdminTrades(token, args?, pagination?, options?)`

List all trades (admin only).

```tsx
const {data: trades} = useAdminTrades(
    adminToken,
    {
        status: 'completed',
    },
    {page: 1},
);
```

#### `useAdminTrade(token, tradeReference, options?)`

Get trade details (admin only).

```tsx
const {data: trade} = useAdminTrade(adminToken, 'trade_reference');
```

#### `useAdminHistory(token, args?, pagination?, options?)`

Get platform history (admin only).

```tsx
const {data: history} = useAdminHistory(
    adminToken,
    {
        category: HistoryCategoryEnum.TRADE_COMPLETED,
    },
    {page: 1},
);
```

#### `useFlowStats(token, options?)`

Get flow statistics (admin only).

```tsx
const {data: stats} = useFlowStats(adminToken);
```

#### `useBanUser(token, options?)`

Ban user mutation (admin only).

```tsx
const banUser = useBanUser(adminToken);
await banUser.mutateAsync({reference: 'user_reference'});
```

#### `useUnbanUser(token, options?)`

Unban user mutation (admin only).

```tsx
const unbanUser = useUnbanUser(adminToken);
await unbanUser.mutateAsync({reference: 'user_reference'});
```

#### `useCloseOffer(token, options?)`

Close offer mutation (admin only).

```tsx
const closeOffer = useCloseOffer(adminToken);
await closeOffer.mutateAsync({reference: 'offer_reference'});
```

## Advanced Usage

### Manual Query Invalidation

```tsx
import {useQueryClient} from '@tanstack/react-query';
import {mexKeys} from '@/services/mex/hooks';

function MyComponent() {
    const queryClient = useQueryClient();

    const refreshBalances = () => {
        queryClient.invalidateQueries({
            queryKey: mexKeys.finance.balances(token),
        });
    };

    return <button onClick={refreshBalances}>Refresh</button>;
}
```

### Optimistic Updates

```tsx
const createTrade = useCreateTrade(token, {
    onMutate: async newTrade => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({
            queryKey: mexKeys.trades.outgoing(token),
        });

        // Snapshot previous value
        const previous = queryClient.getQueryData(
            mexKeys.trades.outgoing(token),
        );

        // Optimistically update
        queryClient.setQueryData(mexKeys.trades.outgoing(token), old => ({
            ...old,
            list: [...old.list, optimisticTrade],
        }));

        return {previous};
    },
    onError: (err, variables, context) => {
        // Roll back on error
        queryClient.setQueryData(
            mexKeys.trades.outgoing(token),
            context?.previous,
        );
    },
});
```

### Dependent Queries

```tsx
// Trade details depend on having a trade reference
const {data: offer} = useOffer(selectedOfferRef);
const {data: trades} = useOfferTrades(
    token,
    offer?.reference || null, // Only fetch when we have reference
    {page: 1},
);
```

### Infinite Queries

For pagination, you can use React Query's infinite query pattern:

```tsx
import {useInfiniteQuery} from '@tanstack/react-query';
import * as MEX from '@/services/microbitcoin/mex';
import {mexKeys} from '@/services/mex/hooks';

function useInfiniteOffers(filter: MEX.OfferFilterArgs) {
    return useInfiniteQuery({
        queryKey: mexKeys.offers.list(filter),
        queryFn: ({pageParam = 1}) => MEX.listOffers(filter, {page: pageParam}),
        getNextPageParam: lastPage =>
            lastPage.pagination.page < lastPage.pagination.pages
                ? lastPage.pagination.page + 1
                : undefined,
        initialPageParam: 1,
    });
}
```

## Best Practices

1. **Token Management**: Store tokens securely and pass them to hooks that need authentication.

2. **Error Handling**: Always handle error states in your components.

3. **Loading States**: Show appropriate loading indicators using `isLoading` or `isPending`.

4. **Refetch Intervals**: Use `refetchInterval` for data that needs to stay fresh (e.g., balances, offers).

5. **Query Keys**: Use the exported `mexKeys` for manual cache manipulation.

6. **Mutation Callbacks**: Use `onSuccess`, `onError`, and `onMutate` callbacks for side effects.

7. **Enabled Queries**: Use the `enabled` option to control when queries run.

## Query Keys Structure

All query keys follow this pattern:

```typescript
['mex', category, ...params];
```

Examples:

-   `['mex', 'users', 'me', token]`
-   `['mex', 'offers', 'list', filter, pagination]`
-   `['mex', 'finance', 'balances', token]`

This structure allows for efficient cache invalidation at any level.

## TypeScript Support

All hooks are fully typed with TypeScript:

```tsx
import type {CryptoOfferResponse} from '@/services/microbitcoin/mex';

const {data} = useOffer('ref');
// data is typed as CryptoOfferResponse | undefined

const createOffer = useCreateOffer(token);
// createOffer.mutateAsync expects CryptoOfferArgs
```

## Performance Tips

1. Use `staleTime` to reduce unnecessary refetches:

```tsx
useBalances(token, {staleTime: 60000}); // Fresh for 1 minute
```

2. Use `select` to transform data and prevent unnecessary re-renders:

```tsx
useBalances(token, {
    select: balances => balances.find(b => b.currency === 'MBC'),
});
```

3. Prefetch data before navigation:

```tsx
queryClient.prefetchQuery({
    queryKey: mexKeys.offers.detail(offerRef),
    queryFn: () => MEX.getOfferInfo({reference: offerRef}),
});
```

## License

This hook library is part of the WonPay Wallet project.
