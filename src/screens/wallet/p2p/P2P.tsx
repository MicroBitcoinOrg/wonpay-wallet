import React from 'react';
import {useTranslation} from 'react-i18next';
import {NotFound} from '../../../components/extended';
import {View} from 'react-native';

interface P2PProps {}

const P2P: React.FC<P2PProps> = () => {
    const {t} = useTranslation('p2p');

    return (
        <View style={{flex: 1}}>
            <NotFound
                description={t('p2pCommingSoon')}
                size="sm"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '20%',
                    zIndex: -1,
                }}
            />
        </View>
    );
};

export default P2P;
