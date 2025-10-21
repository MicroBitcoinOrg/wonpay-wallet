import React, {useEffect} from 'react';
import {Dimensions, Pressable, StyleSheet, useColorScheme} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Colors} from '../../theme';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {IconButton} from './index';
import {Text} from '../common';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 20,
        position: 'absolute',
        bottom: 30,
        backgroundColor: 'black',
        borderRadius: 15,
    },
    slidingTabContainer: {
        width: 45,
        height: 45,
        ...StyleSheet.absoluteFillObject,
        top: 7,
        borderRadius: 10,
        opacity: 1,
        backgroundColor: 'gray',
    },
    openLeftTabContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        height: 60,
        width: 25,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    openRightTabContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        height: 60,
        width: 25,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },
});

const width = Dimensions.get('window').width;
const tabLeftEdge = -(width / 2) - 110;
const tabRightEdge = width / 2 + 110;

interface Props extends BottomTabBarProps {}

const TabBar: React.FC<Props> = ({state, descriptors, navigation}) => {
    const scheme = useColorScheme();
    const currentSlide = useSharedValue(state.index);
    const x = useSharedValue(0);

    const animatedSlidingStyles = useAnimatedStyle(() => {
        const translateX = interpolate(
            currentSlide.value,
            [0, 1, 2, 4],
            [8, 68, 128, 248],
        );

        return {
            transform: [{translateX}],
        };
    });

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = x.value;
        },
        onActive: (event, ctx) => {
            x.value = (ctx.startX as number) + event.translationX;
        },
        onEnd: event => {
            if (event.translationX < -(width / 4)) {
                x.value = withSpring(tabLeftEdge, {
                    stiffness: 200,
                    damping: 15,
                });
            } else if (event.translationX > (width * 3) / 4) {
                x.value = withSpring(tabRightEdge, {
                    stiffness: 200,
                    damping: 15,
                });
            } else {
                x.value = withSpring(0, {stiffness: 200, damping: 15});
            }
        },
    });

    const animatedTabBarStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: x.value,
                },
            ],
        };
    });

    const animatedOpenLeftTabStyles = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [tabLeftEdge, tabLeftEdge + 25],
            [1, 0],
        );
        const backgroundColor = interpolateColor(
            x.value,
            [tabLeftEdge + 25, tabLeftEdge],
            [Colors[scheme!].card, Colors[scheme!].primaryLight],
        );

        return {
            opacity,
            backgroundColor,
        };
    });

    const animatedOpenRightTabStyles = useAnimatedStyle(() => {
        const opacity = interpolate(
            x.value,
            [tabRightEdge, tabRightEdge - 25],
            [1, 0],
        );
        const backgroundColor = interpolateColor(
            x.value,
            [tabRightEdge - 25, tabRightEdge],
            [Colors[scheme!].card, Colors[scheme!].primaryLight],
        );

        return {
            opacity,
            backgroundColor,
        };
    });

    useEffect(() => {
        currentSlide.value = withSpring(state.index, {
            stiffness: 200,
            damping: 15,
        });
    }, [state.index]);

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
                style={[
                    styles.container,
                    {backgroundColor: Colors[scheme!].card},
                    animatedTabBarStyles,
                ]}>
                <Animated.View
                    style={[
                        styles.slidingTabContainer,
                        {backgroundColor: Colors[scheme!].primary},
                        animatedSlidingStyles,
                    ]}
                />

                <Animated.View
                    style={[
                        styles.openLeftTabContainer,
                        animatedOpenLeftTabStyles,
                    ]}>
                    <IconButton
                        iconSet="entypo"
                        name="chevron-thin-right"
                        iconColor={Colors[scheme!].primaryContrast}
                        onPress={() => (x.value = withSpring(0))}
                        transparent
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.openRightTabContainer,
                        animatedOpenRightTabStyles,
                    ]}>
                    <IconButton
                        iconSet="entypo"
                        name="chevron-thin-left"
                        iconColor={Colors[scheme!].primaryContrast}
                        onPress={() => (x.value = withSpring(0))}
                        transparent
                    />
                </Animated.View>
                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({
                                name: route.name,
                                params: undefined,
                                merge: true,
                            });
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <Pressable
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={
                                isFocused ? {selected: true} : {}
                            }
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                            onPress={onPress}
                            style={{
                                height: 65,
                                width: 80,
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 4,
                            }}
                            onLongPress={onLongPress}>
                            {options.tabBarIcon &&
                                options.tabBarIcon({
                                    focused: isFocused,
                                    color: isFocused
                                        ? Colors[scheme!].white
                                        : Colors[scheme!].textSecondary,
                                    size: 24,
                                })}
                            <Text
                                variant="sub1"
                                color={isFocused ? 'white' : 'textSecondary'}>
                                {options.title}
                            </Text>
                        </Pressable>
                    );
                })}
            </Animated.View>
        </PanGestureHandler>
    );
};

export default TabBar;
