import React, {useState} from 'react';
import {
    ColorValue,
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedback,
    useColorScheme,
    ViewStyle,
} from 'react-native';
import DateTimePickerModal, {
    DateTimePickerProps,
} from 'react-native-modal-datetime-picker';
import {Colors, Typography} from '../../theme';
import {Text} from '../common';
import Animated, {
    AnimatedStyle,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    withTiming,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(
    TouchableWithoutFeedback,
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 40,
        borderBottomWidth: 1,
        color: 'black',
        alignItems: 'center',
        marginTop: 5,
        padding: 5,
    },
    inputContainer: {
        flex: 1,
    },
});

interface InputProps extends BaseProps, TextInputProps {
    rightContent?: React.ReactNode | React.ReactNode[];
    bottomContent?: React.ReactNode | React.ReactNode[];
    flex?: 1 | 0;
    onPress?: () => void;
    onLongPress?: () => void;
}

interface DateProps extends BaseProps, DateTimePickerProps {
    value?: any;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
}

interface BaseProps {
    children?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'white' | 'black' | 'textPrimary';
    size?: 'md' | 'lg';
    onPress?: () => void;
    onLongPress?: () => void;
    flex?: 1 | 0;
    isFocused?: boolean;
    rightContent?: React.ReactNode | React.ReactNode[];
    bottomContent?: React.ReactNode | React.ReactNode[];
    baseStyle?: AnimatedStyle<ViewStyle>;
}

const Base = ({
    children,
    color,
    onPress,
    onLongPress,
    flex,
    isFocused,
    bottomContent,
    rightContent,
    baseStyle,
}: BaseProps) => {
    const scheme = useColorScheme();
    const filling = useDerivedValue(() => {
        return withTiming(isFocused ? 1 : 0, {duration: 100});
    });

    const animatedInputStyles = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            filling.value,
            [0, 1],
            [
                color === 'white'
                    ? 'rgba(256, 256, 256, 0.5)'
                    : Colors[scheme!].border,
                color === 'white'
                    ? Colors[scheme!].white
                    : scheme === 'dark'
                    ? Colors[scheme!].textPrimary
                    : Colors[scheme!].primary,
            ],
        );

        return {
            borderColor,
        };
    });

    return (
        <AnimatedTouchable onPress={onPress} onLongPress={onLongPress}>
            <Animated.View
                style={[
                    styles.container,
                    {
                        flex,
                        // @ts-ignore
                        color: color && Colors[scheme!][color],
                        borderColor:
                            color === 'white'
                                ? Colors[scheme!].white
                                : Colors[scheme!].border,
                        borderRadius: 10,

                        flexDirection: bottomContent ? 'column' : 'row',
                        // backgroundColor: Colors[scheme!].card,
                    },
                    animatedInputStyles,
                    baseStyle,
                ]}>
                {children}
                {rightContent}
                {bottomContent}
            </Animated.View>
        </AnimatedTouchable>
    );
};

export const Input = ({
    color,
    size,
    editable,
    style,
    value,
    placeholder,
    placeholderTextColor,
    onBlur,
    ...props
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const scheme = useColorScheme();

    return (
        <Base isFocused={isFocused} {...props}>
            <TextInput
                style={[
                    styles.inputContainer,
                    {
                        color: color
                            ? Colors[scheme!][color]
                            : Colors[scheme!].textPrimary,
                        opacity: editable ? 1 : 0.5,
                    },
                    size === 'lg' ? Typography.h3 : Typography.body2,
                    style,
                ]}
                onBlur={e => {
                    setIsFocused(false);
                    onBlur !== undefined && onBlur(e);
                }}
                onFocus={() => setIsFocused(true)}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                editable={editable}
                {...props}
            />
        </Base>
    );
};

Input.defaultProps = {
    editable: true,
    clearButtonMode: 'while-editing',
    placeholderTextColor: 'gray',
};

export const InputDate = ({
    value,
    color,
    size,
    placeholder,
    placeholderTextColor,
    ...props
}: DateProps) => {
    return (
        <Base {...props}>
            <DateTimePickerModal {...props} />
            {value !== undefined && value !== '' && (
                <Text
                    variant={size === 'lg' ? 'h3' : 'body2'}
                    color={color}
                    style={[styles.inputContainer]}>
                    {value}
                </Text>
            )}
            {!value && (
                <Text
                    variant={size === 'lg' ? 'h3' : 'body2'}
                    style={[
                        styles.inputContainer,
                        {color: placeholderTextColor},
                    ]}>
                    {placeholder}
                </Text>
            )}
        </Base>
    );
};

InputDate.defaultProps = {
    placeholderTextColor: 'gray',
};
