declare module 'react-native-config' {
    export interface NativeConfig {
        DERIVATION_PATH: string;
        MAIN_NETWORK_HOST: string;
        TOKENS_API_HOST: string;
        SCRIPT_HASH: string;
        PUB_KEY_HASH: string;
        WIF: string;
        COIN_NAME: string;
        UNITS: string;
        NETWORK_NAME: string;
        EXPLORER_URL: string;
        PRIVACY_POLICY: string;
        TERMS_OF_SERVICE: string;
        ADDRESS_REGEX: string;
        TRANSACTION_REGEX: string;
        HEADER_HEIGHT_IOS: string;
        HEADER_HEIGHT_ANDROID: string;
        MIN_FEE: string;
    }

    export const Config: NativeConfig;
    export default Config;
}
