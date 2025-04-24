import {StackNavigationProp} from '@react-navigation/stack';
import {NavigatorScreenParams} from '@react-navigation/native';

declare namespace Navigation {
    type ModalParamList = {
        ChooseList: {
            data: any[];
            keyExtractor: (item: any) => string | undefined;
            renderItem: (item: any, nav: AppNavigationProp) => React.ReactNode;
            headerTitle: string;
            headerRight?: React.ReactNode;
        };
        ManageAddressBookItem: {
            address: string;
        };
        RootStack: NavigatorScreenParams<RootParamList>;
    };

    type RootParamList = {
        Splash: undefined;
        QRCodeScanner: {
            type: string;
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
        Deposit: undefined;
        Withdraw: {
            address?: string;
            token?: string;
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
    };

    type AppNavigationProp = StackNavigationProp<ModalParamList>;
    /** Stand alone navigate function typings e.g. when provided as params */
    type Navigate = AppNavigationProp['navigate'];
}
