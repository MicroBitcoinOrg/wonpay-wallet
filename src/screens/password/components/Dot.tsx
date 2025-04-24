import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: 'white',
    },
    dot: {
        backgroundColor: 'white',
        borderRadius: 15,
        height: 15,
        width: 15,
    },
});

interface DotProps extends ViewProps {
    filled?: boolean;
}

const Dot: React.FC<DotProps> = ({ filled, style }) => {
    const filling = useDerivedValue(() => {
        return withTiming(filled ? 1 : 0, { duration: 125 });
    });

    const animatedContainerStyles = useAnimatedStyle(() => {
        const opacity = interpolate(filling.value, [0, 1], [0.5, 1]);

        return {
            opacity,
        };
    });

    const animatedDotStyles = useAnimatedStyle(() => {
        const opacity = interpolate(filling.value, [0, 1], [0, 1]);
        const translateY = interpolate(filling.value, [0, 1], [-50, 0]);

        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    return (
        <Animated.View style={[styles.container, animatedContainerStyles, style]}>
            <Animated.View style={[styles.dot, animatedDotStyles]} />
        </Animated.View>
    );
};

export default Dot;
