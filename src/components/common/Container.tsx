import React, {ReactNode} from 'react';
import {
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    useColorScheme,
    View,
    ViewStyle,
} from 'react-native';
import Config from 'react-native-config';
import {Colors} from '@/theme';
import {AnimatedGradientBackground} from './AnimatedGradientBackground';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ContainerProps
    extends Omit<
        ViewStyle,
        'paddingBottom' | 'paddingTop' | 'paddingHorizontal'
    > {
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
    style?: ViewStyle | ViewStyle[];
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

const Container = ({
    paddingHorizontal = true,
    paddingTop = false,
    paddingBottom = false,
    gradient,
    backgroundImage,
    scrollable,
    transparent,
    safeArea,
    header = true,
    children,
    style,
    areaStyle,
    flex,
    animated,
    ...props
}: ContainerProps) => {
    const scheme = useColorScheme();
    const {bottom} = useSafeAreaInsets();

    const containerStyles = {
        backgroundColor: transparent
            ? 'transparent'
            : Colors[scheme!].background,
        paddingHorizontal: paddingHorizontal ? PADDING_HORIZONTAL : 0,
        ...(paddingTop && {paddingTop: HEADER_HEIGHT}),
        ...(paddingBottom && {paddingBottom: bottom}),
        flex: flex !== undefined ? flex : 1,
    };

    const areaStyles = {marginTop: header ? 0 : HEADER_HEIGHT};

    return gradient ? (
        <AnimatedGradientBackground
            colors={['#000F92', '#0214B0']}
            style={[styles.container, containerStyles, style]}
            {...props}>
            {safeArea ? (
                <SafeAreaView
                    style={[styles.areaContainer, areaStyles, areaStyle]}>
                    {children}
                </SafeAreaView>
            ) : (
                children
            )}
        </AnimatedGradientBackground>
    ) : (
        <View style={[styles.container, containerStyles, props, style]}>
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

export default Container;
