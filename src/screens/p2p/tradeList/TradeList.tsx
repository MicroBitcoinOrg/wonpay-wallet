import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Colors} from '../../../theme';
import {OrderItem} from './components';
import {P2PContext} from '../../../providers';
import {useFocusEffect} from '@react-navigation/native';
import {Button, NotFound} from '../../../components/extended';
import {HStack} from '../../../components/common';
import {
    useIncomingTrades,
    useOutgoingTrades,
} from '../../../services/mex/hooks';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface Props {
    route: any;
}

const Component = ({route}: Props) => {
    const {t} = useTranslation('p2p');
    const [type, setType] = useState<'incoming' | 'outgoing'>('incoming');
    const {token} = useContext(P2PContext);
    const scheme = useColorScheme();

    const {
        data: incomingData,
        isRefetching: incomingRefetching,
        isLoading: incomingLoading,
        refetch: incomingRefetch,
        error: incomingError,
    } = useIncomingTrades(token, {page: 1});

    const {
        data: outgoingData,
        isRefetching: outgoingRefetching,
        isLoading: outgoingLoading,
        refetch: outgoingRefetch,
    } = useOutgoingTrades(token, {page: 1});

    const getData = () => {
        switch (type) {
            case 'outgoing':
                return outgoingData?.list || [];
            case 'incoming':
                return incomingData?.list || [];
        }
    };

    useEffect(() => {
        if (route?.params?.type) {
            setType(route?.params?.type);
        }
    }, [route?.params]);

    useFocusEffect(
        useCallback(() => {
            outgoingRefetch();
            incomingRefetch();
        }, [outgoingRefetch, incomingRefetch]),
    );

    return (
        <View style={styles.container}>
            <HStack
                justifyContent="space-between"
                style={{
                    padding: 16,
                }}>
                <HStack justifyContent="flex-start">
                    <Button
                        title={t('trades.incoming')}
                        type={type === 'incoming' ? 'contained' : 'contained'}
                        color={type === 'incoming' ? 'primary' : 'card'}
                        onPress={() => setType('incoming')}
                        size="md"
                        style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                    />
                    <Button
                        border
                        title={t('trades.outgoing')}
                        type={type === 'outgoing' ? 'contained' : 'contained'}
                        color={type === 'outgoing' ? 'primary' : 'card'}
                        onPress={() => setType('outgoing')}
                        size="md"
                        style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        }}
                    />
                </HStack>
            </HStack>
            {incomingData && outgoingData && (
                <FlatList
                    style={{flex: 1}}
                    scrollEventThrottle={16}
                    contentContainerStyle={{paddingBottom: 90}}
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                incomingLoading ||
                                incomingRefetching ||
                                outgoingLoading ||
                                outgoingRefetching
                            }
                            onRefresh={() => {
                                outgoingRefetch();
                                incomingRefetch();
                            }}
                            tintColor={Colors[scheme!].textPrimary}
                        />
                    }
                    data={getData()}
                    keyExtractor={item => item.reference}
                    renderItem={({item}) => <OrderItem {...item} />}
                />
            )}
            {(type === 'incoming' &&
                incomingData &&
                incomingData.list.length === 0) ||
            (type === 'outgoing' &&
                outgoingData &&
                outgoingData.list.length === 0) ? (
                <NotFound
                    size="sm"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '20%',
                        zIndex: -1,
                    }}
                    description={t('trades.noTrades')}
                />
            ) : null}
        </View>
    );
};

export default Component;
