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
import {TextVariant} from '../../theme/typography';

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
    variant?: TextVariant;
}

const Text: React.FC<Props> = ({
    style,
    animated,
    children,
    color = 'textPrimary',
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
                !!variant && TypographyTheme[variant],
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
                !!variant && TypographyTheme[variant],
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

export default Text;
