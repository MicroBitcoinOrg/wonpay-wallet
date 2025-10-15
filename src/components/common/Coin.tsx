import React from 'react';
import {StyleSheet} from 'react-native';
import Image from './Image';

const styles = StyleSheet.create({
    mdContainer: {
        marginBottom: 5,
        marginLeft: 5,
        height: 18,
        width: 18,
    },
    smContainer: {
        marginBottom: 2,
        marginLeft: 5,
        height: 12,
        width: 12,
    },
});

interface CoinProps {
    style?: any;
    tintColor?: string;
    size?: 'sm' | 'md';
    resizeMode?: any;
}

const Coin: React.FC<CoinProps> = ({
    style,
    tintColor = 'black',
    resizeMode = 'contain',
    size = 'md',
    ...props
}: CoinProps) => (
    <Image
        style={[
            size === 'md' ? styles.mdContainer : styles.smContainer,
            style,
            {tintColor},
        ]}
        {...props}
        source={require('../../assets/icon.png')}
        resizeMode={resizeMode}
    />
);

export default Coin;
