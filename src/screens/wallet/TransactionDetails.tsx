import React, {useContext, useEffect} from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {
    Coin,
    Container,
    FocusAwareStatusBar,
    HStack,
    Text,
    VStack,
} from '../../components/common';
import {Button, IconButton} from '../../components/extended';
import {Colors} from '../../theme';
import NumberFormat from 'react-number-format';
import useAppStore from '../../store/appStore';
import {WalletContext} from '../../providers';

const styles = StyleSheet.create({
    container: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        marginHorizontal: -20,
        height: '100%',
    },
    dividerContainer: {
        padding: 20,
    },
    titleContainer: {
        marginBottom: 15,
    },
    balanceContainer: {
        marginBottom: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    content: {
        marginTop: 5,
    },
    coinContainer: {
        marginBottom: 10,
    },
});

interface TransactionDetailsProps {
    navigation: any;
    route: any;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    navigation,
    route,
}: TransactionDetailsProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('transactionDetails');
    const {transaction} = route.params ?? {};
    const store = useAppStore();
    const {walletChain} = useContext(WalletContext);

    const getAddressItemFromAdressBook = () => {
        const addressItem = store.addressBook.find(
            (addressItemToFind: Wallet.AddressBook) =>
                transaction.type === 'sent'
                    ? addressItemToFind.address === transaction.to
                    : addressItemToFind.address === transaction.from,
        );
        return addressItem || undefined;
    };

    const addressItem = getAddressItemFromAdressBook();

    useEffect(() => {
        navigation.setOptions({
            title: transaction.type === 'sent' ? t('withdraw') : t('deposit'),
        });
    }, []);

    return (
        <Container gradient paddingTop>
            <FocusAwareStatusBar barStyle="light-content" />
            <View style={[{paddingBottom: 20}]}>
                <HStack justifyContent="space-between" alignItems="flex-end">
                    <View>
                        <HStack
                            style={styles.balanceContainer}
                            justifyContent="flex-start"
                            alignItems="flex-end">
                            <NumberFormat
                                displayType="text"
                                value={
                                    transaction.amount /
                                    10 ** transaction.currency.units
                                }
                                decimalScale={4}
                                prefix={transaction.type === 'sent' ? '-' : '+'}
                                suffix={` ${transaction.currency.ticker}`}
                                thousandSeparator
                                fixedDecimalScale
                                renderText={value => (
                                    <Text>
                                        <Text variant="number1" color="white">
                                            {value.split('.')[0]}
                                        </Text>
                                        <Text variant="number2" color="white">
                                            .{value.split('.')[1]}
                                        </Text>
                                    </Text>
                                )}
                            />
                        </HStack>
                        <Text variant="sub1" color="white" opacity={0.5}>
                            {moment(transaction.time * 1000).format('LLL')}
                        </Text>
                    </View>
                    <IconButton
                        iconColor="textPrimary"
                        name="link"
                        iconSet="ionicons"
                        onPress={() =>
                            Linking.openURL(
                                `${walletChain!.explorerLink}/transaction/${
                                    transaction.hash
                                }`,
                            )
                        }
                    />
                </HStack>
            </View>
            <Container style={styles.container} paddingBottom>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 90}}>
                    <VStack
                        flex={1}
                        style={[{paddingTop: 20}]}
                        justifyContent="flex-start"
                        alignItems="flex-start">
                        {transaction.to && (
                            <View style={styles.inputContainer}>
                                <Text variant="body1">{t('toAddress')}</Text>
                                <View style={styles.content}>
                                    <Text variant="body2" selectable>
                                        {transaction.to}
                                    </Text>
                                </View>
                            </View>
                        )}
                        {transaction.type === 'sent' && transaction.to && (
                            <Button
                                leftContent={
                                    <EntypoIcon
                                        name="plus"
                                        size={20}
                                        color="white"
                                    />
                                }
                                title={t('addToAddressBook')}
                                size="md"
                                color="primary"
                                style={{marginBottom: 10}}
                                disabled={addressItem !== undefined}
                                onPress={() =>
                                    navigation.navigate(
                                        'ManageAddressBookItem',
                                        {address: transaction.to},
                                    )
                                }
                            />
                        )}
                        {transaction.from && (
                            <View style={styles.inputContainer}>
                                <Text variant="body1">{t('fromAddress')}</Text>
                                <View style={styles.content}>
                                    <Text variant="body2" selectable>
                                        {transaction.from}
                                    </Text>
                                </View>
                            </View>
                        )}
                        {transaction.type === 'received' &&
                            transaction.from && (
                                <Button
                                    leftContent={
                                        <EntypoIcon
                                            name="plus"
                                            size={20}
                                            color="white"
                                        />
                                    }
                                    title={t('addToAddressBook')}
                                    size="md"
                                    color="primary"
                                    disabled={addressItem !== undefined}
                                    style={{marginBottom: 10}}
                                    onPress={() =>
                                        navigation.navigate(
                                            'ManageAddressBookItem',
                                            {address: transaction.from},
                                        )
                                    }
                                />
                            )}
                        <View style={styles.inputContainer}>
                            <Text variant="body1">{t('transactionHash')}</Text>
                            <View style={styles.content}>
                                <Text variant="body2" selectable>
                                    {transaction.hash}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text variant="body1">{t('confirmations')}</Text>
                            <View style={styles.content}>
                                <NumberFormat
                                    displayType="text"
                                    value={transaction.confirmations}
                                    decimalScale={0}
                                    thousandSeparator
                                    fixedDecimalScale
                                    renderText={value => (
                                        <Text variant="body2" selectable>
                                            {value}
                                        </Text>
                                    )}
                                />
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text variant="body1">{t('fee')}</Text>
                            <HStack
                                style={styles.content}
                                justifyContent="flex-end">
                                <NumberFormat
                                    displayType="text"
                                    value={
                                        transaction.fee /
                                        10 ** walletChain!.currency.units
                                    }
                                    suffix={` ${walletChain?.currency.ticker}`}
                                    decimalScale={8}
                                    thousandSeparator
                                    fixedDecimalScale
                                    renderText={value => (
                                        <Text variant="body2" selectable>
                                            {value}
                                        </Text>
                                    )}
                                />
                            </HStack>
                        </View>
                    </VStack>
                </ScrollView>
            </Container>
        </Container>
    );
};

export default TransactionDetails;
