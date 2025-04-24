import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface VStackProps {
    children: any;
    style?: StyleProp<ViewStyle>;
    flex?: number | undefined;
    alignItems?: 'flex-end' | 'flex-start' | 'center';
    justifyContent?: 'flex-end' | 'flex-start' | 'space-between' | 'center';
}

const VStack: React.FC<VStackProps> = ({
    children,
    style,
    alignItems = 'center',
    justifyContent = 'center',
    flex,
}: VStackProps) => <View style={[styles.container, { alignItems, justifyContent, flex }, style]}>{children}</View>;

export default VStack;
