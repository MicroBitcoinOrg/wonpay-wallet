import * as React from 'react';
import { StatusBar, StatusBarProps, useColorScheme } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '../../theme';

interface FocusAwareStatusBarProps extends StatusBarProps {
    backgroundColor?: any;
}

const FocusAwareStatusBar: React.FC<StatusBarProps> = ({ backgroundColor, ...props }: FocusAwareStatusBarProps) => {
    const scheme = useColorScheme();
    const isFocused = useIsFocused();

    return isFocused ? <StatusBar backgroundColor={backgroundColor || Colors[scheme!].primary} {...props} /> : null;
};

export default FocusAwareStatusBar;
