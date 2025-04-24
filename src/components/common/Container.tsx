import React, {ReactNode, useEffect} from 'react';
import {
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    useColorScheme,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import Config from 'react-native-config';
import {Colors} from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    interpolateColor,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {useIsFocused} from '@react-navigation/native';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface ContainerProps extends ViewProps {
    paddingHorizontal?: boolean;
    paddingTop?: boolean;
    paddingBottom?: boolean;
    scrollable?: boolean;
    transparent?: boolean;
    gradient?: boolean;
    safeArea?: boolean;
    header?: boolean;
    children: ReactNode | ReactNode[];
    areaStyle?: ViewStyle;
    flex?: number;
    animated?: boolean;
    backgroundImage?: Image;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    areaContainer: {
        flex: 1,
        width: '100%',
        marginBottom: 60,
    },
});

const HEADER_HEIGHT = parseInt(
    Platform.OS === 'ios'
        ? Config.HEADER_HEIGHT_IOS
        : Config.HEADER_HEIGHT_ANDROID,
);
const PADDING_HORIZONTAL = 20;
const PADDING_BOTTOM = Platform.select({ios: 30, android: 10});

const Container = ({
    paddingHorizontal,
    paddingTop,
    paddingBottom,
    gradient,
    backgroundImage,
    scrollable,
    transparent,
    safeArea,
    header,
    children,
    style,
    areaStyle,
    flex,
    animated,
    ...props
}: ContainerProps) => {
    const scheme = useColorScheme();
    const isFocused = useIsFocused();
    const containerStyles = {
        backgroundColor: transparent
            ? 'transparent'
            : Colors[scheme!].background,
        paddingHorizontal: paddingHorizontal ? PADDING_HORIZONTAL : 0,
        paddingTop: paddingTop ? HEADER_HEIGHT : 0,
        paddingBottom: paddingBottom ? PADDING_BOTTOM : 0,
        flex: flex !== undefined ? flex : 1,
    };
    const linearGradientStyles = {
        ...containerStyles,
        backgroundColor: '#00665E',
    };
    const areaStyles = {marginTop: header ? 0 : HEADER_HEIGHT};

    const changing = useSharedValue(animated ? 0 : 1);
    const animatedProps = useAnimatedProps(() => {
        const cTop = interpolateColor(
            changing.value,
            [0, 1],
            ['#000F92', '#0214B0'],
        );
        const cBottom = interpolateColor(
            changing.value,
            [0, 1],
            ['#0214B0', '#000F92'],
        );

        return {
            colors: [cTop, cBottom],
        };
    });

    useEffect(() => {
        if (animated) {
            if (isFocused) {
                changing.value = withTiming(1, {duration: 1500});
            } else {
                changing.value = withTiming(0, {duration: 1500});
            }
        }
    }, [isFocused]);

    return gradient ? (
        <AnimatedLinearGradient
            colors={['#00665E', '#003B34']}
            animatedProps={animatedProps}
            angle={120}
            useAngle
            style={[styles.container, linearGradientStyles, style]}>
            {safeArea ? (
                <SafeAreaView
                    style={[styles.areaContainer, areaStyles, areaStyle]}>
                    {children}
                </SafeAreaView>
            ) : (
                children
            )}
        </AnimatedLinearGradient>
    ) : (
        <View style={[styles.container, containerStyles, style]} {...props}>
            {safeArea ? (
                <SafeAreaView style={[styles.areaContainer, areaStyles]}>
                    {children}
                </SafeAreaView>
            ) : (
                children
            )}
        </View>
    );
};

Container.defaultProps = {
    header: true,
    paddingHorizontal: true,
    paddingTop: false,
    paddingBottom: false,
};

export default Container;
