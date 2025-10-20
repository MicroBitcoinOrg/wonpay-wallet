import React from 'react';
import {ViewProps} from 'react-native';
import Config from 'react-native-config';
import {Button} from '../../../../components/extended';

interface CurrencyProps extends ViewProps {
    token?: {name?: string; balance?: number; units?: number};
    setToken?: any;
}

const Currency = ({token}: CurrencyProps) => {
    // Simplified Currency component - displays selected currency only
    // Token selection functionality can be added later when token API is available

    return (
        <Button
            border
            title={token && token.name ? token.name : Config.COIN_NAME}
            type="outlined"
            color="primary"
            size="md"
            disabled
        />
    );
};

export default Currency;
