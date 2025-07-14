import React from 'react';
import {
    Pressable,
    PressableProps,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {Colors} from '../../theme';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Constants
const SIZES = {
    md: {
        iconSize: 25,
        containerSize: 45,
        borderRadius: 40,
    },
    sm: {
        iconSize: 20,
        containerSize: 30,
        borderRadius: 20,
    },
} as const;

const ANIMATION_CONFIG = {
    stiffness: 250,
    damping: 15,
} as const;

const SCALE_RANGE = {
    pressed: 0.9,
    normal: 1,
} as const;

// Types
type IconSet = 'ionicons' | 'octicons' | 'entypo';
type ButtonSize = 'md' | 'sm';
type ColorKey = keyof typeof Colors.dark & keyof typeof Colors.light;

interface IconButtonProps extends PressableProps {
    style?: Record<string, any>;
    flex?: 0 | 1;
    size?: ButtonSize;
    iconColor?: string;
    color?: ColorKey;
    name: string;
    iconSet: IconSet;
    transparent?: boolean;
}

// Styles
const createStyles = (size: ButtonSize) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconContainer: {
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: SIZES[size].containerSize,
            height: SIZES[size].containerSize,
            borderRadius: SIZES[size].borderRadius,
        },
    });

// Helper functions
const getIconColor = (
    iconColor: string | undefined,
    transparent: boolean | undefined,
    color: ColorKey,
    scheme: 'dark' | 'light',
): string => {
    if (iconColor) {
        return iconColor in Colors[scheme]
            ? Colors[scheme][iconColor as ColorKey]
            : iconColor;
    }

    return transparent ? Colors[scheme][color] : Colors[scheme].secondary;
};

const getBackgroundColor = (
    transparent: boolean | undefined,
    scheme: 'dark' | 'light',
): string => {
    return transparent ? 'transparent' : Colors[scheme].primaryLight;
};

// Icon renderer component
const IconRenderer: React.FC<{
    iconSet: IconSet;
    name: string;
    size: number;
    color: string;
}> = ({iconSet, name, size, color}) => {
    const iconProps = {name, size, color};

    const iconComponents = {
        ionicons: <IoniconsIcon {...iconProps} />,
        octicons: <OcticonsIcon {...iconProps} />,
        entypo: <EntypoIcon {...iconProps} />,
    };

    return iconComponents[iconSet];
};

// Main component
const IconButton: React.FC<IconButtonProps> = ({
    style,
    color = 'textPrimary',
    iconColor,
    flex = 0,
    name,
    iconSet,
    size = 'md',
    transparent = false,
    disabled = false,
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

    const resolvedIconColor = getIconColor(
        iconColor,
        transparent,
        color,
        scheme,
    );
    const resolvedBackgroundColor = getBackgroundColor(transparent, scheme);

    return (
        <AnimatedPressable
            style={[
                styles.container,
                {
                    flex,
                    opacity: disabled ? 0.5 : 1,
                },
                animatedStyles,
                style,
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            {...props}>
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: resolvedBackgroundColor,
                    },
                ]}>
                <IconRenderer
                    iconSet={iconSet}
                    name={name}
                    size={SIZES[size].iconSize}
                    color={resolvedIconColor}
                />
            </View>
        </AnimatedPressable>
    );
};

export default IconButton;
