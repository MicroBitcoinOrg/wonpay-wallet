import React, {useContext, useEffect} from 'react';
import {
    Platform,
    StyleSheet,
    UIManager,
    useColorScheme,
    View,
    ViewProps,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '../../../../components/common';
import {Colors} from '../../../../theme';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {WalletContext} from '../../../../providers';
import useMempoolUtils from '../../../../services/hooks/useMempoolUtils';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
});

const MempoolCounter: React.FC = () => {
    const queryClient = useQueryClient();
    const scheme = useColorScheme();
    const {wallet} = useContext(WalletContext);
    const {t} = useTranslation('transactions');

    // Use the mempool utils hook based on wallet chain
    const {getMempool} = useMempoolUtils({chain: wallet?.chain!});

    const mempool = useQuery({
        queryKey: ['mempool', wallet?.chain],
        queryFn: () =>
            getMempool && getMempool({address: wallet!.depositAddress}),
        enabled: !!wallet && !!getMempool,
        refetchInterval: 10000,
    });

    useEffect(() => {
        if (mempool.data?.txcount === 0) {
            queryClient.invalidateQueries({
                queryKey: ['transactions'],
                exact: false,
            });
        }
    }, [mempool.data?.txcount]);

    if (!mempool.data || mempool.data.txcount === 0 || !getMempool) {
        return null;
    }

    const filtered = mempool.data.tx.filter(
        (value, index, self) =>
            index === self.findIndex(t => t.txid === value.txid),
    );

    return (
        <View
            style={[styles.container, {backgroundColor: Colors[scheme!].card}]}>
            <Text variant="sub1" align="center">
                {t('mempoolCounter', {
                    count: filtered.length,
                })}
            </Text>
        </View>
    );
};

export default MempoolCounter;
