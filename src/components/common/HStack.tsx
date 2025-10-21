import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface HStackProps extends ViewStyle {
    children?: any;
    style?: StyleProp<ViewStyle>;
}

const HStack: React.FC<HStackProps> = ({
    children,
    style,
    alignItems = 'center',
    justifyContent = 'center',
    flex = 0,
    ...props
}: HStackProps) => (
    <View
        style={[
            styles.container,
            {alignItems, justifyContent, flex, ...props},
            style,
        ]}>
        {children}
    </View>
);

export default HStack;
