import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { HStack, Text } from '../common';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
});

interface FormItemProps extends ViewProps {
    title: string;
    optional?: boolean;
    description?: string | ReactNode;
    children: ReactNode;
}

const FormItem = ({ title, optional, style, children, description, ...props }: FormItemProps) => {
    const { t } = useTranslation();

    return (
        <View style={[styles.container, style]} {...props}>
            <HStack justifyContent={description ? 'space-between' : 'flex-start'} alignItems="center">
                <HStack alignItems="center" style={{ gap: 4 }}>
                    <Text variant="body1">{title}</Text>
                    {optional && (
                        <Text variant="body3" opacity={0.5}>
                            {t('optional')}
                        </Text>
                    )}
                </HStack>
                {description &&
                    (typeof description === 'string' ? (
                        <Text variant="body1" color="textSecondary">
                            {description}
                        </Text>
                    ) : (
                        description
                    ))}
            </HStack>
            {children}
        </View>
    );
};

export default FormItem;
