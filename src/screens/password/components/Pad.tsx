import React from 'react';
import { Pressable, StyleSheet, TouchableHighlightProps, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
    root: {
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
});

interface PadProps extends TouchableHighlightProps {
    hidden?: boolean;
    children?: any;
}

const Pad: React.FC<PadProps> = ({ style, children, hidden, ...props }: PadProps) => {
    const isPressed = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(isPressed.value, [0, 1], [1, 0.8]);

        return {
            transform: [{ scale }],
        };
    });

    return (
        <View style={styles.root}>
            <AnimatedPressable
                onPressIn={() => (isPressed.value = withSpring(1, { stiffness: 250, damping: 15 }))}
                onPressOut={() => (isPressed.value = withSpring(0, { stiffness: 250, damping: 15 }))}
                style={[
                    styles.container,
                    style,
                    {
                        display: hidden ? 'none' : 'flex',
                    },
                    animatedStyles,
                ]}
                {...props}
            >
                {children}
            </AnimatedPressable>
        </View>
    );
};

export default Pad;
