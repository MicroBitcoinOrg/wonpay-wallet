import React from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {Text} from '../../../components/common';
import {Colors} from '../../../theme';

const styles = StyleSheet.create({
    container: {
        borderRadius: 2,
        borderColor: 'rgba(256,256,256, 0.5)',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        minHeight: 50,
    },
    wordText: {
        flex: 1,
    },
});

interface SeedWordProps {
    number: number;
    word?: string;
    style?: any;
    onNextSeed?: any;
}

const SeedWord = ({number, word, style}: SeedWordProps) => {
    const scheme = useColorScheme();

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor:
                        word === '' || word === undefined
                            ? Colors[scheme!].textSecondary
                            : Colors[scheme!].border,
                },
                style,
            ]}>
            <Text variant="body3" color="textSecondary">
                {number}.
            </Text>
            <Text
                variant="body1"
                color="textPrimary"
                align="center"
                style={styles.wordText}
                selectable
                numberOfLines={1}>
                {word}
            </Text>
        </View>
    );
};

export default SeedWord;
