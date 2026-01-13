import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Colors} from '@/theme';
import {P2PItem} from '@/screens/p2p/account/components';
import {useFocusEffect} from '@react-navigation/native';
import {Button, NotFound, BottomSheetPicker} from '@/components/extended';
import type {PickerOption} from '@/components/extended';
import {HStack, VStack, Text} from '@/components/common';
import {useOffers} from '@/services/mex/hooks';
import {SideEnum, Currency as CurrencyType} from '@/services/mex/api/types';
import {useTranslation} from 'react-i18next';
import {CHAINS, MEX_CURRENCIES} from '@/utils/constants';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import useBalanceUtils from '@/services/hooks/useBalanceUtils';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
});

const Component = () => {
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);
    const {t} = useTranslation('p2p');
    const [side, setSide] = useState<SideEnum>(SideEnum.BUY);
    const scheme = useColorScheme();
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(
        MEX_CURRENCIES[0],
    );

    // Format currency for API
    const formatCurrency = (crypto: CurrencyType): string => {
        return `${crypto.network.toLowerCase()}:${crypto.currency}`;
    };

    const {
        data: offersData,
        isFetching: offersFetching,
        error,
        refetch,
    } = useOffers(
        {
            currency: formatCurrency(selectedCurrency),
            side: side,
        },
        {page: 1},
    );

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const handleManualRefresh = async () => {
        setIsManualRefreshing(true);
        await refetch();
        // Add a small delay to ensure smooth animation
        setTimeout(() => setIsManualRefreshing(false), 300);
    };

    return (
        <View style={styles.container}>
            <HStack
                width={'100%'}
                justifyContent="flex-start"
                alignItems="center"
                paddingVertical={16}
                gap={8}>
                <HStack justifyContent="flex-start" paddingLeft={16}>
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

                <ScrollView
                    style={{
                        flex: 1,
                        borderLeftWidth: 0.5,
                        borderColor: Colors[scheme!].border,
                    }}
                    contentContainerStyle={{
                        gap: 8,
                        paddingHorizontal: 8,
                        paddingRight: 16,
                    }}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {MEX_CURRENCIES.map(currency => (
                        <Button
                            title={currency.currency!}
                            type="contained"
                            color={
                                selectedCurrency.currency === currency.currency
                                    ? 'primary'
                                    : 'card'
                            }
                            size="md"
                            key={currency.currency!}
                            onPress={() => setSelectedCurrency(currency)}
                        />
                    ))}
                </ScrollView>
            </HStack>

            {offersData && (
                <FlatList
                    style={{flex: 1, width: '100%'}}
                    scrollEventThrottle={16}
                    contentContainerStyle={{paddingBottom: 90}}
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                isManualRefreshing ||
                                (offersFetching && isManualRefreshing)
                            }
                            onRefresh={handleManualRefresh}
                            tintColor={Colors[scheme!].textSecondary}
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
