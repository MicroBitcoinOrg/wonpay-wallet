import React, {useMemo, useState} from 'react';
import {
    ImageSourcePropType,
    StyleSheet,
    useColorScheme,
    View,
    ViewProps,
    StyleProp,
    ViewStyle,
    ImageProps,
} from 'react-native';
import {Image, Text} from './index';
import {Colors} from '../../theme';
import Typography, {TextVariant} from '../../theme/typography';

const sizeStyles = {
    md: {width: 45, height: 45, borderRadius: 22.5, padding: 10},
    sm: {width: 35, height: 35, borderRadius: 17.5, padding: 5},
    xs: {width: 20, height: 20, borderRadius: 10, padding: 3},
};

const textVariantBySize: Record<keyof typeof sizeStyles, TextVariant> = {
    md: 'h3',
    sm: 'body2',
    xs: 'body3',
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    additionalContainer: {
        position: 'absolute',
        borderRadius: 10,
        overflow: 'hidden',
        bottom: -2,
        right: -2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        width: 20,
        height: 20,
    },
});

interface AvatarProps extends ViewProps {
    backgroundColor?:
        | (keyof typeof Colors.dark & keyof typeof Colors.light)
        | string;
    color?: keyof typeof Colors.dark & keyof typeof Colors.light;
    title?: string;
    source?: ImageSourcePropType;
    size?: keyof typeof sizeStyles;
    style?: StyleProp<ViewStyle>;
    additional?: React.ReactNode;
    imageProps?: ImageProps;
}

const Avatar: React.FC<AvatarProps> = ({
    style,
    size = 'md',
    backgroundColor: bg,
    color = 'black',
    source,
    title,
    children,
    additional,
    imageProps,
    ...props
}) => {
    const scheme = useColorScheme() || 'light';
    const [imageError, setImageError] = useState(false);

    const containerStyle = useMemo(() => {
        const backgroundColor =
            bg && Colors[scheme]?.[bg as keyof typeof Colors.light]
                ? Colors[scheme][bg as keyof typeof Colors.light]
                : bg;

        return [
            styles.container,
            sizeStyles[size],
            {
                backgroundColor,
                borderColor: Colors[scheme].background,
            },
            style,
        ];
    }, [scheme, size, bg, style]);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <View>
            <View style={containerStyle} {...props}>
                {source && !imageError ? (
                    <Image
                        style={styles.image}
                        source={source}
                        onError={handleImageError}
                        resizeMode="contain"
                        {...imageProps}
                    />
                ) : (
                    <Text
                        textTransform="uppercase"
                        variant={textVariantBySize[size]}
                        color={color}>
                        {title ? title[0] : children}
                    </Text>
                )}
            </View>
            {additional && (
                <View
                    style={[
                        styles.additionalContainer,
                        {
                            backgroundColor: Colors[scheme].background,
                            borderColor: Colors[scheme].border,
                        },
                    ]}>
                    {additional}
                </View>
            )}
        </View>
    );
};

export default React.memo(Avatar);
