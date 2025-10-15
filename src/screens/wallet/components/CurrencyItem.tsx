import React, {useContext} from 'react';
import {
    StyleSheet,
    TouchableHighlightProps,
    useColorScheme,
    View,
} from 'react-native';
import {Avatar, HStack, Text} from '../../../components/common';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Colors} from '../../../theme';
import NumberFormat from 'react-number-format';
import {Wallet} from '../../../types/Wallet';
import {MICROBITCOIN} from '../../../utils/constants';
import useBalanceUtils from '../../../services/hooks/useBalanceUtils';
import {WalletContext} from '../../../providers';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        marginLeft: 15,
    },
});

interface CurrencyItemProps extends TouchableHighlightProps {
    balance?: Wallet.Balance;
}

const CurrencyItem = ({style, balance, ...props}: CurrencyItemProps) => {
    const scheme = useColorScheme();
    const {walletChain} = useContext(WalletContext);
    const {getCurrencyIcon} = useBalanceUtils({chain: walletChain!.key});

    return (
        // @ts-ignore
        <TouchableHighlight underlayColor={Colors[scheme!].card} {...props}>
            <View
                style={[
                    styles.container,
                    {
                        borderBottomWidth: 0.5,
                        borderColor: Colors[scheme!].border,
                    },
                    style,
                ]}>
                <Avatar
                    source={{
                        uri: getCurrencyIcon({currency: balance?.currency!}),
                    }}
                    title={balance?.currency.ticker}
                    backgroundColor="card"
                    color="textSecondary"
                    additional={
                        balance?.currency.ticker.includes('!') && (
                            <IoniconsIcon
                                size={15}
                                name="settings-outline"
                                color={Colors[scheme!].textSecondary}
                            />
                        )
                    }
                />
                <View style={styles.contentContainer}>
                    <HStack justifyContent="flex-start">
                        <Text variant="body1">{balance?.currency.ticker}</Text>
                    </HStack>
                    {balance !== undefined && (
                        <NumberFormat
                            displayType="text"
                            value={
                                balance.balance / 10 ** balance.currency.units
                            }
                            decimalScale={balance.currency.units}
                            suffix={` ${balance.currency.ticker}`}
                            thousandSeparator
                            fixedDecimalScale
                            renderText={value => (
                                <Text variant="body3" opacity={0.5}>
                                    {value}
                                </Text>
                            )}
                        />
                    )}
                </View>
            </View>
        </TouchableHighlight>
    );
};

export default CurrencyItem;
