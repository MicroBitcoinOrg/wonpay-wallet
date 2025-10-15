import React, {useContext} from 'react';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Colors} from '../../theme';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {Avatar, HStack, Image, Text} from '../common';
import {Wallet} from '../../types/Wallet';
import {base64ToHex} from '../../utils/common';
import {CHAINS} from '../../utils/constants';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        marginLeft: 15,
        flex: 1,
    },
});

interface Props extends Wallet.Wallet {
    onPress: any;
}

const WalletItem: React.FC<Props> = ({
    title,
    balances,
    uuid,
    chain,
    depositAddress,
    ...props
}) => {
    const scheme = useColorScheme();

    const mainBalance = balances.find(b => b.main);

    return (
        <TouchableHighlight underlayColor={Colors[scheme!].card} {...props}>
            <View
                style={[
                    styles.container,
                    {
                        borderBottomWidth: 0.5,
                        borderColor: Colors[scheme!].border,
                    },
                ]}>
                <Avatar
                    title={title}
                    backgroundColor={`#${base64ToHex(depositAddress).substring(
                        0,
                        6,
                    )}`}
                    color="white"
                    additional={
                        CHAINS[chain].logo && (
                            <Image
                                tintColor={Colors[scheme!].textSecondary}
                                source={CHAINS[chain].logo}
                                style={{
                                    width: 12,
                                    height: 12,
                                }}
                            />
                        )
                    }
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
