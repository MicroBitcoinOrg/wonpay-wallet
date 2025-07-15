import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    FlatList,
    LayoutAnimation,
    Platform,
    RefreshControl,
    StyleSheet,
    UIManager,
    useColorScheme,
    View,
    ViewProps,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {WalletContext} from '../../../providers';
import {TransactionItem} from './components';
import {IconButton, Input, NotFound} from '../../../components/extended';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Container, HStack, Text} from '../../../components/common';
import {Colors} from '../../../theme';
import {Navigation} from '../../../types/Navigation';
import {useQuery} from '@tanstack/react-query';
import MempoolCounter from './components/MempoolCounter';
import useTransactionUtils from '../../../services/hooks/useTransactionUtils';
import {Wallet} from '../../../types/Wallet';

interface TransactionsProps extends ViewProps {
    balance?: Wallet.Balance;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionHeaderContainer: {
        paddingVertical: 10,
    },
    sectionHeaderButtonsContainer: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
    },
    navbarContainer: {
        paddingVertical: 10,
    },
    listContentContainer: {
        paddingBottom: 90,
    },
    notFound: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '20%',
        zIndex: -1,
    },
});

const Transactions: React.FC<TransactionsProps> = ({
    style,
    balance,
}: TransactionsProps) => {
    const scheme = useColorScheme();
    const firstTimeRef = React.useRef(true);
    const navigation = useNavigation<Navigation.AppNavigationProp>();
    const {t} = useTranslation('transactions');
    const historyScroll = useRef<FlatList>(null);
    const {searchActivated, setSearchActivated} = useContext(WalletContext);
    const [search, setSearch] = useState<string>('');
    const {wallet} = useContext(WalletContext);
    const {updateTransactions} = useTransactionUtils({chain: wallet!.chain});
    const mainBalance = wallet!.balances.find(b => b.main);
    const {
        refetch,
        data: transactions,
        isLoading: isTransactionsLoading,
        isRefetching: isTransactionsRefetching,
    } = useQuery<Wallet.Transaction[]>({
        queryKey: ['transactions', wallet!.uuid, balance?.currency.ticker],
        queryFn: () =>
            updateTransactions({
                currency: balance ? balance!.currency : mainBalance!.currency,
            }),
        initialData: wallet!.transactions,
    });

    useFocusEffect(
        useCallback(() => {
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            setTimeout(refetch, 100);
        }, [refetch]),
    );

    useEffect(() => {
        if (wallet!.uuid) {
            refetch();
        }
    }, [wallet!.uuid]);

    return (
        <View style={[styles.container, style]}>
            <MempoolCounter />
            {searchActivated && (
                <Container flex={0}>
                    <HStack style={[styles.sectionHeaderContainer]}>
                        <Input
                            placeholder="Type to search"
                            flex={1}
                            value={search}
                            onChangeText={text => setSearch(text)}
                            rightContent={
                                <IconButton
                                    name="close-circle-outline"
                                    iconSet="ionicons"
                                    transparent
                                    onPress={() => {
                                        LayoutAnimation.configureNext(
                                            LayoutAnimation.Presets
                                                .easeInEaseOut,
                                        );
                                        setSearchActivated(false);
                                    }}
                                />
                            }
                        />
                    </HStack>
                </Container>
            )}
            <FlatList
                ref={historyScroll}
                nestedScrollEnabled
                scrollEventThrottle={16}
                contentContainerStyle={styles.listContentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            isTransactionsLoading || isTransactionsRefetching
                        }
                        onRefresh={refetch}
                        tintColor={Colors[scheme!].textPrimary}
                    />
                }
                data={transactions}
                keyExtractor={(item: Wallet.Transaction) => item.hash}
                renderItem={({item}) => (
                    <TransactionItem
                        onPress={() =>
                            navigation.navigate('RootStack', {
                                screen: 'MainTabs',
                                params: {
                                    screen: 'WalletStack',
                                    params: {
                                        screen: 'TransactionDetails',
                                        params: {transaction: item},
                                    },
                                },
                            })
                        }
                        // @ts-ignore
                        transaction={item}
                    />
                )}
            />
            {transactions!.length === 0 ? (
                <NotFound
                    size="sm"
                    style={styles.notFound}
                    description={t('noHistory')}
                />
            ) : (
                searchActivated &&
                search !== '' &&
                transactions!.length === 0 && (
                    <NotFound
                        size="sm"
                        style={styles.notFound}
                        description={t('noSearch')}
                    />
                )
            )}
        </View>
    );
};

export default Transactions;
