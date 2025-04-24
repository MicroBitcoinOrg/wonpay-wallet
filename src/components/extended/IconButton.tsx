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
import {Colors} from '../../theme';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mdIconContainer: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 45,
        height: 45,
        borderRadius: 40,
    },
    smIconContainer: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 20,
    },
});

interface IconButtonProps extends PressableProps {
    style?: Record<string, any>;
    flex?: 0 | 1;
    size?: 'md' | 'sm';
    iconColor?: string;
    color?: keyof typeof Colors.dark & keyof typeof Colors.light;
    name: string;
    iconSet: 'ionicons' | 'octicons' | 'entypo';
    transparent?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
    style,
    color,
    iconColor,
    flex,
    name,
    iconSet,
    size,
    transparent,
    disabled,
    ...props
}: IconButtonProps) => {
    const scheme = useColorScheme();
    const isPressed = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(isPressed.value, [0, 1], [1, 0.9]);

        return {
            transform: [{scale}],
        };
    });

    const iconProps = {
        name,
        size: size === 'md' ? 25 : 20,
        color: iconColor
            ? iconColor in Colors[scheme!]
                ? // @ts-ignore
                  Colors[scheme!][iconColor]
                : iconColor
            : transparent
            ? Colors[scheme!][color!]
            : Colors[scheme!].secondary,
    };

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
            onPressIn={() =>
                (isPressed.value = withSpring(1, {stiffness: 250, damping: 15}))
            }
            onPressOut={() =>
                (isPressed.value = withSpring(0, {stiffness: 250, damping: 15}))
            }
            disabled={disabled}
            {...props}>
            <View
                style={[
                    size === 'md'
                        ? styles.mdIconContainer
                        : styles.smIconContainer,
                    {
                        backgroundColor: transparent
                            ? 'transparent'
                            : Colors[scheme!].primaryLight,
                    },
                ]}>
                {iconSet === 'ionicons' && <IoniconsIcon {...iconProps} />}
                {iconSet === 'octicons' && <OcticonsIcon {...iconProps} />}
                {iconSet === 'entypo' && <EntypoIcon {...iconProps} />}
            </View>
        </AnimatedPressable>
    );
};

IconButton.defaultProps = {
    color: 'textPrimary',
    flex: 0,
    size: 'md',
};

export default IconButton;
