import React from 'react';
import {StyleSheet, useColorScheme, View, ViewProps} from 'react-native';
import {Text} from '../common';
import {Colors} from '../../theme';

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
});

interface BadgeProps extends ViewProps {
    label: string;
    color?: 'success' | 'warning' | 'error' | 'primary' | 'secondary';
}

const Badge = ({label, color = 'primary', style, ...props}: BadgeProps) => {
    const scheme = useColorScheme();

    const getBackgroundColor = () => {
        switch (color) {
            case 'success':
                return Colors[scheme!].success;
            case 'warning':
                return Colors[scheme!].warning;
            case 'error':
                return Colors[scheme!].error;
            case 'primary':
                return Colors[scheme!].primary;
            case 'secondary':
                return Colors[scheme!].textSecondary;
            default:
                return Colors[scheme!].primary;
        }
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: getBackgroundColor()},
                style,
            ]}
            {...props}>
            <Text
                textTransform="capitalize"
                variant="sub1"
                color="white"
                align="center">
                {label}
            </Text>
        </View>
    );
};

export default Badge;
