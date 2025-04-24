import React from 'react';
import { StyleSheet, useColorScheme, View, ViewProps } from 'react-native';
import { Text } from '../common';
import { Colors } from '../../theme';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 25,
    },
});

interface ChipProps extends ViewProps {
    title: string;
}

const Chip = ({ title, style, ...props }: ChipProps) => {
    const scheme = useColorScheme();

    return (
        <View style={[styles.container, { backgroundColor: Colors[scheme!].primary }, style]} {...props}>
            <Text textTransform="capitalize" variant="body3" color="white" align="center">
                {title}
            </Text>
        </View>
    );
};

export default Chip;
