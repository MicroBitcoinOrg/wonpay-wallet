import React from 'react';
import {
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    useColorScheme,
    View,
    ViewStyle,
} from 'react-native';
import {Text} from '../common';
import {Colors} from '../../theme';
import Animated, {
    AnimatedStyle,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Constants
const SIZES = {
    lg: {
        height: 48,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        fontSize: 14,
    },
    md: {
        height: 30,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        fontSize: 12,
    },
} as const;

const ANIMATION_CONFIG = {
    stiffness: 250,
    damping: 15,
} as const;

const SCALE_RANGE = {
    pressed: 0.95,
    normal: 1,
} as const;

const BORDER_RADIUS = {
    rounded: 45,
    normal: 10,
} as const;

// Types
type ButtonSize = 'lg' | 'md';
type ButtonType = 'contained' | 'text' | 'outlined';
type ButtonPosition = 'left' | 'right';
type ColorKey = keyof typeof Colors.dark & keyof typeof Colors.light;

interface ButtonProps extends PressableProps {
    style?: StyleProp<ViewStyle>;
    textStyle?: Record<string, any>;
    title: string;
    border?: boolean;
    borderColor?: ColorKey;
    color?: ColorKey;
    type?: ButtonType;
    size?: ButtonSize;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    flex?: 0 | 1;
    position?: ButtonPosition;
    fullWidth?: boolean;
}

// Styles
const createStyles = (size: ButtonSize) =>
    StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 4,
            height: SIZES[size].height,
            paddingHorizontal: SIZES[size].paddingHorizontal,
            paddingVertical: SIZES[size].paddingVertical,
            borderRadius: SIZES[size].borderRadius,
        },
        leftContentContainer: {
            marginRight: 5,
        },
        rightContentContainer: {
            marginLeft: 5,
        },
        text: {
            fontWeight: 'bold',
            fontSize: SIZES[size].fontSize,
        },
        leftPosition: {
            borderBottomLeftRadius: BORDER_RADIUS.rounded,
            borderTopLeftRadius: BORDER_RADIUS.rounded,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
        },
        rightPosition: {
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomRightRadius: BORDER_RADIUS.rounded,
            borderTopRightRadius: BORDER_RADIUS.rounded,
        },
    });

// Helper functions
const getTextColor = (
    type: ButtonType,
    color: ColorKey,
    scheme: 'dark' | 'light',
): string => {
    if (type === 'contained') {
        // Handle primary color
        if (color === 'primary') {
            return Colors[scheme].primaryContrast;
        }

        // Handle secondary color
        if (color === 'secondary') {
            return Colors[scheme].secondaryContrast;
        }

        // Handle colors with contrast variants
        const contrastColorKey = `${color}Contrast` as ColorKey;
        if (contrastColorKey in Colors[scheme]) {
            return Colors[scheme][contrastColorKey];
        }

        // Fallback to primary text color
        return Colors[scheme].textPrimary;
    }

    // For text and outlined types, use the color directly
    return Colors[scheme][color];
};

const getBackgroundColor = (
    type: ButtonType,
    color: ColorKey,
    scheme: 'dark' | 'light',
): string => {
    return type === 'contained' ? Colors[scheme][color] : 'transparent';
};

const getBorderColor = (
    borderColor: ColorKey | undefined,
    color: ColorKey,
    scheme: 'dark' | 'light',
): string => {
    return borderColor ? Colors[scheme][borderColor] : Colors[scheme][color];
};

const getPositionStyles = (position: ButtonPosition | undefined) => {
    if (!position) return {};

    const positionStyles = {
        left: {
            borderBottomLeftRadius: BORDER_RADIUS.rounded,
            borderTopLeftRadius: BORDER_RADIUS.rounded,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
        },
        right: {
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomRightRadius: BORDER_RADIUS.rounded,
            borderTopRightRadius: BORDER_RADIUS.rounded,
        },
    };

    return positionStyles[position];
};

// Main component
const Button: React.FC<ButtonProps> = ({
    style,
    leftContent,
    rightContent,
    textStyle,
    title,
    border = false,
    borderColor,
    disabled = false,
    color = 'primary',
    type = 'contained',
    flex = 0,
    size = 'lg',
    position,
    fullWidth = false,
    ...props
}) => {
    const scheme = useColorScheme() as 'dark' | 'light';
    const isPressed = useSharedValue(0);
    const styles = createStyles(size);

    const animatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(
            isPressed.value,
            [0, 1],
            [SCALE_RANGE.normal, SCALE_RANGE.pressed],
        );

        return {
            transform: [{scale}],
        };
    });

    const handlePressIn = () => {
        isPressed.value = withSpring(1, ANIMATION_CONFIG);
    };

    const handlePressOut = () => {
        isPressed.value = withSpring(0, ANIMATION_CONFIG);
    };

    const textColor = getTextColor(type, color, scheme);
    const backgroundColor = getBackgroundColor(type, color, scheme);
    const resolvedBorderColor = getBorderColor(borderColor, color, scheme);
    const positionStyles = getPositionStyles(position);

    return (
        <AnimatedPressable
            disabled={disabled}
            style={[
                styles.container,
                positionStyles,
                {
                    borderWidth: border ? 1 : 0,
                    borderColor: resolvedBorderColor,
                    opacity: disabled ? 0.5 : 1,
                    backgroundColor,
                    flex,
                    width: fullWidth ? '100%' : 'auto',
                },
                animatedStyles,
                style,
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            {...props}>
            {leftContent && (
                <View style={styles.leftContentContainer}>{leftContent}</View>
            )}
            <Text
                style={[
                    styles.text,
                    textStyle,
                    {
                        color: textColor,
                    },
                ]}>
                {title}
            </Text>
            {rightContent && (
                <View style={styles.rightContentContainer}>{rightContent}</View>
            )}
        </AnimatedPressable>
    );
};

export default Button;
