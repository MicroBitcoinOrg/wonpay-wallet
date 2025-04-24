import i18n, {
    LanguageDetectorAsyncModule,
    Services,
    InitOptions,
} from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {findBestLanguageTag} from 'react-native-localize';

import en from './en.json';
import ko from './ko.json';
import zh from './zh.json';

export const AVAILABLE_LANGUAGES = {
    en,
    ko,
    zh,
};

const AVALAILABLE_LANG_CODES = Object.keys(AVAILABLE_LANGUAGES);

const languageDetector: LanguageDetectorAsyncModule = {
    type: 'languageDetector',
    async: true,
    init: (
        _services: Services,
        _detectorOptions: object,
        _i18nextOptions: InitOptions,
    ) => {},
    detect: (callback: (lng: string) => void) => {
        AsyncStorage.getItem('APP_LANG', (err, lng) => {
            if (err || !lng) {
                if (err) {
                    console.log(
                        'Error fetching "APP_LANG" from async store',
                        err,
                    );
                } else {
                    console.log(
                        'No language is set, choosing the best available or English as fallback',
                    );
                }
                const bestLng = findBestLanguageTag(AVALAILABLE_LANG_CODES);

                callback(bestLng?.languageTag ?? 'en');
                return;
            }
            callback(lng);
        });
    },
    cacheUserLanguage: (lng: string) => AsyncStorage.setItem('APP_LANG', lng),
};

i18n.use(languageDetector)
    .use(initReactI18next)
    .init({
        resources: AVAILABLE_LANGUAGES,
        react: {
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false,
        },
        defaultNS: 'common',
    });
