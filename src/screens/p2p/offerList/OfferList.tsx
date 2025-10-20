import React, {useCallback, useContext} from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Colors} from '../../../theme';
import {OfferItem} from './components';
import {P2PContext, WalletContext} from '../../../providers';
import {useFocusEffect} from '@react-navigation/native';
import {NotFound} from '../../../components/extended';
import {useOffers} from '../../../services/mex/hooks';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface Props {}

const Component = ({}: Props) => {
    const {t} = useTranslation('p2p');
    const {token} = useContext(P2PContext);
    const {wallet} = useContext(WalletContext);
    const scheme = useColorScheme();

    const {
        data: offersData,
        isRefetching: offersRefetching,
        isLoading: offersLoading,
        refetch,
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

    return (
        <View style={styles.container}>
            {offersData && (
                <FlatList
                    style={{flex: 1}}
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
                    renderItem={({item}) => <OfferItem {...item} />}
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
                    description={t('myOffers.noOffers')}
                />
            )}
        </View>
    );
};

export default Component;
