import RootStack from './root/RootStack';
import SettingsStack from './settings/SettingsStack';
import WalletStack from './wallet/WalletStack';
import AddressBookStack from './addressBook/AddressBookStack';
import OnboardingStack from './onboarding/OnboardingStack';
import PasswordStack from './password/PasswordStack';
import {createNavigationContainerRef} from '@react-navigation/native';
import ModalStack from './modal/ModalStack';

const navigationRef = createNavigationContainerRef();

export {
    RootStack,
    SettingsStack,
    WalletStack,
    AddressBookStack,
    OnboardingStack,
    PasswordStack,
    ModalStack,
    navigationRef,
};
