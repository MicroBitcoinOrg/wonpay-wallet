import React from 'react';
import {StyleSheet, useColorScheme, View, ViewProps} from 'react-native';
import {Colors} from '../../theme';

const styles = StyleSheet.create({
    divider: {
        width: 30,
        height: 4,
        borderRadius: 4,
    },
});

interface DividerProps extends ViewProps {}

const Divider: React.FC<DividerProps> = ({style}) => {
    const scheme = useColorScheme();

    return (
        <View
            style={[
                styles.divider,
                {backgroundColor: Colors[scheme!].textSecondary},
                style,
            ]}
        />
    );
};

export default Divider;
