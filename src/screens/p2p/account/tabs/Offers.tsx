import React, {useCallback, useContext, useEffect} from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Colors} from '../../../../theme';
import {P2PContext, WalletContext} from '../../../../providers';
import {useFocusEffect} from '@react-navigation/native';
import {useOffers} from '../../../../services/mex/hooks';
import {OfferItem} from '../components';
import {NotFound} from '../../../../components/extended';
import {VStack} from '../../../../components/common';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const Offers = () => {
    const {t} = useTranslation('p2p');
    const {token} = useContext(P2PContext);
    const {wallet} = useContext(WalletContext);
    const scheme = useColorScheme();

    const {
        data: offersData,
        isRefetching: offersRefetching,
        isLoading: offersLoading,
        refetch,
        error,
    } = useOffers(
        {
            user: wallet?.addresses?.[0]?.address || null,
        },
        {page: 1},
        {enabled: !!token && !!wallet},
    );

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
    );

    useEffect(() => {
        console.log(error);
        console.log('offersData', offersData);
    }, [error, offersData]);

    return (
        <View style={styles.container}>
            <FlatList
                style={{flex: 1}}
                contentContainerStyle={{paddingBottom: 90, paddingTop: 10}}
                refreshControl={
                    <RefreshControl
                        refreshing={offersLoading || offersRefetching}
                        onRefresh={refetch}
                        tintColor={Colors[scheme!].textPrimary}
                    />
                }
                data={offersData?.list || []}
                keyExtractor={item => item.reference}
                renderItem={({item}) => <OfferItem {...item} />}
            />
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
                    description={t('myOffers.noOffers')}
                />
            )}
        </View>
    );
};

export default Offers;
