import React, {ForwardedRef} from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    useColorScheme,
    View,
} from 'react-native';
import {Text} from '../../../components/common';
import {Colors, Typography} from '../../../theme';

const styles = StyleSheet.create({
    container: {
        borderRadius: 2,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        minHeight: 50,
    },
    wordText: {
        flex: 1,
        textAlign: 'center',
    },
});

interface SeedWordInputProps extends TextInputProps {
    number: number;
    style?: any;
}

const SeedWordInput = React.forwardRef<TextInput, SeedWordInputProps>(
    ({number, style, value, ...props}, ref) => {
        const scheme = useColorScheme();

        return (
            <View
                style={[
                    styles.container,
                    {
                        borderColor:
                            value === '' || value === undefined
                                ? Colors[scheme!].border
                                : Colors[scheme!].textPrimary,
                    },
                    style,
                ]}>
                <Text variant="body3" color="textSecondary">
                    {number}.
                </Text>
                <TextInput
                    style={[
                        styles.wordText,
                        Typography.body1,
                        {color: Colors[scheme!].textPrimary},
                    ]}
                    value={value}
                    ref={ref}
                    {...props}
                />
            </View>
        );
    },
);

export default SeedWordInput;
