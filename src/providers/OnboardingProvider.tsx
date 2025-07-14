import React, {useReducer} from 'react';
import {Wallet} from '../types/Wallet';

interface OnboardingProviderProps {
    children: any;
}

type Onboarding = {
    wallet: Partial<Wallet.Wallet>;
    processType: 'create' | 'import';
};

type OnboardingAction =
    | {type: 'setWalletValues'; wallet: Partial<Wallet.Wallet>}
    | {type: 'resetWalletValues'}
    | {type: 'setProcessType'; processType: 'create' | 'import'};

type OnboardingContextType = {
    onboarding?: Onboarding;
    dispatchOnboardingAction: React.Dispatch<OnboardingAction>;
};

type OnboardingReducer = (
    state: Onboarding,
    action: OnboardingAction,
) => Onboarding;

const onboardingReducer = (
    state: Onboarding,
    action: OnboardingAction,
): Onboarding => {
    switch (action.type) {
        case 'setWalletValues':
            return {...state, wallet: {...state.wallet, ...action.wallet}};
        case 'resetWalletValues':
            return {...state, processType: 'create', wallet: {}};
        case 'setProcessType':
            return {...state, processType: action.processType};
        default:
            return state;
    }
};

export const OnboardingContext = React.createContext<OnboardingContextType>({
    dispatchOnboardingAction: () => {},
});

export const OnboardingProvider = ({children}: OnboardingProviderProps) => {
    const [onboarding, dispatchOnboardingAction] = useReducer(
        onboardingReducer,
        {
            processType: 'create',
            wallet: {
                chain: Wallet.ChainEnum.MICROBITCOIN,
            },
        },
    );

    return (
        <OnboardingContext.Provider
            value={{onboarding, dispatchOnboardingAction}}>
            {children}
        </OnboardingContext.Provider>
    );
};
