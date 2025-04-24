import React, {useContext} from 'react';
import {Pressable, StyleSheet, useColorScheme, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Coin, HStack, Text} from '../../../../components/common';
import {WalletContext} from '../../../../providers';
import {useNavigation} from '@react-navigation/native';
import {CurrencyItem} from '../../components';
import {StackNavigationProp} from '@react-navigation/stack';
import Config from 'react-native-config';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../../../theme';
import {Navigation} from '../../../../types/Navigation';
import NumberFormat from 'react-number-format';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    buttonContainer: {
        width: '100%',
        minHeight: 100,
        marginTop: 10,
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    lockedBalanceContainer: {
        opacity: 0.5,
    },
});

interface CurrencyProps {
    balance: Wallet.Balance;
    setBalance: (balance: Wallet.Balance | undefined) => void;
}

const Currency = ({balance, setBalance}: CurrencyProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('withdraw');
    const {wallet} = useContext(WalletContext);
    const navigation = useNavigation<Navigation.AppNavigationProp>();
    const isPressed = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(isPressed.value, [0, 1], [1, 0.95]);

        return {
            transform: [{scale}],
        };
    });

    const chooseToken = (
        chosenToken: Wallet.Balance,
        nav: StackNavigationProp<any>,
    ) => {
        setBalance(chosenToken);
        nav.goBack();
    };

    const openTokenList = () => {
        navigation.navigate('ChooseList', {
            data: wallet!.balances,
            keyExtractor: (item: Wallet.Balance) => item.currency.ticker,
            renderItem: (
                item: Wallet.Balance,
                nav: StackNavigationProp<any>,
            ) => (
                <CurrencyItem
                    balance={item}
                    onPress={() => chooseToken(item, nav)}
                />
            ),
            headerTitle: t('selectCurrency'),
        });
    };

    return (
        <View style={styles.inputContainer}>
            <AnimatedPressable
                style={[
                    {backgroundColor: Colors[scheme!].card},
                    styles.buttonContainer,
                    animatedStyles,
                ]}
                onPress={openTokenList}
                onPressIn={() =>
                    (isPressed.value = withSpring(1, {
                        stiffness: 250,
                        damping: 15,
                    }))
                }
                onPressOut={() =>
                    (isPressed.value = withSpring(0, {
                        stiffness: 250,
                        damping: 15,
                    }))
                }>
                <HStack justifyContent="space-between">
                    <View>
                        <Text>{balance.currency.ticker}</Text>
                        <HStack
                            justifyContent="flex-start"
                            alignItems="flex-end">
                            <NumberFormat
                                displayType="text"
                                value={
                                    balance.balance /
                                    10 ** balance.currency.units
                                }
                                decimalScale={4}
                                suffix={` ${balance.currency.ticker}`}
                                thousandSeparator
                                fixedDecimalScale
                                renderText={value => (
                                    <Text variant="h2">{value}</Text>
                                )}
                            />
                        </HStack>
                    </View>
                    <IoniconsIcon
                        name="ellipsis-horizontal-circle-outline"
                        size={25}
                        color={Colors[scheme!].textSecondary}
                    />
                </HStack>
            </AnimatedPressable>
        </View>
    );
};

export default Currency;
