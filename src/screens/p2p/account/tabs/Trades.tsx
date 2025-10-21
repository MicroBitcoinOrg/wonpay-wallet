import React, {useCallback, useContext, useState} from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Colors} from '../../../../theme';
import {P2PContext} from '../../../../providers';
import {
    useIncomingTrades,
    useOutgoingTrades,
    useTrades,
} from '../../../../services/mex/hooks';
import {useTranslation} from 'react-i18next';
import {Button} from '../../../../components/extended';
import {HStack} from '../../../../components/common';
import {TradeItem} from '../components';
import {useFocusEffect} from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
});

const Trades = () => {
    const {t} = useTranslation('p2p');
    const {token} = useContext(P2PContext);
    const scheme = useColorScheme();
    const [type, setType] = useState<'incoming' | 'outgoing'>('incoming');

    const {
        data: trades,
        isRefetching: tradesRefetching,
        isLoading: tradesLoading,
        refetch: tradesRefetch,
    } = useTrades(token, {direction: 'any'}, {page: 1});

    useFocusEffect(
        useCallback(() => {
            tradesRefetch();
        }, [tradesRefetch]),
    );

    console.log(trades);

    return (
        <View style={styles.container}>
            <FlatList
                style={{flex: 1}}
                contentContainerStyle={{paddingBottom: 90}}
                refreshControl={
                    <RefreshControl
                        refreshing={tradesLoading || tradesRefetching}
                        onRefresh={() => {
                            tradesRefetch();
                        }}
                        tintColor={Colors[scheme!].textPrimary}
                    />
                }
                data={trades?.list}
                keyExtractor={item => item.reference}
                renderItem={({item}) => <TradeItem {...item} />}
            />
        </View>
    );
};

export default Trades;
