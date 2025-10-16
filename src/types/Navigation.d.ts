import {StackNavigationProp} from '@react-navigation/stack';
import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';

declare namespace Navigation {
    type ModalParamList = {
        ChooseList: {
            data: any[];
            keyExtractor: (item: any) => string;
            renderItem: (item: any, nav: AppNavigationProp) => React.ReactNode;
            headerTitle: string;
            headerRight?: React.ReactNode;
        };
        ManageAddressBookItem: {
            address?: string;
            title?: string;
            favorite?: boolean;
            type?: 'add' | 'edit';
        };
        RootStack: NavigatorScreenParams<RootParamList>;
    };

    type RootParamList = {
        Splash: undefined;
        QRCodeScanner: {
            type?: 'address-book' | 'withdraw' | 'home';
        };
        OnboardingStack: NavigatorScreenParams<OnboardingParamList>;
        PasswordStack: NavigatorScreenParams<PasswordParamList>;
        FactoryReset: undefined;
        DeleteWallet: undefined;
        MainTabs: NavigatorScreenParams<MainTabsParamList>;
    };

    type MainTabsParamList = {
        WalletStack: NavigatorScreenParams<WalletParamList>;
        AddressBookStack: NavigatorScreenParams<AddressBookParamList>;
        SettingsStack: NavigatorScreenParams<SettingsParamList>;
    };

    type AddressBookParamList = {
        AddressBook: undefined;
    };

    type OnboardingParamList = {
        Welcome: undefined;
        Legal: undefined;
        Protect: undefined;
        RecoveryPhrase: undefined;
        Finished: undefined;
        GenerateWallet: undefined;
        RecoveryTips: undefined;
    };

    type PasswordParamList = {
        Password: undefined;
        ChangePasswordMethod: undefined;
    };

    type SettingsParamList = {
        GlobalSettings: undefined;
        Language: undefined;
        DepositRequest: undefined;
    };

    type WalletParamList = {
        History: undefined;
        Deposit: {
            amount?: string;
            token?: string;
        };
        Withdraw: {
            address?: string;
            token?: string;
            amount?: string;
        };
        Settings: undefined;
        TransactionDetails: {
            transaction: Wallet.Transaction;
        };
        SendTransaction: undefined;
        Tokens: undefined;
        QRRequest: undefined;
        Wallet: undefined;
        Currency: {
            balance: Wallet.Balance;
        };
        TokenSettings: {
            balance: Wallet.Balance;
        };
    };

    // Navigation Props
    type AppNavigationProp = StackNavigationProp<ModalParamList>;
    type RootNavigationProp = StackNavigationProp<RootParamList>;
    type WalletNavigationProp = StackNavigationProp<WalletParamList>;
    type SettingsNavigationProp = StackNavigationProp<SettingsParamList>;
    type OnboardingNavigationProp = StackNavigationProp<OnboardingParamList>;
    type PasswordNavigationProp = StackNavigationProp<PasswordParamList>;
    type AddressBookNavigationProp = StackNavigationProp<AddressBookParamList>;

    // Route Props
    type AppRouteProp<T extends keyof ModalParamList> = RouteProp<ModalParamList, T>;
    type RootRouteProp<T extends keyof RootParamList> = RouteProp<RootParamList, T>;
    type WalletRouteProp<T extends keyof WalletParamList> = RouteProp<WalletParamList, T>;
    type SettingsRouteProp<T extends keyof SettingsParamList> = RouteProp<SettingsParamList, T>;
    type OnboardingRouteProp<T extends keyof OnboardingParamList> = RouteProp<OnboardingParamList, T>;
    type PasswordRouteProp<T extends keyof PasswordParamList> = RouteProp<PasswordParamList, T>;
    type AddressBookRouteProp<T extends keyof AddressBookParamList> = RouteProp<AddressBookParamList, T>;

    /** Stand alone navigate function typings e.g. when provided as params */
    type Navigate = AppNavigationProp['navigate'];
}

// Global type declaration for React Navigation to enable automatic type inference
declare global {
    namespace ReactNavigation {
        interface RootParamList extends Navigation.ModalParamList {}
    }
}
