import React, {useContext, useMemo} from 'react';
import {Alert, ScrollView, StyleSheet, useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {P2PContext} from '../../../providers';
import {
    Container,
    DismissKeyboard,
    KeyboardAvoidingView,
    VStack,
    Text,
} from '../../../components/common';
import {
    Button,
    FormItem,
    Input,
    BottomSheetPicker,
} from '../../../components/extended';
import type {PickerOption} from '../../../components/extended';
import {Colors} from '../../../theme';
import useAppStore from '../../../store/appStore';
import {useCreateOffer} from '../../../services/mex/hooks';
import {StackScreenProps} from '@react-navigation/stack';
import {Navigation} from '../../../types/Navigation';
import {Currency, SideEnum} from '../../../services/mex/api/types';
import {MEX_CURRENCIES} from '../../../utils/constants';

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
    side: z.nativeEnum(SideEnum),
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

    const validationSchema = useMemo(() => createFormSchema(t), [t]);
    const sideOptions = useMemo(() => getSideOptions(t), [t]);

    const {
        control,
        handleSubmit,
        formState: {errors, isValid},
        watch,
    } = useForm({
        resolver: zodResolver(validationSchema),
        mode: 'onChange',
        defaultValues: {
            currency: MEX_CURRENCIES[0] as Currency,
            side_currency: MEX_CURRENCIES[1] as Currency,
            side: SideEnum.SELL,
            quantity: '',
            price: '',
            limit_min: '',
            limit_max: '',
        },
    });

    const sideCurrency = watch('side_currency');

    const currencyOptions: PickerOption[] = useMemo(
        () =>
            MEX_CURRENCIES.map(crypto => ({
                label: crypto.currency!,
                value: JSON.stringify(crypto),
                description: crypto.network!,
            })),
        [],
    );

    const getCurrencyLabel = (crypto: Currency): string => {
        return `${crypto.currency} (${crypto.network})`;
    };

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
                    quantity: parseFloat(formData.quantity),
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
                quantity: formData.quantity,
                currency: getCurrencyLabel(formData.currency),
                price: formData.price,
                side_currency: getCurrencyLabel(formData.side_currency),
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
                                render={({field: {onChange, value}}) => (
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
                                            {
                                                side_currency: `${sideCurrency.currency} (${sideCurrency.network})`,
                                            },
                                        )}>
                                        <Input
                                            placeholder={t(
                                                'newOffer.form.price.placeholder',
                                            )}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="decimal-pad"
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
                                            {
                                                side_currency: `${sideCurrency.currency} (${sideCurrency.network})`,
                                            },
                                        )}>
                                        <Input
                                            placeholder={t(
                                                'newOffer.form.limit_min.placeholder',
                                            )}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="decimal-pad"
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
                                            {
                                                side_currency: `${sideCurrency.currency} (${sideCurrency.network})`,
                                            },
                                        )}>
                                        <Input
                                            placeholder={t(
                                                'newOffer.form.limit_max.placeholder',
                                            )}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="decimal-pad"
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
