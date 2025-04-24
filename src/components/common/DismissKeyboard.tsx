import React from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

interface DismissKeyboardProps {
    children: any;
}

const DismissKeyboard: React.FC<DismissKeyboardProps> = ({ children }: DismissKeyboardProps) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

export default DismissKeyboard;
