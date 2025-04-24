import React from 'react';
import { StyleSheet, useColorScheme, View, ViewProps } from 'react-native';
import { Colors } from '../../theme';

const styles = StyleSheet.create({
    divider: {
        width: 50,
        height: 6,
        borderRadius: 10,
    },
});

interface DividerProps extends ViewProps {}

const Divider: React.FC<DividerProps> = ({ style }) => {
    const scheme = useColorScheme();

    return <View style={[styles.divider, { backgroundColor: Colors[scheme!].card }, style]} />;
};

Divider.defaultProps = {};

export default Divider;
