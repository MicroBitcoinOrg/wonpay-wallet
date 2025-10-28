import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {
    FlatList,
    RefreshControl,
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
    const {getCurrencyIcon} = useBalanceUtils();
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);
    const {t} = useTranslation('p2p');
    const [side, setSide] = useState<SideEnum>(SideEnum.BUY);
    const scheme = useColorScheme();
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(
        MEX_CURRENCIES[0],
    );
    const [selectedSideCurrency, setSelectedSideCurrency] =
        useState<CurrencyType>(MEX_CURRENCIES[1]);

    // Format currency for API
    const formatCurrency = (crypto: CurrencyType): string => {
        return `${crypto.network.toLowerCase()}:${crypto.currency}`;
    };

    // Currency picker options
    const currencyOptions: PickerOption[] = useMemo(
        () =>
            MEX_CURRENCIES.map(crypto => ({
                label: crypto.currency!,
                value: JSON.stringify(crypto),
                description: CHAINS[crypto.network!].name,
                avatarProps: {
                    source: {
                        uri: getCurrencyIcon(crypto.network)({
                            currency: {
                                ticker: crypto.currency,
                                units: 0,
                            },
                        }),
                    },
                },
            })),
        [],
    );

    const {
        data: offersData,
        isFetching: offersFetching,
        error,
        refetch,
    } = useOffers(
        {
            currency: formatCurrency(selectedCurrency),
            side_currency: formatCurrency(selectedSideCurrency),
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
                <HStack justifyContent="flex-end" style={{gap: 8}}>
                    <BottomSheetPicker
                        options={currencyOptions}
                        selectedValue={JSON.stringify(selectedCurrency)}
                        onValueChange={(val: string) => {
                            try {
                                setSelectedCurrency(JSON.parse(val));
                            } catch {
                                // ignore
                            }
                        }}
                        title={t('marketplace.selectCurrency')}>
                        <Button
                            title={selectedCurrency.currency!}
                            type="contained"
                            color="card"
                            size="md"
                        />
                    </BottomSheetPicker>
                    <IoniconsIcon
                        size={16}
                        color={Colors[scheme!].textSecondary}
                        name="swap-horizontal"
                    />
                    <BottomSheetPicker
                        options={currencyOptions}
                        selectedValue={JSON.stringify(selectedSideCurrency)}
                        onValueChange={(val: string) => {
                            try {
                                setSelectedSideCurrency(JSON.parse(val));
                            } catch {
                                // ignore
                            }
                        }}
                        title={t('marketplace.selectSideCurrency')}>
                        <Button
                            title={selectedSideCurrency.currency!}
                            type="contained"
                            color="card"
                            size="md"
                        />
                    </BottomSheetPicker>
                </HStack>
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
