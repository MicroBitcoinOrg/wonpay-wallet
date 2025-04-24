import React, {useContext, useEffect} from 'react';
import {
    Platform,
    StyleSheet,
    UIManager,
    useColorScheme,
    View,
    ViewProps,
} from 'react-native';

import {Text} from '../../../../components/common';
import {Colors} from '../../../../theme';
import {useQuery, useQueryClient} from 'react-query';
import getMempool from '../../../../services/microbitcoin/api/getMempool';
import {WalletContext} from '../../../../providers';

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

    const mempool = useQuery({
        queryKey: ['mempool'],
        queryFn: () => getMempool({address: wallet!.depositAddress}),
        enabled: !!wallet,
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

    if (!mempool.data || mempool.data.txcount === 0) {
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
                There is <Text fontWeight="700">{filtered.length}</Text>{' '}
                transaction(s) in mempool
            </Text>
        </View>
    );
};

export default MempoolCounter;
