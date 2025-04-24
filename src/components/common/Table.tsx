import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginHorizontal: -20,
        flex: 0,
    },
});

interface TableProps extends ViewProps {
    children: ReactNode | ReactNode[];
    scrollView?: boolean;
    flex?: 0 | 1;
}

const Table = ({ children, scrollView, flex, style, ...props }: TableProps) => {
    if (scrollView) {
        return (
            <ScrollView style={[styles.container, { flex }, style]} {...props}>
                {children}
            </ScrollView>
        );
    }

    return (
        <View style={[styles.container, { flex }, style]} {...props}>
            {children}
        </View>
    );
};

export default Table;
