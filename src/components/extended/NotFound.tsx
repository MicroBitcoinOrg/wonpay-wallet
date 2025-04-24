import React from 'react';
import { Image, StyleSheet, ViewProps } from 'react-native';
import { Text, VStack } from '../common';

interface ContainerProps extends ViewProps {
    description: string;
    size?: 'sm' | 'md';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mdNotFoundImage: {
        width: '100%',
        height: 200,
        marginBottom: 40,
    },
    smNotFoundImage: {
        width: '100%',
        height: 150,
        marginBottom: 20,
    },
});

const NotFound = ({ style, size, description, ...props }: ContainerProps) => {
    return (
        <VStack style={[styles.container, style]} {...props}>
            <Image
                resizeMode="contain"
                style={size === 'sm' ? styles.smNotFoundImage : styles.mdNotFoundImage}
                source={require('../../assets/no-history.png')}
            />
            <Text variant="body1" color="textSecondary">
                {description}
            </Text>
        </VStack>
    );
};

NotFound.defaultProps = {
    size: 'md',
};

export default NotFound;
