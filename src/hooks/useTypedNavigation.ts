import {useNavigation, useRoute} from '@react-navigation/native';
import {Navigation} from '../types/Navigation';

/**
 * Typed navigation hooks for type-safe navigation throughout the app.
 * These hooks provide automatic type inference and autocomplete for navigation methods.
 */

// Main app navigation (ModalStack level)
export function useAppNavigation() {
    return useNavigation<Navigation.AppNavigationProp>();
}

// Root navigation
export function useRootNavigation() {
    return useNavigation<Navigation.RootNavigationProp>();
}

// Wallet stack navigation
export function useWalletNavigation() {
    return useNavigation<Navigation.WalletNavigationProp>();
}

// Settings stack navigation
export function useSettingsNavigation() {
    return useNavigation<Navigation.SettingsNavigationProp>();
}

// Onboarding stack navigation
export function useOnboardingNavigation() {
    return useNavigation<Navigation.OnboardingNavigationProp>();
}

// Password stack navigation
export function usePasswordNavigation() {
    return useNavigation<Navigation.PasswordNavigationProp>();
}

// Address book stack navigation
export function useAddressBookNavigation() {
    return useNavigation<Navigation.AddressBookNavigationProp>();
}

// Typed route hooks
export function useAppRoute<T extends keyof Navigation.ModalParamList>() {
    return useRoute<Navigation.AppRouteProp<T>>();
}

export function useRootRoute<T extends keyof Navigation.RootParamList>() {
    return useRoute<Navigation.RootRouteProp<T>>();
}

export function useWalletRoute<T extends keyof Navigation.WalletParamList>() {
    return useRoute<Navigation.WalletRouteProp<T>>();
}

export function useSettingsRoute<T extends keyof Navigation.SettingsParamList>() {
    return useRoute<Navigation.SettingsRouteProp<T>>();
}

export function useOnboardingRoute<T extends keyof Navigation.OnboardingParamList>() {
    return useRoute<Navigation.OnboardingRouteProp<T>>();
}

export function usePasswordRoute<T extends keyof Navigation.PasswordParamList>() {
    return useRoute<Navigation.PasswordRouteProp<T>>();
}

export function useAddressBookRoute<T extends keyof Navigation.AddressBookParamList>() {
    return useRoute<Navigation.AddressBookRouteProp<T>>();
}
