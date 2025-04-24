import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types';
import { StackCardInterpolatedStyle, StackCardInterpolationProps } from '@react-navigation/stack';
import { Animated } from 'react-native';

const { multiply } = Animated;

export const springTransitionSpecConfig = {
    stiffness: 900,
    damping: 75,
    mass: 2.5,
    overshootClamping: false,
    restDisplacementThreshold: 4,
    restSpeedThreshold: 4,
};

export const springTransitionSpec: TransitionSpec = {
    animation: 'spring',
    config: springTransitionSpecConfig,
};

export const gestureTransitionSpec: TransitionSpec = {
    animation: 'spring',
    config: {
        stiffness: 1100,
        damping: 200,
        mass: 2.5,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
    },
};

export const iosTransitionSpec: TransitionSpec = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
    },
};

export function forFullSlideLeftSpring({
    current,
    next,
    inverted,
    layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
    const translateFocused = multiply(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screen.width, 0],
            extrapolate: 'extend',
        }),
        inverted,
    );

    const translateUnfocused = next
        ? multiply(
              next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, screen.width * -1],
                  extrapolate: 'extend',
              }),
              inverted,
          )
        : 0;

    return {
        cardStyle: {
            // Disappearing effect
            transform: [
                // Translation for the animation of the current card
                { translateX: translateFocused },
                // Translation for the animation of the card on top of this
                { translateX: translateUnfocused },
            ],
        },
    };
}

export function forFullSlideLeftSpringWithClampingOnBack({
    current,
    next,
    inverted,
    layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
    const translateFocused = multiply(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screen.width, 0],
            extrapolate: 'extend',
        }),
        inverted,
    );

    const translateUnfocused = next
        ? multiply(
              next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, screen.width * -1],
                  extrapolate: inverted ? 'clamp' : 'extend',
              }),
              inverted,
          )
        : 0;

    return {
        cardStyle: {
            // Disappearing effect
            transform: [
                // Translation for the animation of the current card
                { translateX: translateFocused },
                // Translation for the animation of the card on top of this
                { translateX: translateUnfocused },
            ],
        },
    };
}

export const defaultOptions = {
    // cardStyleInterpolator: forFullSlideLeftSpring,
    // transitionSpec: {
    //     open: springTransitionSpec,
    //     close: springTransitionSpec,
    // },
};
