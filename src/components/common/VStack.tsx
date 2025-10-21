import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
});

interface VStackProps extends ViewStyle {
    children: any;
    style?: StyleProp<ViewStyle>;
}

const VStack: React.FC<VStackProps> = ({
    children,
    style,
    alignItems = 'flex-start',
    justifyContent = 'flex-start',
    flex = 0,
    ...props
}: VStackProps) => (
    <View
        style={[
            styles.container,
            {alignItems, justifyContent, flex, ...props},
            style,
        ]}>
        {children}
    </View>
);

export default VStack;
