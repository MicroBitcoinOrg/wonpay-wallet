import Keychain from 'react-native-keychain';
import {Platform} from 'react-native';

// Compatibility layer to make react-native-keychain behave like react-native-sensitive-info
const SInfo = {
    /**
     * Set an item in secure storage
     * @param key The key to store the value under
     * @param value The value to store
     * @param options Options for storage
     */
    async setItem(
        key: string,
        value: string,
        options: any = {},
    ): Promise<boolean> {
        try {
            // For biometric protected items
            if (options.touchID) {
                const biometricOptions = {
                    accessControl:
                        options.kSecAccessControl ===
                        'kSecAccessControlBiometryAny'
                            ? Keychain.ACCESS_CONTROL.BIOMETRY_ANY
                            : Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                    authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
                };

                // We use the key as both username and service for simplicity
                await Keychain.setGenericPassword(key, value, {
                    service: key,
                    ...biometricOptions,
                });
                return true;
            } else {
                // Standard secure storage
                await Keychain.setGenericPassword(key, value, {service: key});
                return true;
            }
        } catch (error) {
            console.error('Error storing data securely:', error);
            return false;
        }
    },

    /**
     * Get an item from secure storage
     * @param key The key to retrieve
     * @param options Options for retrieval
     */
    async getItem(key: string, options: any = {}): Promise<string | null> {
        try {
            let credentials;

            // For biometric protected items
            if (options.touchID) {
                const biometricPromptOptions = Platform.select({
                    ios: {
                        prompt: options.kSecUseOperationPrompt,
                    },
                    android: {
                        title:
                            options.strings?.header ||
                            'Authentication Required',
                        description:
                            options.strings?.description ||
                            'Please authenticate to continue',
                    },
                });

                credentials = await Keychain.getGenericPassword({
                    service: key,
                    authenticationPrompt: biometricPromptOptions,
                });
            } else {
                // Standard secure storage
                credentials = await Keychain.getGenericPassword({service: key});
            }

            if (credentials) {
                return credentials.password;
            }
            return null;
        } catch (error) {
            console.error('Error retrieving data securely:', error);
            return null;
        }
    },

    /**
     * Check if biometric sensors are available
     */
    async isSensorAvailable(): Promise<boolean> {
        try {
            const biometryType = await Keychain.getSupportedBiometryType();
            return biometryType !== null;
        } catch (error) {
            console.error('Error checking sensor availability:', error);
            return false;
        }
    },
};

export default SInfo;
