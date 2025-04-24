import React from 'react';
import {
    Pressable,
    PressableProps,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Text} from '../common';
import {Colors} from '../../theme';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 4,
        borderRadius: 10,
    },
    leftContentContainer: {
        marginRight: 5,
    },
    rightContentContainer: {
        marginLeft: 5,
    },
    lgContainer: {
        height: 48,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    mdContainer: {
        height: 30,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    text: {
        fontWeight: 'bold',
        color: 'black',
    },
    lgText: {
        fontSize: 14,
    },
    mdText: {
        fontSize: 12,
    },
    leftPosition: {
        borderBottomLeftRadius: 45,
        borderTopLeftRadius: 45,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    rightPosition: {
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 45,
        borderTopRightRadius: 45,
    },
});

interface ButtonProps extends PressableProps {
    style?: Record<string, any>;
    textStyle?: Record<string, any>;
    title: string;
    border?: boolean;
    borderColor?: keyof typeof Colors.dark & keyof typeof Colors.light;
    color?: keyof typeof Colors.dark & keyof typeof Colors.light;
    type?: 'contained' | 'text' | 'outlined';
    size?: 'lg' | 'md';
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    flex?: 0 | 1;
    position?: 'left' | 'right';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    style,
    leftContent,
    rightContent,
    textStyle,
    title,
    border,
    borderColor,
    disabled,
    color,
    type,
    flex,
    size,
    position,
    fullWidth,
    ...props
}: ButtonProps) => {
    const scheme = useColorScheme();
    const isPressed = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(isPressed.value, [0, 1], [1, 0.95]);

        return {
            transform: [{scale}],
        };
    });

    const getColor = () => {
        if (type === 'contained') {
            if (color === 'primary') {
                return Colors[scheme!].primaryContrast;
            }

            if (color === 'secondary') {
                return Colors[scheme!].secondaryContrast;
            }

            if (color + 'Contrast' in Colors[scheme!]) {
                return Colors[scheme!][
                    (color + 'Contrast') as keyof typeof Colors.dark &
                        keyof typeof Colors.light
                ]!;
            }

            return Colors[scheme!].textPrimary;
        }

        return Colors[scheme!][color!];
    };

    return (
        <AnimatedPressable
            disabled={disabled}
            style={[
                styles.container,
                position &&
                    (position === 'left'
                        ? styles.leftPosition
                        : styles.rightPosition),
                {
                    borderWidth: border ? 1 : 0,
                    borderColor: borderColor
                        ? Colors[scheme!][borderColor]
                        : Colors[scheme!][color!],
                    opacity: disabled ? 0.5 : 1,
                    backgroundColor:
                        type === 'contained'
                            ? Colors[scheme!][color!]
                            : 'transparent',
                    flex,
                    width: fullWidth && '100%',
                },
                size === 'lg' ? styles.lgContainer : styles.mdContainer,
                animatedStyles,
                style,
            ]}
            onPressIn={() =>
                (isPressed.value = withSpring(1, {stiffness: 250, damping: 15}))
            }
            onPressOut={() =>
                (isPressed.value = withSpring(0, {stiffness: 250, damping: 15}))
            }
            {...props}>
            {leftContent && (
                <View style={styles.leftContentContainer}>{leftContent}</View>
            )}
            <Text
                style={[
                    styles.text,
                    size === 'lg' ? styles.lgText : styles.mdText,
                    textStyle,
                    {
                        color: getColor(),
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

Button.defaultProps = {
    size: 'lg',
    color: 'primary',
    flex: 0,
    type: 'contained',
};

export default Button;
