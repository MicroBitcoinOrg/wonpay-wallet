# Navigation Type System Documentation

## Overview

This document describes the type-safe navigation system implemented for the WonPay wallet application using React Navigation v7.

## Architecture

### Navigation Hierarchy

```
App (NavigationContainer)
└── ModalStack (Root Level)
    ├── RootStack
    │   ├── Splash
    │   ├── QRCodeScanner
    │   ├── FactoryReset
    │   ├── DeleteWallet
    │   ├── MainTabs (Bottom Tabs)
    │   │   ├── AddressBookStack
    │   │   │   └── AddressBook
    │   │   ├── WalletStack
    │   │   │   ├── Wallet
    │   │   │   ├── Currency
    │   │   │   ├── Deposit
    │   │   │   ├── Withdraw
    │   │   │   ├── TransactionDetails
    │   │   │   └── TokenSettings
    │   │   └── SettingsStack
    │   │       ├── GlobalSettings
    │   │       └── Language
    │   ├── OnboardingStack
    │   │   ├── Welcome
    │   │   ├── Legal
    │   │   ├── RecoveryTips
    │   │   ├── Protect
    │   │   ├── RecoveryPhrase
    │   │   ├── Finished
    │   │   └── GenerateWallet
    │   └── PasswordStack
    │       ├── Password
    │       └── ChangePasswordMethod
    └── ManageAddressBookItem (Modal)
```

## Type Definitions

All navigation types are defined in `src/types/Navigation.d.ts`.

### Param Lists

Each navigator has its own param list that defines:

-   Screen names
-   Parameters each screen accepts
-   Whether parameters are optional or required

**Example:**

```typescript
type WalletParamList = {
    Wallet: undefined; // No params
    Deposit: {
        amount?: string; // Optional params
        token?: string;
    };
    TransactionDetails: {
        transaction: Wallet.Transaction; // Required params
    };
};
```

### Navigation Props

Pre-defined navigation prop types for each stack:

-   `AppNavigationProp` - Modal stack (root level)
-   `RootNavigationProp` - Root stack
-   `WalletNavigationProp` - Wallet stack
-   `SettingsNavigationProp` - Settings stack
-   `OnboardingNavigationProp` - Onboarding stack
-   `PasswordNavigationProp` - Password stack
-   `AddressBookNavigationProp` - Address book stack

### Route Props

Type-safe route props using generics:

```typescript
type WalletRouteProp<T extends keyof WalletParamList> = RouteProp<
    WalletParamList,
    T
>;
```

## Typed Navigation Hooks

Located in `src/hooks/useTypedNavigation.ts`, these hooks provide automatic type inference.

### Route Hooks

```typescript
import {useWalletRoute} from '../hooks/useTypedNavigation';

// In a component
const route = useWalletRoute<'Currency'>();
const {balance} = route.params; // Typed as Wallet.Balance
```

## Global Type Declaration

The global declaration in `Navigation.d.ts` enables automatic type inference:

```typescript
declare global {
    namespace ReactNavigation {
        interface RootParamList extends Navigation.ModalParamList {}
    }
}
```

This allows using `useNavigation()` without explicit typing when appropriate.

## Best Practices

### 1. Use Typed Hooks

**Good:**

```typescript
import {useWalletNavigation} from '../hooks/useTypedNavigation';

const navigation = useWalletNavigation();
```

**Avoid:**

```typescript
const navigation = useNavigation<any>();
```

### 2. Type Screen Components Properly

**Good:**

```typescript
import {Navigation} from '../types/Navigation';
import {StackScreenProps} from '@react-navigation/stack';

type Props = StackScreenProps<Navigation.WalletParamList, 'Deposit'>;

const DepositScreen: React.FC<Props> = ({route, navigation}) => {
    const {amount, token} = route.params; // Fully typed
    // ...
};
```

### 3. Navigating Between Stacks

When navigating from a nested stack to a parent or sibling stack:

```typescript
// From WalletStack to ModalStack screen
const parentNavigation = useNavigation<Navigation.AppNavigationProp>();
parentNavigation.navigate('ManageAddressBookItem', {
    address: '',
    title: '',
    favorite: false,
});
```

### 4. Deep Linking Navigation

```typescript
navigation.navigate('RootStack', {
    screen: 'MainTabs',
    params: {
        screen: 'WalletStack',
        params: {
            screen: 'Currency',
            params: {
                balance: selectedBalance,
            },
        },
    },
});
```

## Common Patterns

### Tab Navigation

Navigate to a tab and optionally a screen within it:

```typescript
navigation.navigate('MainTabs', {
    screen: 'WalletStack',
    params: {
        screen: 'Wallet',
    },
});
```

### Passing Data Between Screens

```typescript
// From parent screen
navigation.navigate('TransactionDetails', {
    transaction: selectedTransaction,
});

// In child screen
const route = useWalletRoute<'TransactionDetails'>();
const {transaction} = route.params; // Typed as Wallet.Transaction
```

## Migration Guide

### From Untyped to Typed Navigation

**Before:**

```typescript
const navigation = useNavigation<any>();
const route = useRoute<any>();
```

**After:**

```typescript
import {useWalletNavigation, useWalletRoute} from '../hooks/useTypedNavigation';

const navigation = useWalletNavigation();
const route = useWalletRoute<'Deposit'>();
```

### Updating navigateDeprecated

The `navigateDeprecated` method has been removed. Replace with standard `navigate`:

**Before:**

```typescript
navigation.navigateDeprecated('RootStack', {
    screen: 'OnboardingStack',
    params: {screen: 'Welcome'},
});
```

**After:**

```typescript
navigation.navigate('RootStack', {
    screen: 'OnboardingStack',
    params: {screen: 'Welcome'},
});
```

## Troubleshooting

### Type Errors

If you encounter type errors:

1. **Check the param list** - Ensure the screen is defined in the correct ParamList
2. **Use correct hook** - Match the hook to the stack level
3. **Verify params** - Required params must be provided, optional ones can be omitted

### Missing Autocomplete

If autocomplete doesn't work:

1. Ensure the global declaration is present in `Navigation.d.ts`
2. Restart TypeScript server in your IDE
3. Check that you're using `useNavigation()` from `@react-navigation/native`

## Type Safety Benefits

✅ **Compile-time errors** - Catch navigation errors before runtime
✅ **Autocomplete** - IDE suggests available screens and params
✅ **Refactoring safety** - Renaming screens updates all usages
✅ **Documentation** - Types serve as living documentation
✅ **Parameter validation** - Required params are enforced

## Additional Resources

-   [React Navigation TypeScript Documentation](https://reactnavigation.org/docs/typescript/)
-   [Navigation Types File](./Navigation.d.ts)
-   [Typed Hooks File](../hooks/useTypedNavigation.ts)
