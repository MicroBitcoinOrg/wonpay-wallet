import React, {useCallback, useEffect, useState} from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Colors} from '../../../theme';
import {P2PItem} from './components';
import {useFocusEffect} from '@react-navigation/native';
import {Button, NotFound} from '../../../components/extended';
import {HStack} from '../../../components/common';
import {Currency} from './layout';
import Config from 'react-native-config';
import {useOffers} from '../../../services/mex/hooks';
import {SideEnum} from '../../../services/mex/api/types';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
});

const Component = () => {
    const {t} = useTranslation('p2p');
    const [side, setSide] = useState<SideEnum>(SideEnum.BUY);
    const scheme = useColorScheme();
    const [currency, setCurrency] = useState<
        {balance?: number; units?: number; name?: string} | undefined
    >({
        balance: 0,
        units: 8,
        name: Config.COIN_NAME,
    });

    const {
        data: offersData,
        isRefetching: offersRefetching,
        isLoading: offersLoading,
        error,
        refetch,
    } = useOffers(
        {
            currency: currency?.name || Config.COIN_NAME,
            side: side,
        },
        {page: 1},
    );

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
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
                        title={t('marketplace.buy')}
                        type={side === SideEnum.BUY ? 'contained' : 'contained'}
                        color={side === SideEnum.BUY ? 'primary' : 'card'}
                        onPress={() => setSide(SideEnum.BUY)}
                        size="md"
                        style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                    />
                    <Button
                        title={t('marketplace.sell')}
                        type={
                            side === SideEnum.SELL ? 'contained' : 'contained'
                        }
                        color={side === SideEnum.SELL ? 'primary' : 'card'}
                        onPress={() => setSide(SideEnum.SELL)}
                        size="md"
                        style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        }}
                    />
                </HStack>
                <Currency token={currency} setToken={setCurrency} />
            </HStack>
            {offersData && (
                <FlatList
                    style={{flex: 1, width: '100%'}}
                    scrollEventThrottle={16}
                    contentContainerStyle={{paddingBottom: 90}}
                    refreshControl={
                        <RefreshControl
                            refreshing={offersLoading || offersRefetching}
                            onRefresh={refetch}
                            tintColor={Colors[scheme!].textPrimary}
                        />
                    }
                    data={offersData.list}
                    keyExtractor={item => item.reference}
                    renderItem={({item}) => <P2PItem {...item} />}
                />
            )}
            {offersData && offersData.list.length === 0 && (
                <NotFound
                    size="sm"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '20%',
                        zIndex: -1,
                    }}
                    description={t('marketplace.noOffers')}
                />
            )}
        </View>
    );
};

export default Component;
