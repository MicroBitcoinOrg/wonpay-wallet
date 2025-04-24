import React, {memo} from 'react';
import {
    StyleSheet,
    TouchableHighlightProps,
    useColorScheme,
    View,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Coin, HStack, Text, VStack} from '../../../../components/common';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Config from 'react-native-config';
import moment from 'moment';
import {Colors} from '../../../../theme';
import NumberFormat from 'react-number-format';
import useAppStore from '../../../../store/appStore';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    iconContainer: {
        marginRight: 10,
        borderRadius: 35,
        width: 35,
        height: 35,
    },
    fromContainer: {
        width: '60%',
    },
    coinContainer: {
        marginBottom: 0,
    },
});

interface TransactionItemProps extends TouchableHighlightProps {
    transaction: Wallet.Transaction;
}

const TransactionItem = memo(
    ({transaction, style, ...props}: TransactionItemProps) => {
        const scheme = useColorScheme();

        const store = useAppStore();
        const addressItem = store.addressBook.find(
            (addressItemToFind: Wallet.AddressBook) =>
                transaction.type === 'sent'
                    ? addressItemToFind.address === transaction.to
                    : addressItemToFind.address === transaction.from,
        );

        const getTitleFromAdressBook = () => {
            return addressItem
                ? addressItem.title
                : transaction.type === 'sent'
                ? transaction.to
                : transaction.from;
        };

        return (
            /*@ts-ignore*/
            <TouchableHighlight underlayColor={Colors[scheme!].card} {...props}>
                <HStack
                    justifyContent="space-between"
                    style={[
                        styles.container,
                        {
                            borderBottomWidth: 1,
                            borderColor: Colors[scheme!].border,
                            opacity: transaction.confirmations === 0 ? 0.5 : 1,
                        },
                    ]}>
                    <HStack flex={1} justifyContent="flex-start">
                        <HStack
                            style={[
                                styles.iconContainer,
                                {backgroundColor: Colors[scheme!].card},
                            ]}>
                            {transaction.confirmations === 0 && (
                                <EntypoIcon
                                    name="dots-three-horizontal"
                                    size={20}
                                    color={Colors[scheme!].textSecondary}
                                />
                            )}
                            {transaction.type === 'sent' &&
                                transaction.confirmations !== 0 && (
                                    <Ionicon
                                        name="arrow-up-outline"
                                        size={20}
                                        color={Colors[scheme!].textSecondary}
                                    />
                                )}
                            {transaction.type === 'received' &&
                                transaction.confirmations !== 0 && (
                                    <Ionicon
                                        name="arrow-down"
                                        size={20}
                                        color={Colors[scheme!].textSecondary}
                                    />
                                )}
                        </HStack>
                        <View style={styles.fromContainer}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="middle"
                                opacity={
                                    transaction.confirmations === 0 ? 0.5 : 1
                                }
                                variant="body1">
                                {transaction.type === 'sent'
                                    ? 'Sent'
                                    : 'Received'}
                            </Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="middle"
                                color="textSecondary"
                                opacity={
                                    transaction.confirmations === 0 ? 0.5 : 1
                                }
                                variant="sub1">
                                {getTitleFromAdressBook()}
                            </Text>
                        </View>
                    </HStack>
                    <VStack alignItems="flex-end">
                        <HStack justifyContent="flex-start">
                            <NumberFormat
                                displayType="text"
                                value={
                                    transaction.amount /
                                    10 ** transaction.currency.units
                                }
                                decimalScale={2}
                                prefix={transaction.type === 'sent' ? '-' : '+'}
                                suffix={` ${transaction.currency.ticker}`}
                                thousandSeparator
                                fixedDecimalScale
                                renderText={value => (
                                    <Text variant="body1" fontWeight="500">
                                        {value}
                                    </Text>
                                )}
                            />
                        </HStack>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            color="textSecondary"
                            opacity={transaction.confirmations === 0 ? 0.5 : 1}
                            variant="sub1">
                            {moment(transaction.time * 1000).format(
                                'D MMM YYYY',
                            )}
                        </Text>
                    </VStack>
                </HStack>
            </TouchableHighlight>
        );
    },
);

export default TransactionItem;
