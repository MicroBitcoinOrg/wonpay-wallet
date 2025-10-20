## MicroBitcoin Exchange (MEX) API Client

A complete, type-safe TypeScript client for the MicroBitcoin Exchange API. This client provides access to all 30 endpoints for trading, user management, withdrawals, and administrative functions.

## Features

-   **Full TypeScript support** - Complete type definitions for all requests and responses
-   **Authentication** - Built-in token-based authentication
-   **Comprehensive error handling** - Custom error classes for API and validation errors
-   **Modern async/await API** - Clean, promise-based interface
-   **All 30 endpoints** - Complete coverage of MEX API functionality
-   **Well-documented** - JSDoc comments with examples for every function

## Installation

The API client is already part of the project. Simply import it:

```typescript
import * as MEX from './services/microbitcoin/mex';
```

## Quick Start

### Authentication

```typescript
// Get authentication message
const messageData = await MEX.getAuthMessage();

// Sign the message with your wallet (implementation depends on your wallet library)
const signature = await wallet.signMessage(messageData.message);

// Login and get token
const token = await MEX.login({
    message: messageData.message,
    signature: signature,
    address: wallet.address,
});

// Save token for authenticated requests
const authToken = token.access_token;
```

### Get User Profile

```typescript
// Get your own profile
const myProfile = await MEX.getMyProfile(authToken);
console.log(`Username: ${myProfile.username}`);

// Get another user's profile (public)
const userProfile = await MEX.getUserProfile({username: 'john_doe'});
```

### Finance Operations

```typescript
// Get your balances
const balances = await MEX.getBalances(authToken);
balances.forEach(balance => {
    console.log(
        `${balance.currency}: ${balance.balance} (${balance.frozen} frozen)`,
    );
});

// Get deposit addresses
const addresses = await MEX.getAddresses(authToken);

// Get transaction history
const history = await MEX.getHistory(
    authToken,
    {
        categories: ['trade_completed', 'deposit'],
    },
    {page: 1},
);
```

### Trading - Create and Manage Offers

```typescript
// List available offers
const offers = await MEX.listOffers(
    {
        currency: 'MBC',
        side_currency: 'USD',
        side: MEX.SideEnum.SELL,
        status: 'pending',
    },
    {page: 1},
);

// Create a sell offer
const newOffer = await MEX.createOffer(authToken, {
    currency: 'MBC',
    side_currency: 'USD',
    side: MEX.SideEnum.SELL,
    quantity: 100,
    price: 0.5,
    limit_min: 10,
    limit_max: 100,
    sns_name: 'Telegram',
    sns_id: '@myusername',
    memo: 'Fast trades, online now!',
});

// Update an offer
const updatedOffer = await MEX.updateOffer(authToken, {
    reference: newOffer.reference,
    data: {
        quantity: 150,
        sns_name: 'Telegram',
        sns_id: '@myusername',
        memo: 'Updated memo',
    },
});

// Delete an offer
await MEX.deleteOffer(authToken, {reference: newOffer.reference});
```

### Trading - Create and Manage Trades

```typescript
// Create a trade on an offer
const trade = await MEX.createTrade(authToken, {
    reference: 'offer_abc123',
    data: {amount: 50},
});

// Get trade information
const tradeInfo = await MEX.getTradeInfo(authToken, {
    trade_reference: trade.reference,
});

// Get your outgoing trades (where you're the buyer/seller)
const outgoing = await MEX.getOutgoingTrades(authToken, {page: 1});

// Get incoming trades (on your offers)
const incoming = await MEX.getIncomingTrades(authToken, {page: 1});
```

### Withdrawals

```typescript
// Create withdrawal
const withdrawal = await MEX.createWithdrawal(authToken, {
    currency: 'MBC',
    network: 'MBC',
    amount: 100,
    address: 'M8T1B2Z97gVdvmfkRebAfGNDsrtJTdqfYe',
});

// List withdrawals
const withdrawals = await MEX.listWithdrawals(authToken, {page: 1});
```

### Settings

```typescript
// Update username
const updatedUser = await MEX.updateUsername(authToken, {
    username: 'new_username',
});
```

## API Reference

### Authentication Endpoints

#### `getAuthMessage()`

Get authentication message that needs to be signed.

```typescript
const messageData = await MEX.getAuthMessage();
```

#### `login(payload)`

Login with signed message and get access token.

```typescript
const token = await MEX.login({
    message: '...',
    signature: '0x...',
    address: 'M8T1B...',
});
```

### User Endpoints

#### `getMyProfile(authToken)`

Get authenticated user's profile.

#### `getUserProfile(params)`

Get public profile by username.

### Finance Endpoints

#### `getAddresses(authToken)`

Get deposit addresses for all supported networks.

#### `getBalances(authToken)`

Get all balances including frozen amounts.

#### `getHistory(authToken, args?, pagination?)`

Get transaction history with optional filters.

### Offers Endpoints

#### `listOffers(filter?, pagination?)`

List offers with optional filters (no auth required for public viewing).

#### `getOfferInfo(params)`

Get detailed information about a specific offer.

#### `createOffer(authToken, args)`

Create a new buy or sell offer.

#### `updateOffer(authToken, params)`

Update an existing offer.

#### `deleteOffer(authToken, params)`

Delete (close) an offer.

#### `getOfferTrades(authToken?, params)`

Get all trades for a specific offer.

### Trades Endpoints

#### `createTrade(authToken, params)`

Create a new trade on an offer.

#### `getTradeInfo(authToken, params)`

Get detailed trade information.

#### `getOutgoingTrades(authToken, pagination?)`

Get trades where you're the buyer/seller.

#### `getIncomingTrades(authToken, pagination?)`

Get trades on your offers.

### Withdrawal Endpoints

#### `createWithdrawal(authToken, args)`

Create a withdrawal request.

#### `listWithdrawals(authToken, pagination?)`

List all your withdrawals.

### Settings Endpoints

#### `updateUsername(authToken, args)`

Update your username.

### Admin Endpoints

All admin endpoints require an admin authentication token.

#### `listUsers(authToken, args?, pagination?)`

Search and list users.

#### `getUser(authToken, params)`

Get user details.

#### `getUserBalances(authToken, params)`

View a user's balances.

#### `banUser(authToken, params)`

Ban a user.

#### `unbanUser(authToken, params)`

Unban a user.

#### `listTrades(authToken, args?, pagination?)`

Search and list all trades.

#### `getAdminTradeInfo(authToken, params)`

Get trade details.

#### `closeOffer(authToken, params)`

Forcefully close an offer.

#### `getAdminHistory(authToken, args?, pagination?)`

Get platform-wide transaction history.

#### `getFlowStats(authToken)`

Get platform flow statistics (income/outcome).

### Utility Endpoints

#### `ping()`

Health check endpoint.

```typescript
await MEX.ping();
```

## Error Handling

The API client provides custom error classes for better error handling:

### `MexApiError`

Base error class for all API errors.

```typescript
try {
    await MEX.getMyProfile('invalid_token');
} catch (error) {
    if (error instanceof MEX.MexApiError) {
        console.error(`Error code: ${error.code}`);
        console.error(`Message: ${error.message}`);
        console.error(`Status: ${error.statusCode}`);
    }
}
```

### `MexApiValidationError`

Specialized error for validation failures (HTTP 422).

```typescript
try {
    await MEX.createOffer(token, {
        // invalid data...
    });
} catch (error) {
    if (error instanceof MEX.MexApiValidationError) {
        console.error('Validation error:');
        console.error(error.validationError.message);
    }
}
```

## Type Definitions

All request and response types are exported:

```typescript
import {
    UserResponse,
    BalanceResponse,
    CryptoOfferResponse,
    CryptoTradeResponse,
    WithdrawalResponse,
    SideEnum,
    HistoryCategoryEnum,
    // ... and many more
} from './services/microbitcoin/mex';
```

## Advanced Usage

### Using namespaced imports

```typescript
import * as MEX from './services/microbitcoin/mex';

// Access endpoints by category
const message = await MEX.auth.getAuthMessage();
const balances = await MEX.finance.getBalances(token);
const offers = await MEX.offers.listOffers();
const users = await MEX.admin.listUsers(adminToken);
```

### Filtering and Sorting

```typescript
// Filter offers
const sellOffers = await MEX.listOffers(
    {
        currency: 'MBC',
        side: MEX.SideEnum.SELL,
        status: 'pending',
        sort: ['price:asc', 'created:desc'],
    },
    {page: 1},
);

// Filter history
const deposits = await MEX.getHistory(
    token,
    {
        categories: [MEX.HistoryCategoryEnum.DEPOSIT],
    },
    {page: 1},
);
```

### Pagination

All paginated endpoints return a consistent structure:

```typescript
interface PaginatedResponse<T> {
    pagination: {
        total: number; // Total number of items
        pages: number; // Total number of pages
        page: number; // Current page
    };
    list: T[]; // Array of items
}
```

Example: Iterating through all pages

```typescript
let page = 1;
let allTrades: CryptoTradeResponse[] = [];

while (true) {
    const response = await MEX.getOutgoingTrades(token, {page});
    allTrades.push(...response.list);

    if (page >= response.pagination.pages) {
        break;
    }
    page++;
}

console.log(`Total trades: ${allTrades.length}`);
```

## Trading Workflow Example

Complete example of a trading workflow:

```typescript
// 1. Login
const authMessage = await MEX.getAuthMessage();
const signature = await wallet.signMessage(authMessage.message);
const token = await MEX.login({
    message: authMessage.message,
    signature,
    address: wallet.address,
});

// 2. Check balances
const balances = await MEX.getBalances(token.access_token);
const mbcBalance = balances.find(b => b.currency === 'MBC');
console.log(`MBC Balance: ${mbcBalance.balance}`);

// 3. Find an offer
const offers = await MEX.listOffers(
    {
        currency: 'MBC',
        side: MEX.SideEnum.SELL,
        status: 'pending',
    },
    {page: 1},
);

const bestOffer = offers.list[0]; // Assuming sorted by price

// 4. Create a trade
const trade = await MEX.createTrade(token.access_token, {
    reference: bestOffer.reference,
    data: {amount: 50},
});

console.log(`Trade created: ${trade.reference}`);
console.log(`Status: ${trade.status}`);
console.log(`Contact seller: ${bestOffer.sns_name} - ${bestOffer.sns_id}`);

// 5. Monitor trade status
setInterval(async () => {
    const updatedTrade = await MEX.getTradeInfo(token.access_token, {
        trade_reference: trade.reference,
    });
    console.log(`Trade status: ${updatedTrade.status}`);
}, 5000);
```

## Admin Operations Example

```typescript
// Admin authentication
const adminToken = 'admin_token_here';

// View platform statistics
const flowStats = await MEX.getFlowStats(adminToken);
flowStats.forEach(stat => {
    console.log(`${stat.currency}:`);
    console.log(`  Income: ${stat.income}`);
    console.log(`  Outcome: ${stat.outcome}`);
    console.log(`  Total: ${stat.total}`);
});

// Search for problematic users
const bannedUsers = await MEX.listUsers(
    adminToken,
    {
        banned: true,
    },
    {page: 1},
);

// View user details
const user = await MEX.getUser(adminToken, {
    reference: 'user_reference_here',
});

// Ban user if needed
if (!user.banned) {
    await MEX.banUser(adminToken, {reference: user.reference});
}

// Close suspicious offers
await MEX.closeOffer(adminToken, {reference: 'suspicious_offer_ref'});

// Monitor trades
const trades = await MEX.listTrades(
    adminToken,
    {
        status: 'pending',
        sort: ['created:desc'],
    },
    {page: 1},
);
```

## Best Practices

1. **Token Management**: Store authentication tokens securely. Never expose tokens in client-side code or logs.

2. **Error Handling**: Always wrap API calls in try-catch blocks and handle errors appropriately.

3. **Rate Limiting**: Be mindful of API rate limits. Implement exponential backoff for retries.

4. **Pagination**: When fetching large datasets, use pagination to avoid memory issues.

5. **Type Safety**: Leverage TypeScript types for compile-time safety and better IDE support.

6. **Authentication**: Always check if a user is authenticated before calling protected endpoints.

## Troubleshooting

### Authentication Issues

```typescript
// Check if token is valid
try {
    const profile = await MEX.getMyProfile(token);
    console.log('Token is valid');
} catch (error) {
    if (error instanceof MEX.MexApiError && error.statusCode === 401) {
        console.log('Token expired or invalid, please login again');
    }
}
```

### Network Errors

```typescript
try {
    const offers = await MEX.listOffers();
} catch (error) {
    if (error instanceof MEX.MexApiError && error.code === 'network:error') {
        console.log('Network error, check your internet connection');
    }
}
```

## License

This API client is part of the WonPay Wallet project.
