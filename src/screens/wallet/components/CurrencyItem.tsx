import React from 'react';
import {
    StyleSheet,
    TouchableHighlightProps,
    useColorScheme,
    View,
} from 'react-native';
import {Avatar, HStack, Text} from '../../../components/common';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Colors} from '../../../theme';
import NumberFormat from 'react-number-format';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        marginLeft: 10,
    },
    topContentContainer: {
        // marginBottom: 5,
    },
    favoriteContainer: {
        marginLeft: 10,
    },
});

interface CurrencyItemProps extends TouchableHighlightProps {
    balance?: Wallet.Balance;
}

const CurrencyItem = ({style, balance, ...props}: CurrencyItemProps) => {
    const scheme = useColorScheme();

    return (
        // @ts-ignore
        <TouchableHighlight underlayColor={Colors[scheme!].card} {...props}>
            <View
                style={[
                    styles.container,
                    {borderBottomWidth: 1, borderColor: Colors[scheme!].border},
                    style,
                ]}>
                <Avatar
                    title={balance?.currency.ticker}
                    backgroundColor="card"
                    color="textSecondary"
                />
                <View style={styles.contentContainer}>
                    <HStack
                        justifyContent="flex-start"
                        style={styles.topContentContainer}>
                        <Text variant="body1">{balance?.currency.ticker}</Text>
                    </HStack>
                    {balance !== undefined && (
                        <NumberFormat
                            displayType="text"
                            value={
                                balance.balance / 10 ** balance.currency.units
                            }
                            decimalScale={balance.currency.units}
                            suffix={` ${balance.currency.ticker}`}
                            thousandSeparator
                            fixedDecimalScale
                            renderText={value => (
                                <Text variant="body3" opacity={0.5}>
                                    {value}
                                </Text>
                            )}
                        />
                    )}
                </View>
            </View>
        </TouchableHighlight>
    );
};

export default CurrencyItem;
