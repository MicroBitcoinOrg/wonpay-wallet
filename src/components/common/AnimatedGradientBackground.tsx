import React, {useEffect, ReactNode} from 'react';
import {Dimensions, StyleSheet, View, ViewProps} from 'react-native';
import Svg, {
    Defs,
    LinearGradient as SvgLinearGradient,
    Stop,
    Rect,
} from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    withRepeat,
    interpolate,
    interpolateColor,
} from 'react-native-reanimated';
import {useIsFocused} from '@react-navigation/native';

// Робимо анімовані компоненти з react-native-svg
const AnimatedDefs = Animated.createAnimatedComponent(Defs);
const AnimatedLinearGradient =
    Animated.createAnimatedComponent(SvgLinearGradient);

interface AnimatedGradientBackgroundProps extends ViewProps {
    colors: [string, string]; // [колір X, колір Y]
    duration?: number; // тривалість одного переходу (мс)
    children?: ReactNode; // вміст поверх фону
    animated?: boolean; // анімувати колір
}

const {width, height} = Dimensions.get('window');

export function AnimatedGradientBackground({
    colors,
    duration = 3000,
    children,
    style,
    animated = false,
    ...rest
}: AnimatedGradientBackgroundProps) {
    // progress від 0 до 1
    const progress = useSharedValue(animated ? 0 : 1);
    const isFocused = useIsFocused();

    // Анімовані властивості для coords: з (x,y)->(y,x)
    const animatedProps = useAnimatedProps(() => {
        // беремо від 0 до 1, інтерполюємо у відсотки
        const x = interpolate(progress.value, [0, 1], [0, 100]);
        const y = 100 - x;
        return {
            // start: (x%, y%)  →  end: (y%, x%)
            x1: `${x}%`,
            y1: `${y}%`,
            x2: `${y}%`,
            y2: `${x}%`,
        };
    });

    useEffect(() => {
        if (animated) {
            if (isFocused) {
                progress.value = withTiming(1, {duration: 1500});
            } else {
                progress.value = withTiming(0, {duration: 1500});
            }
        }
    }, [isFocused]);

    return (
        <View style={[styles.container, style]} {...rest}>
            <Svg
                style={[
                    StyleSheet.absoluteFill,
                    {
                        width,
                        height,
                    },
                ]}>
                <AnimatedDefs>
                    <AnimatedLinearGradient
                        id="animGrad"
                        animatedProps={animatedProps}>
                        <Stop offset="0%" stopColor={colors[0]} />
                        <Stop offset="100%" stopColor={colors[1]} />
                    </AnimatedLinearGradient>
                </AnimatedDefs>
                <Rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#animGrad)"
                />
            </Svg>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
});
