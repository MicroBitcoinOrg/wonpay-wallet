import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface HStackProps {
    children?: any;
    style?: StyleProp<ViewStyle>;
    flex?: number | undefined;
    alignItems?: 'flex-end' | 'flex-start' | 'center';
    justifyContent?: 'flex-end' | 'flex-start' | 'space-between' | 'center';
}

const HStack: React.FC<HStackProps> = ({
    children,
    style,
    alignItems = 'center',
    justifyContent = 'center',
    flex,
}: HStackProps) => <View style={[styles.container, { alignItems, justifyContent, flex }, style]}>{children}</View>;

export default HStack;
