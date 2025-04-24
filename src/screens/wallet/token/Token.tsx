import React from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {Container, FocusAwareStatusBar} from '../../../components/common';
import {Header} from './layout';
import Transactions from '../transactions/Transactions';
import {Colors} from '../../../theme';

interface TokenProps {
    navigation: any;
    route?: any;
}

const styles = StyleSheet.create({
    tabsContainer: {
        marginHorizontal: -20,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    currencyTransactionsContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    buttonsContainer: {
        marginBottom: 20,
    },
});

const Token = ({route}: TokenProps) => {
    const scheme = useColorScheme();
    const {balance} = route.params ?? {balance: undefined};

    return (
        <Container gradient>
            <FocusAwareStatusBar barStyle="light-content" />
            <Header balance={balance} />
            <View
                style={[
                    styles.tabsContainer,
                    styles.currencyTransactionsContainer,
                    {backgroundColor: Colors[scheme!].background},
                ]}>
                <Transactions balance={balance} />
            </View>
        </Container>
    );
};

export default Token;
