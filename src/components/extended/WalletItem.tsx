import React, {useContext} from 'react';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Colors} from '../../theme';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {Avatar, HStack, Text} from '../common';
import Config from 'react-native-config';
import {WalletContext} from '../../providers';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        marginLeft: 10,
    },
});

interface Props extends Wallet.Wallet {
    onPress: any;
}

const WalletItem: React.FC<Props> = ({title, balances, uuid, ...props}) => {
    const scheme = useColorScheme();

    const mainBalance = balances.find(b => b.main);

    return (
        <TouchableHighlight underlayColor={Colors[scheme!].card} {...props}>
            <View
                style={[
                    styles.container,
                    {borderBottomWidth: 1, borderColor: Colors[scheme!].border},
                ]}>
                <Avatar
                    title={title}
                    backgroundColor={Colors[scheme!].card}
                    color="textSecondary"
                />
                <View style={styles.contentContainer}>
                    <HStack justifyContent="flex-start">
                        <Text variant="body1">{title}</Text>
                    </HStack>
                    <Text variant="body3" opacity={0.5}>
                        {(
                            mainBalance!.balance /
                            10 ** mainBalance!.currency.units
                        ).toFixed(4)}{' '}
                        {mainBalance!.currency.ticker}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

export default WalletItem;
