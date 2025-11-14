import React, {useContext, useMemo, useEffect} from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {P2PContext} from '@/providers';
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
    FormItem,
    Input,
    BottomSheetPicker,
} from '@/components/extended';
import type {PickerOption} from '@/components/extended';
import {Colors} from '@/theme';
import useAppStore from '@/store/appStore';
import {useCreateOffer, useBalances} from '@/services/mex/hooks';
import {StackScreenProps} from '@react-navigation/stack';
import {Navigation} from '@/types/Navigation';
import {Currency, SideEnum} from '@/services/mex/api/types';
import {CHAINS, MEX_CURRENCIES} from '@/utils/constants';
import {Wallet} from '@/types/Wallet';
import useBalanceUtils from '@/services/hooks/useBalanceUtils';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomContainer: {
        flex: 0,
        marginHorizontal: -20,
        borderTopWidth: 1,
        gap: 16,
        justifyContent: 'center',
    },
});

type NewOfferProps = StackScreenProps<Navigation.P2PParamList, 'NewOffer'>;

// Zod schema for form validation
const formSchema = z.object({
    currency: z.object({
        network: z.string(),
        currency: z.string(),
    }),
    side_currency: z.object({
        network: z.string(),
        currency: z.string(),
    }),
    side: z.enum(SideEnum),
    quantity: z.string().min(1),
    price: z.string().min(1),
    limit_min: z.string().min(1),
    limit_max: z.string().min(1),
});

type FormData = {
    currency: Currency;
    side_currency: Currency;
    side: SideEnum;
    quantity: string;
    price: string;
    limit_min: string;
    limit_max: string;
};

const createFormSchema = (t: (key: string) => string) =>
    formSchema
        .refine(
            data => {
                const currencyKey = `${data.currency.network}:${data.currency.currency}`;
                const sideCurrencyKey = `${data.side_currency.network}:${data.side_currency.currency}`;
                return currencyKey !== sideCurrencyKey;
            },
            {
                message: t('newOffer.errors.sameCurrency'),
                path: ['side_currency'],
            },
        )
        .refine(
            data => {
                const quantity = parseFloat(data.quantity);
                return !isNaN(quantity) && quantity > 0;
            },
            {
                message: t('newOffer.errors.invalidQuantity'),
                path: ['quantity'],
            },
        )
        .refine(
            data => {
                const price = parseFloat(data.price);
                return !isNaN(price) && price > 0;
            },
            {
                message: t('newOffer.errors.invalidPrice'),
                path: ['price'],
            },
        )
        .refine(
            data => {
                const limitMin = parseFloat(data.limit_min);
                return !isNaN(limitMin) && limitMin > 0;
            },
            {
                message: t('newOffer.errors.invalidLimitMin'),
                path: ['limit_min'],
            },
        )
        .refine(
            data => {
                const limitMax = parseFloat(data.limit_max);
                return !isNaN(limitMax) && limitMax > 0;
            },
            {
                message: t('newOffer.errors.invalidLimitMax'),
                path: ['limit_max'],
            },
        )
        .refine(
            data => {
                const limitMin = parseFloat(data.limit_min);
                const limitMax = parseFloat(data.limit_max);
                return (
                    isNaN(limitMin) || isNaN(limitMax) || limitMax >= limitMin
                );
            },
            {
                message: t('newOffer.errors.limit_maxLessThanMin'),
                path: ['limit_max'],
            },
        )
        .refine(
            data => {
                const quantity = parseFloat(data.quantity);
                const price = parseFloat(data.price);
                const limitMax = parseFloat(data.limit_max);
                return (
                    isNaN(quantity) ||
                    isNaN(price) ||
                    isNaN(limitMax) ||
                    quantity * price >= limitMax
                );
            },
            {
                message: t('newOffer.errors.limit_maxExceedsTotal'),
                path: ['limit_max'],
            },
        );

// Picker options - These will be translated in the component
const getSideOptions = (t: (key: string) => string): PickerOption[] => [
    {
        label: t('newOffer.form.side.buy'),
        value: SideEnum.BUY,
    },
    {
        label: t('newOffer.form.side.sell'),
        value: SideEnum.SELL,
    },
];

const NewOffer: React.FC<NewOfferProps> = ({navigation}) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');
    const store = useAppStore();
    const {token} = useContext(P2PContext);
    const createOfferMutation = useCreateOffer(token || '');
    const {data: balances} = useBalances(token);
    const {getCurrencyIcon} = useBalanceUtils();

    const validationSchema = useMemo(() => createFormSchema(t), [t]);
    const sideOptions = useMemo(() => getSideOptions(t), [t]);

    const {
        control,
        handleSubmit,
        formState: {errors, isValid},
        watch,
        trigger,
    } = useForm({
        resolver: zodResolver(validationSchema),
        mode: 'onChange',
        defaultValues: {
            currency: MEX_CURRENCIES[0] as Currency,
            side_currency: MEX_CURRENCIES[1] as Currency,
            side: SideEnum.BUY,
            quantity: '',
            price: '',
            limit_min: '',
            limit_max: '',
        },
    });

    const sideCurrency = watch('side_currency');
    const currency = watch('currency');
    const side = watch('side');

    // Trigger validation when either currency changes
    useEffect(() => {
        trigger('side_currency');
    }, [currency, sideCurrency, trigger]);

    // Get the available balance for quantity
    // For SELL offers (offeror buying): use side_currency balance
    // For BUY offers (offeror selling): use currency balance
    const getAvailableBalance = useMemo(() => {
        if (!balances) return 0;

        const targetCurrency = side === SideEnum.SELL ? sideCurrency : currency;
        const balance = balances.find(
            b =>
                b.currency === targetCurrency.currency &&
                b.network === targetCurrency.network,
        );

        return balance?.balance || 0;
    }, [balances, side, sideCurrency, currency]);

    const currencyOptions: PickerOption[] = useMemo(
        () =>
            MEX_CURRENCIES.map(crypto => ({
                label: crypto.currency!,
                value: JSON.stringify(crypto),
                description: CHAINS[crypto.network!].name,
                avatarProps: {
                    source: {
                        uri: getCurrencyIcon(crypto.network)({
                            currency: {
                                ticker: crypto.currency,
                                units: 0,
                            },
                        }),
                    },
                },
            })),
        [],
    );

    const onSubmit = async (formData: any) => {
        const createOfferConfirmed = async () => {
            store.setLoading(true);

            try {
                // Format currency string as "network:currency" (e.g., "microbitcoin:MBC", "TRON:USDT")
                const formatCurrency = (crypto: Currency): string => {
                    return `${crypto.network.toLocaleLowerCase()}:${
                        crypto.currency
                    }`;
                };

                await createOfferMutation.mutateAsync({
                    currency: formatCurrency(formData.currency),
                    side_currency: formatCurrency(formData.side_currency),
                    side: formData.side,
                    quantity:
                        formData.side === SideEnum.BUY
                            ? parseFloat(formData.quantity)
                            : parseFloat(formData.quantity) /
                              parseFloat(formData.price),
                    price: parseFloat(formData.price),
                    limit_min: parseFloat(formData.limit_min),
                    limit_max: parseFloat(formData.limit_max),
                });

                showMessage({
                    message: t('newOffer.alerts.offerCreated.message'),
                    description: t('newOffer.alerts.offerCreated.description'),
                    backgroundColor: Colors[scheme!].primary,
                });

                navigation.goBack();
            } catch (e) {
                showMessage({
                    message: t('newOffer.alerts.error.message'),
                    description: (e as Error).message,
                    type: 'danger',
                });
            } finally {
                store.setLoading(false);
            }
        };

        Alert.alert(
            t('newOffer.alerts.confirmation.message'),
            t('newOffer.alerts.confirmation.description', {
                side: formData.side,
                quantity:
                    formData.side === SideEnum.BUY
                        ? formData.quantity * formData.price
                        : formData.quantity / formData.price,
                currency: formData.currency.currency,
                price: formData.price,
                side_currency: formData.side_currency.currency,
                limit_min: formData.limit_min,
                limit_max: formData.limit_max,
            }),
            [
                {
                    text: t('newOffer.alerts.confirmation.cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: t('newOffer.alerts.confirmation.confirm'),
                    onPress: createOfferConfirmed,
                    style: 'default',
                },
            ],
            {cancelable: false},
        );
    };

    return (
        <DismissKeyboard>
            <Container>
                <KeyboardAvoidingView style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 20}}>
                        <VStack style={{gap: 8}}>
                            {/* Offer Type */}
                            <Controller
                                control={control}
                                name="side"
                                render={({field: {onChange, value}}) => (
                                    <FormItem
                                        title={t('newOffer.form.side.title')}
                                        description={t(
                                            'newOffer.form.side.description',
                                        )}>
                                        <BottomSheetPicker
                                            options={sideOptions}
                                            selectedValue={value}
                                            onValueChange={onChange}
                                            title={t(
                                                'newOffer.form.side.title',
                                            )}
                                        />
                                    </FormItem>
                                )}
                            />

                            {/* Currency Pair */}
                            <Controller
                                control={control}
                                name="currency"
                                render={({field: {onChange, value}}) => (
                                    <FormItem
                                        title={t(
                                            'newOffer.form.currency.title',
                                        )}
                                        description={t(
                                            'newOffer.form.currency.description',
                                        )}>
                                        <BottomSheetPicker
                                            options={currencyOptions}
                                            selectedValue={JSON.stringify(
                                                value,
                                            )}
                                            onValueChange={(val: string) => {
                                                try {
                                                    onChange(JSON.parse(val));
                                                } catch {
                                                    // ignore
                                                }
                                            }}
                                            title={t(
                                                'newOffer.form.currency.title',
                                            )}
                                        />
                                    </FormItem>
                                )}
                            />

                            <Controller
                                control={control}
                                name="side_currency"
                                render={({
                                    field: {onChange, value},
                                    fieldState: {error},
                                }) => (
                                    <FormItem
                                        title={t(
                                            'newOffer.form.side_currency.title',
                                        )}
                                        description={t(
                                            'newOffer.form.side_currency.description',
                                        )}>
                                        <BottomSheetPicker
                                            options={currencyOptions}
                                            selectedValue={JSON.stringify(
                                                value,
                                            )}
                                            onValueChange={(val: string) => {
                                                try {
                                                    onChange(JSON.parse(val));
                                                } catch {
                                                    // ignore
                                                }
                                            }}
                                            title={t(
                                                'newOffer.form.side_currency.title',
                                            )}
                                        />
                                        {error && (
                                            <Text
                                                variant="body3"
                                                color="error"
                                                style={{marginTop: 4}}>
                                                {error.message}
                                            </Text>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Quantity */}
                            <Controller
                                control={control}
                                name="quantity"
                                render={({
                                    field: {onChange, value},
                                    fieldState: {error},
                                }) => (
                                    <FormItem
                                        title={t(
                                            'newOffer.form.quantity.title',
                                        )}
                                        description={t(
                                            'newOffer.form.quantity.description',
                                        )}>
                                        <Input
                                            placeholder={t(
                                                'newOffer.form.quantity.placeholder',
                                            )}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="decimal-pad"
                                            rightContent={
                                                <HStack>
                                                    <Text
                                                        variant="body1"
                                                        color="textSecondary">
                                                        {side === SideEnum.SELL
                                                            ? sideCurrency.currency
                                                            : currency.currency}
                                                    </Text>
                                                    <Button
                                                        title="Max"
                                                        type="text"
                                                        color={
                                                            scheme === 'dark'
                                                                ? 'textPrimary'
                                                                : 'primary'
                                                        }
                                                        onPress={() =>
                                                            onChange(
                                                                getAvailableBalance.toString(),
                                                            )
                                                        }
                                                    />
                                                </HStack>
                                            }
                                        />
                                        {error && (
                                            <Text
                                                variant="body3"
                                                color="error"
                                                style={{marginTop: 4}}>
                                                {error.message}
                                            </Text>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Price */}
                            <Controller
                                control={control}
                                name="price"
                                render={({
                                    field: {onChange, value},
                                    fieldState: {error},
                                }) => (
                                    <FormItem
                                        title={t('newOffer.form.price.title')}
                                        description={t(
                                            'newOffer.form.price.description',
                                        )}>
                                        <Input
                                            placeholder={t(
                                                'newOffer.form.price.placeholder',
                                            )}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="decimal-pad"
                                            rightContent={
                                                <Text
                                                    variant="body1"
                                                    color="textSecondary">
                                                    {sideCurrency.currency}
                                                </Text>
                                            }
                                        />
                                        {error && (
                                            <Text
                                                variant="body3"
                                                color="error"
                                                style={{marginTop: 4}}>
                                                {error.message}
                                            </Text>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Min Limit */}
                            <Controller
                                control={control}
                                name="limit_min"
                                render={({
                                    field: {onChange, value},
                                    fieldState: {error},
                                }) => (
                                    <FormItem
                                        title={t(
                                            'newOffer.form.limit_min.title',
                                        )}
                                        description={t(
                                            'newOffer.form.limit_min.description',
                                        )}>
                                        <Input
                                            placeholder={t(
                                                'newOffer.form.limit_min.placeholder',
                                            )}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="decimal-pad"
                                            rightContent={
                                                <Text
                                                    variant="body1"
                                                    color="textSecondary">
                                                    {sideCurrency.currency}
                                                </Text>
                                            }
                                        />
                                        {error && (
                                            <Text
                                                variant="body3"
                                                color="error"
                                                style={{marginTop: 4}}>
                                                {error.message}
                                            </Text>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Max Limit */}
                            <Controller
                                control={control}
                                name="limit_max"
                                render={({
                                    field: {onChange, value},
                                    fieldState: {error},
                                }) => (
                                    <FormItem
                                        title={t(
                                            'newOffer.form.limit_max.title',
                                        )}
                                        description={t(
                                            'newOffer.form.limit_max.description',
                                        )}>
                                        <Input
                                            placeholder={t(
                                                'newOffer.form.limit_max.placeholder',
                                            )}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="decimal-pad"
                                            rightContent={
                                                <Text
                                                    variant="body1"
                                                    color="textSecondary">
                                                    {sideCurrency.currency}
                                                </Text>
                                            }
                                        />
                                        {error && (
                                            <Text
                                                variant="body3"
                                                color="error"
                                                style={{marginTop: 4}}>
                                                {error.message}
                                            </Text>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </VStack>
                    </ScrollView>
                    <Container
                        style={[
                            styles.bottomContainer,
                            {
                                borderColor: Colors[scheme!].border,
                                paddingBottom: 16,
                                paddingTop: 16,
                            },
                        ]}>
                        <Button
                            title={t('newOffer.createButton')}
                            disabled={
                                !isValid ||
                                createOfferMutation.isPending ||
                                !token
                            }
                            onPress={handleSubmit(onSubmit)}
                        />
                    </Container>
                </KeyboardAvoidingView>
            </Container>
        </DismissKeyboard>
    );
};

export default NewOffer;
