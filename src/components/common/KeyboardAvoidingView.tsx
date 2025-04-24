import React from 'react';
import {
    KeyboardAvoidingView as NativeKeyboardAvoidingView,
    KeyboardAvoidingViewProps as NativeKeyboardAvoidingViewProps,
    Platform,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

interface KeyboardAvoidingViewProps extends NativeKeyboardAvoidingViewProps {
    children: React.ReactNode | React.ReactNode[];
}

const KeyboardAvoidingView = ({ children, keyboardVerticalOffset, style }: KeyboardAvoidingViewProps) => {
    const headerHeight = useHeaderHeight();

    return (
        <NativeKeyboardAvoidingView
            style={style}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={keyboardVerticalOffset !== undefined ? keyboardVerticalOffset : headerHeight}
        >
            {children}
        </NativeKeyboardAvoidingView>
    );
};

export default KeyboardAvoidingView;
