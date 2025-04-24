import {DarkTheme, DefaultTheme} from '@react-navigation/native';

const Colors = {
    light: {
        ...DefaultTheme.colors,
        primary: '#0214B0',
        primaryLight: '#56A8F7',
        primaryContrast: 'white',
        secondary: '#fff',
        secondaryContrast: 'black',
        textPrimary: '#000',
        textSecondary: '#9e9e9e',
        white: '#fff',
        black: '#000',
        background: '#fff',
        card: '#fafafa',
        transparent: 'transparent',
        error: '#F88078',
        errorContrast: 'black',
        success: '#7BC67E',
    },
    dark: {
        ...DarkTheme.colors,
        primary: '#0214B0',
        primaryLight: '#56A8F7',
        primaryContrast: 'white',
        secondary: '#fff',
        secondaryContrast: 'black',
        textPrimary: '#fff',
        textSecondary: '#9e9e9e',
        white: '#fff',
        black: '#000',
        background: '#1E1E1E',
        card: '#272727',
        transparent: 'transparent',
        error: '#F88078',
        errorContrast: 'black',
        success: '#7BC67E',
    },
};

export default Colors;
