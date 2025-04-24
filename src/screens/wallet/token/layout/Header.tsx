import React from 'react';
import {Animated, Platform, StyleSheet} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Coin, HStack, Text, VStack} from '../../../../components/common';
import Config from 'react-native-config';
import NumberFormat from 'react-number-format';

const styles = StyleSheet.create({
    balanceContainer: {
        alignItems: 'flex-start',
    },
    lockedBalanceContainer: {
        opacity: 0.5,
    },
});

interface HeaderProps {
    balance: Wallet.Balance;
}

const Header: React.FC<HeaderProps> = ({balance}: HeaderProps) => {
    return (
        <VStack
            alignItems="flex-start"
            style={{
                marginTop: parseInt(
                    Platform.OS === 'ios'
                        ? Config.HEADER_HEIGHT_IOS
                        : Config.HEADER_HEIGHT_ANDROID,
                ),
                marginBottom: 30,
            }}>
            <Animated.View style={[styles.balanceContainer]}>
                <HStack alignItems="flex-end">
                    <NumberFormat
                        displayType="text"
                        value={balance.balance / 10 ** balance.currency.units}
                        decimalScale={2}
                        suffix={` ${balance.currency.ticker}`}
                        thousandSeparator
                        fixedDecimalScale
                        renderText={value => (
                            <Text>
                                <Text variant="number1" color="white">
                                    {value.split('.')[0]}
                                </Text>
                                <Text variant="number2" color="white">
                                    .{value.split('.')[1]}
                                </Text>
                            </Text>
                        )}
                    />
                </HStack>
            </Animated.View>
        </VStack>
    );
};

export default Header;
