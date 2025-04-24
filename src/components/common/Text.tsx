import React, {ReactNode} from 'react';
import {
    Animated,
    StyleSheet,
    Text as NativeText,
    TextProps,
    TextStyle,
    useColorScheme,
} from 'react-native';
import {Colors, Typography as TypographyTheme} from '../../theme';

const styles = StyleSheet.create({
    container: {
        fontFamily: 'HelveticaNeue-Roman',
    },
});

interface Props extends TextProps {
    children: ReactNode | ReactNode[] | string;
    animated?: boolean;
    color?: keyof typeof Colors.dark & keyof typeof Colors.light;
    opacity?: number;
    fontWeight?: TextStyle['fontWeight'];
    textTransform?: TextStyle['textTransform'];
    align?: TextStyle['textAlign'];
    variant?:
        | 'h1'
        | 'h2'
        | 'h3'
        | 'body1'
        | 'body2'
        | 'body3'
        | 'sub1'
        | 'number1'
        | 'number2';
}

const Text: React.FC<Props> = ({
    style,
    animated,
    children,
    color,
    align,
    textTransform,
    opacity,
    variant,
    fontWeight,
    ...props
}) => {
    const scheme = useColorScheme();

    return animated ? (
        <NativeText
            style={[
                styles.container,
                variant && TypographyTheme[variant],
                {
                    color: color && Colors[scheme!][color],
                    opacity: opacity && opacity,
                    textAlign: align,
                    textTransform,
                },
                style,
            ]}
            {...props}>
            {children}
        </NativeText>
    ) : (
        <Animated.Text
            style={[
                styles.container,
                variant && TypographyTheme[variant],
                {
                    color: color && Colors[scheme!][color],
                    opacity: opacity && opacity,
                    textAlign: align,
                    fontWeight,
                    textTransform,
                },
                style,
            ]}
            {...props}>
            {children}
        </Animated.Text>
    );
};

Text.defaultProps = {
    color: 'textPrimary',
};

export default Text;
