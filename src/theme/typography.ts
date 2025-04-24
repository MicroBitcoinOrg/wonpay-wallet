import {TextStyle} from 'react-native';

interface SizesProps {
    [prop: string]: number;
}

export const sizes: SizesProps = {
    nano: 10,
    micro: 11,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    big: 32,
};

interface FontsProps {
    [prop: string]: string;
}

const fonts: FontsProps = {
    regular: 'HelveticaNeue-Roman',
    semibold: 'HelveticaNeue-Medium',
    bold: 'HelveticaNeue-Bold',
};

interface TypographyProps {
    [prop: string]: TextStyle;

    fonts: FontsProps;
    sizes: SizesProps;
}

const Typography: TypographyProps = {
    h1: {
        fontSize: sizes.xxxl,
        fontFamily: fonts.bold,
    },
    h2: {
        fontSize: sizes.xxl,
        fontFamily: fonts.bold,
    },
    h3: {
        fontSize: sizes.xl,
        fontFamily: fonts.regular,
    },
    body1: {
        fontSize: sizes.md,
        fontFamily: fonts.bold,
    },
    body2: {
        fontSize: sizes.md,
        fontFamily: fonts.regular,
    },
    body3: {
        fontSize: sizes.sm,
        fontFamily: fonts.regular,
    },
    sub1: {
        fontSize: sizes.xs,
        fontFamily: fonts.regular,
    },
    number1: {
        fontSize: sizes.big,
        fontFamily: fonts.bold,
    },
    number2: {
        fontSize: sizes.lg,
        fontFamily: fonts.regular,
    },
    sizes: sizes,
    fonts: fonts,
};

export default Typography;
