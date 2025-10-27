import React from 'react';
import {useTranslation} from 'react-i18next';
import {NotFound} from '@/components/extended';
import {StyleSheet, View} from 'react-native';

interface P2PProps {}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notFound: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '20%',
        zIndex: -1,
    },
});

const P2P: React.FC<P2PProps> = () => {
    const {t} = useTranslation('p2p');

    return (
        <View style={styles.container}>
            <NotFound
                description={t('p2pCommingSoon')}
                size="sm"
                style={styles.notFound}
            />
        </View>
    );
};

export default P2P;
