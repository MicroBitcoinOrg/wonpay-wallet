import React, {useContext, useState, useMemo, useCallback} from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {
    Container,
    DismissKeyboard,
    KeyboardAvoidingView,
    VStack,
    HStack,
    Text,
} from '@/components/common';
import {
    Button,
    BottomSheetPicker,
    FormItem,
    Input,
    IconButton,
} from '@/components/extended';
import type {PickerOption} from '@/components/extended';
import {Colors} from '@/theme';
import {P2PContext} from '@/providers';
import {useBalances} from '@/services/mex/hooks';
import {useCreateWithdrawal} from '@/services/mex/hooks/useWithdrawal';
import {isMatchAddress} from '@/utils/address';
import {NumericFormat} from 'react-number-format';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Navigation} from '@/types/Navigation';
import useAppStore from '@/store/appStore';
import Clipboard from '@react-native-clipboard/clipboard';
import {Wallet} from '@/types/Wallet';
import {BalanceResponse} from '@/services/mex/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
});

interface P2PWithdrawProps {
    navigation: any;
    route: any;
}

const P2PWithdraw: React.FC<P2PWithdrawProps> = ({navigation}) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('withdraw');
    const {token} = useContext(P2PContext);
    const appNavigation = useNavigation<Navigation.AppNavigationProp>();
    const store = useAppStore();

    const {data: balances, isLoading} = useBalances(token);
    const createWithdrawal = useCreateWithdrawal(token!);

    const [selectedBalance, setSelectedBalance] = useState<
        BalanceResponse | null | undefined
    >(null);
    const [address, setAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const isPressed = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        const scale = interpolate(isPressed.value, [0, 1], [1, 0.95]);

        return {
            transform: [{scale}],
        };
    });

    // Create currency options from balances
    const mappedCurrencies = useMemo(() => {
        if (!balances) return [];

        return balances
            .filter(balance => balance.balance > 0)
            .map(balance => ({
                label: `${balance.currency} (${balance.network})`,
                description: `${balance.balance.toFixed(8)} ${
                    balance.currency
                }`,
                value: `${balance.currency}|${balance.network}`,
            }));
    }, [balances]);

    const chooseCurrency = useCallback(
        (value: string) => {
            const [currency, network] = value.split('|');
            const balance = balances?.find(
                b => b.currency === currency && b.network === network,
            );
            setSelectedBalance(balance);
        },
        [balances],
    );

    // Set first balance as default
    useMemo(() => {
        if (balances && balances.length > 0 && !selectedBalance) {
            setSelectedBalance(balances.find(b => b.balance > 0));
        }
    }, [balances, selectedBalance]);

    const checkAmount = (text: string) => {
        const regex = /^[0-9]{0,100}([.,][0-9]{0,8})?$/;
        if (regex.test(text)) setAmount(text.replace(',', '.'));
    };

    const setMax = () => {
        if (!selectedBalance) return;

        const max = selectedBalance.balance - selectedBalance.frozen;
        checkAmount(String(max.toFixed(8)));
    };

    const getFromClipboard = () => {
        Clipboard.getString().then(string => {
            if (string && string.length > 20) {
                setAddress(string);
            }
        });
    };

    const sortFunc = (a: Wallet.AddressBook, b: Wallet.AddressBook) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
    };

    const sortedAddresses = [
        ...store.addressBook.filter(a => a.favorite).sort(sortFunc),
        ...store.addressBook.filter(a => !a.favorite).sort(sortFunc),
    ].map(addr => ({
        label: addr.title,
        description: addr.address,
        value: addr.address,
        group: 'Address Book',
    }));

    const chooseAddressBookItem = (address: string) => {
        setAddress(address);
    };

    const handleWithdraw = async () => {
        if (!selectedBalance) return;

        const withdrawConfirmed = async () => {
            try {
                await createWithdrawal.mutateAsync({
                    crypto_currency: selectedBalance.currency,
                    network: selectedBalance.network,
                    amount: parseFloat(amount),
                    address,
                });

                showMessage({
                    message: t('alerts.transactionSent.message'),
                    description: t('alerts.transactionSent.description'),
                    backgroundColor: Colors[scheme!].primary,
                });

                navigation.goBack();
            } catch (e) {
                showMessage({
                    message: t('alerts.error.message'),
                    description: (e as Error).message,
                    type: 'danger',
                });
            }
        };

        Alert.alert(
            t('alerts.withdrawConfirmation.message'),
            t('alerts.withdrawConfirmation.description', {
                amount,
                coin: selectedBalance.currency,
            }),
            [
                {
                    text: t('alerts.withdrawConfirmation.cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: t('alerts.withdrawConfirmation.confirm'),
                    onPress: withdrawConfirmed,
                    style: 'default',
                },
            ],
            {cancelable: false},
        );
    };

    const isValidAddress = useMemo(() => {
        if (!address) return false;
        return address.length > 20;
    }, [address]);

    const isValidAmount = useMemo(() => {
        if (!amount || !selectedBalance) return false;
        const numAmount = parseFloat(amount);
        return (
            numAmount > 0 &&
            numAmount <= selectedBalance.balance - selectedBalance.frozen
        );
    }, [amount, selectedBalance]);

    return (
        <DismissKeyboard>
            <Container>
                <KeyboardAvoidingView style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Currency Picker - styled like wallet withdraw */}
                        <View style={styles.inputContainer}>
                            <BottomSheetPicker
                                options={mappedCurrencies}
                                onValueChange={chooseCurrency}>
                                <AnimatedPressable
                                    style={[
                                        {backgroundColor: Colors[scheme!].card},
                                        styles.buttonContainer,
                                        animatedStyles,
                                    ]}
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
                                            <Text>
                                                {selectedBalance
                                                    ? `${selectedBalance.currency} (${selectedBalance.network})`
                                                    : 'Select Currency'}
                                            </Text>
                                            {selectedBalance && (
                                                <HStack
                                                    justifyContent="flex-start"
                                                    alignItems="flex-end">
                                                    <NumericFormat
                                                        displayType="text"
                                                        value={
                                                            selectedBalance.balance
                                                        }
                                                        decimalScale={8}
                                                        suffix={` ${selectedBalance.currency}`}
                                                        thousandSeparator
                                                        fixedDecimalScale
                                                        renderText={value => (
                                                            <Text variant="h2">
                                                                {value}
                                                            </Text>
                                                        )}
                                                    />
                                                </HStack>
                                            )}
                                        </View>
                                        <IoniconsIcon
                                            name="ellipsis-horizontal-circle-outline"
                                            size={25}
                                            color={
                                                Colors[scheme!].textSecondary
                                            }
                                        />
                                    </HStack>
                                </AnimatedPressable>
                            </BottomSheetPicker>
                        </View>

                        <VStack
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            flex={1}>
                            {/* Address Input with address book */}
                            <FormItem title={t('withdrawAddress.title')}>
                                <Input
                                    placeholder={t(
                                        'withdrawAddress.placeholder',
                                    )}
                                    autoFocus={!address || address === ''}
                                    onChangeText={text => setAddress(text)}
                                    onLongPress={getFromClipboard}
                                    value={address}
                                    returnKeyType={'next'}
                                    rightContent={
                                        <HStack>
                                            <BottomSheetPicker
                                                title="Choose address"
                                                options={sortedAddresses}
                                                onValueChange={
                                                    chooseAddressBookItem
                                                }>
                                                <IconButton
                                                    iconSet="ionicons"
                                                    name="people-outline"
                                                    disabled={
                                                        !store.addressBook ||
                                                        store.addressBook
                                                            .length === 0
                                                    }
                                                    transparent
                                                    color={
                                                        scheme === 'dark'
                                                            ? 'textPrimary'
                                                            : 'primary'
                                                    }
                                                />
                                            </BottomSheetPicker>
                                        </HStack>
                                    }
                                />
                            </FormItem>

                            {/* Amount Input */}
                            <FormItem title={t('amount.title')}>
                                <Input
                                    placeholder={t('amount.placeholder')}
                                    autoFocus={
                                        address !== undefined && address !== ''
                                    }
                                    rightContent={
                                        <HStack>
                                            {selectedBalance && (
                                                <Text variant="body1">
                                                    {selectedBalance.currency}
                                                </Text>
                                            )}
                                            <Button
                                                title="Max"
                                                type="text"
                                                color={
                                                    scheme === 'dark'
                                                        ? 'textPrimary'
                                                        : 'primary'
                                                }
                                                onPress={setMax}
                                            />
                                        </HStack>
                                    }
                                    onChangeText={text => checkAmount(text)}
                                    value={amount}
                                    keyboardType="numeric"
                                />
                            </FormItem>
                        </VStack>
                    </ScrollView>

                    {/* Bottom Container with Total */}
                    <Container
                        flex={0}
                        marginHorizontal={-20}
                        borderTopWidth={1}
                        gap={16}
                        justifyContent="center"
                        paddingVertical={16}
                        borderColor={Colors[scheme!].border}>
                        {/* Total */}
                        {selectedBalance && (
                            <HStack justifyContent="space-between">
                                <Text variant="body1">{t('totalSend')}</Text>
                                <VStack
                                    justifyContent="flex-start"
                                    alignItems="flex-end">
                                    <NumericFormat
                                        displayType="text"
                                        value={parseFloat(
                                            !amount ||
                                                amount === '' ||
                                                amount === '.' ||
                                                amount === ','
                                                ? '0'
                                                : amount,
                                        )}
                                        decimalScale={4}
                                        suffix={` ${selectedBalance.currency}`}
                                        thousandSeparator
                                        fixedDecimalScale
                                        renderText={value => (
                                            <Text
                                                variant="body1"
                                                numberOfLines={1}>
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </VStack>
                            </HStack>
                        )}

                        <Button
                            title={t('confirmButton')}
                            disabled={
                                !selectedBalance ||
                                !isValidAddress ||
                                !isValidAmount ||
                                createWithdrawal.isPending
                            }
                            onPress={handleWithdraw}
                        />
                    </Container>
                </KeyboardAvoidingView>
            </Container>
        </DismissKeyboard>
    );
};

export default P2PWithdraw;
