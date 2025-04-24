import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, useColorScheme, View, ViewProps } from 'react-native';
import { Text } from './index';
import { Colors } from '../../theme';

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mdSizeContainer: {
        width: 45,
        height: 45,
    },
    smSizeContainer: {
        width: 35,
        height: 35,
    },
});

interface AvatarProps extends ViewProps {
    backgroundColor?: (keyof typeof Colors.dark & keyof typeof Colors.light) | string;
    color?: keyof typeof Colors.dark & keyof typeof Colors.light;
    title?: string;
    source?: ImageSourcePropType;
    size?: 'md' | 'sm';
    style?: Record<string, any>;
}

const Avatar: React.FC<AvatarProps> = ({
    style,
    size,
    backgroundColor,
    color,
    source,
    title,
    children,
    ...props
}: AvatarProps) => {
    const scheme = useColorScheme();

    return !source ? (
        <View
            style={[
                styles.container,
                size === 'md' ? styles.mdSizeContainer : styles.smSizeContainer,
                style,
                {
                    backgroundColor: backgroundColor
                        ? Object.keys(Colors[scheme!]).some((k) => k === backgroundColor)
                            ? Colors[scheme!][backgroundColor as keyof typeof Colors.dark & keyof typeof Colors.light]
                            : backgroundColor
                        : backgroundColor,
                },
            ]}
            {...props}
        >
            <Text textTransform="uppercase" variant={size === 'md' ? 'h3' : 'body2'} color={color}>
                {title ? title[0] : children}
            </Text>
        </View>
    ) : (
        <Image
            source={source}
            style={[styles.container, size === 'md' ? styles.mdSizeContainer : styles.smSizeContainer, style]}
        />
    );
};

Avatar.defaultProps = {
    backgroundColor: 'white',
    color: 'black',
    size: 'md',
};

export default Avatar;
