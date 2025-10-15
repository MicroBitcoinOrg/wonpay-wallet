import React from 'react';

import {RouteProp} from '@react-navigation/native';

import {Container, Table} from '../../../components/common';
import {Navigation} from '../../../types/Navigation';
import {Wallet} from '../../../types/Wallet';
import ChangeIcon from './layout/ChangeIcon';

interface TokenSettingsProps {
    route: RouteProp<
        {TokenSettings: {balance: Wallet.Balance}},
        'TokenSettings'
    >;
    navigation: Navigation.AppNavigationProp;
}

const TokenSettings: React.FC<TokenSettingsProps> = ({
    navigation,
    route,
}: TokenSettingsProps) => {
    const {balance} = route.params;

    return (
        <Container>
            <Table>
                <ChangeIcon balance={balance} />
            </Table>
        </Container>
    );
};

export default TokenSettings;
