/**
 * Navigation Type System - Usage Examples
 *
 * This file contains practical examples of using the typed navigation system.
 * These are reference examples only - not meant to be imported.
 */

import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {Navigation} from '../types/Navigation';
import {
    useAppNavigation,
    useWalletNavigation,
    useWalletRoute,
} from '../hooks/useTypedNavigation';

// ============================================================================
// Example 1: Basic Screen with Typed Navigation
// ============================================================================

type DepositScreenProps = StackScreenProps<Navigation.WalletParamList, 'Deposit'>;

const DepositScreenExample: React.FC<DepositScreenProps> = ({route, navigation}) => {
    // Route params are fully typed
    const {amount, token} = route.params;

    // Navigation is typed for WalletStack
    const handleNavigateToWithdraw = () => {
        navigation.navigate('Withdraw', {
            address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            token: 'BTC',
            amount: '0.01',
        });
    };

    return null; // ... component implementation
};

// ============================================================================
// Example 2: Using Typed Hooks
// ============================================================================

const WalletScreenExample: React.FC = () => {
    // Use typed navigation hook
    const navigation = useWalletNavigation();

    const handleShowCurrency = (balance: any) => {
        // TypeScript validates params
        navigation.navigate('Currency', {
            balance: balance, // Must be Wallet.Balance type
        });
    };

    const handleShowTransaction = (transaction: any) => {
        navigation.navigate('TransactionDetails', {
            transaction: transaction, // Must be Wallet.Transaction type
        });
    };

    return null; // ... component implementation
};

// ============================================================================
// Example 3: Cross-Stack Navigation
// ============================================================================

const AddressBookScreenExample: React.FC = () => {
    // Use parent navigation to access modal screens
    const parentNavigation = useAppNavigation();

    const handleAddAddress = () => {
        // Navigate to modal screen
        parentNavigation.navigate('ManageAddressBookItem', {
            address: '',
            title: '',
            favorite: false,
            type: 'add', // Typed as 'add' | 'edit'
        });
    };

    const handleEditAddress = (address: string, title: string) => {
        parentNavigation.navigate('ManageAddressBookItem', {
            address: address,
            title: title,
            favorite: true,
            type: 'edit',
        });
    };

    return null; // ... component implementation
};

// ============================================================================
// Example 4: Deep Linking Navigation
// ============================================================================

const HomeScreenExample: React.FC = () => {
    const navigation = useAppNavigation();

    const navigateToSpecificCurrency = (balance: any) => {
        // Navigate through multiple levels
        navigation.navigate('RootStack', {
            screen: 'MainTabs',
            params: {
                screen: 'WalletStack',
                params: {
                    screen: 'Currency',
                    params: {
                        balance: balance,
                    },
                },
            },
        });
    };

    const navigateToOnboarding = () => {
        navigation.navigate('RootStack', {
            screen: 'OnboardingStack',
            params: {
                screen: 'Welcome',
            },
        });
    };

    return null; // ... component implementation
};

// ============================================================================
// Example 5: Using ChooseList (Generic List Modal)
// ============================================================================

const SelectWalletExample: React.FC = () => {
    const navigation = useAppNavigation();
    const wallets: any[] = []; // Wallet.Wallet[]

    const handleShowWalletList = () => {
        navigation.navigate('ChooseList', {
            data: wallets,
            keyExtractor: (item: any) => item.uuid,
            renderItem: (item: any, nav: Navigation.AppNavigationProp) => {
                // Return your custom list item component
                return null;
            },
            headerTitle: 'Select Wallet',
            headerRight: (
                // Optional header right component
                null
            ),
        });
    };

    return null; // ... component implementation
};

// ============================================================================
// Example 6: Screen with Optional Params
// ============================================================================

const WithdrawScreenExample: React.FC = () => {
    // Using typed route hook
    const route = useWalletRoute<'Withdraw'>();
    const navigation = useWalletNavigation();

    // All params are optional, so check before using
    const {address, token, amount} = route.params;

    React.useEffect(() => {
        if (address) {
            console.log('Pre-filled address:', address);
        }
        if (token) {
            console.log('Pre-selected token:', token);
        }
        if (amount) {
            console.log('Pre-filled amount:', amount);
        }
    }, [address, token, amount]);

    return null; // ... component implementation
};

// ============================================================================
// Example 7: Navigation from Header Button
// ============================================================================

const WalletStackExample = () => {
    const navigation = useAppNavigation();

    const headerRight = () => (
        <button
            onClick={() => {
                navigation.navigate('RootStack', {
                    screen: 'QRCodeScanner',
                    params: {
                        type: 'home', // Typed as 'address-book' | 'withdraw' | 'home'
                    },
                });
            }}
        >
            Scan QR
        </button>
    );

    return null; // ... stack navigator implementation
};

// ============================================================================
// Example 8: Type-Safe Navigation Utilities
// ============================================================================

// Helper function with proper typing
function navigateToTokenDetails(
    navigation: Navigation.WalletNavigationProp,
    balance: any, // Wallet.Balance
) {
    navigation.navigate('Currency', {
        balance: balance,
    });
}

// Helper for common navigation pattern
function navigateToDeposit(
    navigation: Navigation.WalletNavigationProp,
    options?: {
        token?: string;
        amount?: string;
    }
) {
    navigation.navigate('Deposit', {
        token: options?.token,
        amount: options?.amount,
    });
}

// Usage in a component
const TokenListExample: React.FC = () => {
    const navigation = useWalletNavigation();
    const balance: any = {}; // Wallet.Balance

    const handleSelectToken = () => {
        navigateToTokenDetails(navigation, balance);
    };

    const handleDeposit = () => {
        navigateToDeposit(navigation, {
            token: 'BTC',
            amount: '0.001',
        });
    };

    return null; // ... component implementation
};

// ============================================================================
// Example 9: Screen Props Type for Functional Components
// ============================================================================

// Method 1: Using StackScreenProps
type CurrencyScreenProps = StackScreenProps<Navigation.WalletParamList, 'Currency'>;

const CurrencyScreenExample1: React.FC<CurrencyScreenProps> = ({route, navigation}) => {
    // Both route and navigation are properly typed
    const {balance} = route.params;

    return null;
};

// Method 2: Using typed hooks (recommended for simpler components)
const CurrencyScreenExample2: React.FC = () => {
    const route = useWalletRoute<'Currency'>();
    const navigation = useWalletNavigation();

    const {balance} = route.params;

    return null;
};

// ============================================================================
// Example 10: Type Guards for Navigation Params
// ============================================================================

function isDepositParams(params: any): params is Navigation.WalletParamList['Deposit'] {
    return (
        typeof params === 'object' &&
        (params.amount === undefined || typeof params.amount === 'string') &&
        (params.token === undefined || typeof params.token === 'string')
    );
}

const SafeNavigationExample: React.FC = () => {
    const navigation = useWalletNavigation();

    const handleNavigate = (params: unknown) => {
        if (isDepositParams(params)) {
            navigation.navigate('Deposit', params);
        }
    };

    return null;
};

export {
    // Export examples for reference only
    DepositScreenExample,
    WalletScreenExample,
    AddressBookScreenExample,
    HomeScreenExample,
    SelectWalletExample,
    WithdrawScreenExample,
    WalletStackExample,
    TokenListExample,
    CurrencyScreenExample1,
    CurrencyScreenExample2,
    SafeNavigationExample,
};
