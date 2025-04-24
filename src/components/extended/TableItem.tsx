import React from 'react';
import {
    StyleSheet,
    TouchableHighlightProps,
    useColorScheme,
    View,
} from 'react-native';
import {HStack, Text} from '../common';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Colors} from '../../theme';

const styles = StyleSheet.create({
    container: {
        padding: 20,
        minHeight: 60,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconContainer: {
        marginRight: 10,
    },
});

interface TableItemProps extends TouchableHighlightProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    bottomDivider?: boolean;
    color?:
        | 'textPrimary'
        | 'textSecondary'
        | 'primary'
        | 'secondary'
        | 'white'
        | 'black';
    rightContent?: React.ReactNode;
    leftContent?: React.ReactNode;
}

const TableItem: React.FC<TableItemProps> = ({
    style,
    icon,
    title,
    color,
    subtitle,
    bottomDivider,
    rightContent,
    leftContent,
    underlayColor,
    onPress,
    ...props
}: TableItemProps) => {
    const scheme = useColorScheme();

    const children = (
        <View
            style={[
                styles.container,
                style,
                bottomDivider && {
                    borderBottomWidth: 1,
                    borderColor: Colors[scheme!].border,
                },
            ]}>
            {leftContent}
            <HStack
                flex={1}
                justifyContent="flex-start"
                style={{
                    marginLeft: leftContent ? 5 : 0,
                    marginRight: rightContent ? 5 : 0,
                }}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <View>
                    <Text variant="body2" color={color}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text variant="sub1" opacity={0.5}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </HStack>
            {rightContent}
        </View>
    );

    if (onPress) {
        return (
            <TouchableHighlight
                // @ts-ignore
                onPress={onPress}
                {...props}
                underlayColor={
                    underlayColor ? underlayColor : Colors[scheme!].card
                }>
                {children}
            </TouchableHighlight>
        );
    }

    // @ts-ignore
    return <View {...props}>{children}</View>;
};

TableItem.defaultProps = {
    color: 'textPrimary',
    leftContent: <View />,
};

export default TableItem;
