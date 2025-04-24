import React, { useEffect, useRef } from 'react';
import { Modal, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import LottieView, { AnimationObject } from 'lottie-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    animationStyle: {
        height: 100,
        width: 100,
    },
});

interface Props extends ViewProps {
    visible: boolean;
    overlayColor: string;
    animationType: 'none' | 'slide' | 'fade';
    source:
        | string
        | AnimationObject
        | {
              uri: string;
          }
        | undefined;
    animationStyle: StyleProp<ViewStyle>;
    speed: number;
    loop?: boolean;
}

const Component = (props: Props) => {
    const defaultProps = {
        visible: false,
        overlayColor: 'rgba(0, 0, 0, 0.25)',
        animationType: 'none',
        source: undefined,
        animationStyle: {},
        speed: 1,
        loop: true,
    };
    const { children, visible, overlayColor, animationType, speed, source, animationStyle, loop } = {
        ...defaultProps,
        ...props,
    };

    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.play();
        }
    }, []);

    const _renderLottie = () => {
        return (
            <LottieView
                source={source}
                autoPlay
                ref={animationRef}
                loop={loop}
                speed={speed}
                style={[styles.animationStyle, animationStyle]}
            />
        );
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType={animationType}
            supportedOrientations={['portrait']}
            onRequestClose={() => {}}
        >
            <View style={[styles.container, { backgroundColor: overlayColor }]}>
                {_renderLottie()}
                {children}
            </View>
        </Modal>
    );
};

export default Component;
