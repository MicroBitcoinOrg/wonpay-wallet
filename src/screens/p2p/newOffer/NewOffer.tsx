import React, {useContext, useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
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

interface FormData {
    currency: Currency;
    side_currency: Currency;
    side: SideEnum;
    quantity: string;
    price: string;
    limit_min: string;
    limit_max: string;
    sns_name: string;
    sns_id: string;
    memo: string;
}

interface FormErrors {
    quantity?: string;
    price?: string;
    limit_min?: string;
    limit_max?: string;
    sns_name?: string;
    sns_id?: string;
}

const CURRENCIES: Currency[] = [
    {network: 'microbitcoin', currency: 'TEST'},
    {network: 'TRON', currency: 'USDT'},
];

// Picker options
const SIDE_OPTIONS: PickerOption[] = [
    {
        label: 'Buy',
        value: SideEnum.BUY,
    },
    {
        label: 'Sell',
        value: SideEnum.SELL,
    },
];

const SNS_OPTIONS: PickerOption[] = [
    {label: 'Telegram', value: 'Telegram'},
    {label: 'WhatsApp', value: 'WhatsApp'},
    {label: 'WeChat', value: 'WeChat'},
    {label: 'Discord', value: 'Discord'},
    {label: 'Signal', value: 'Signal'},
];

const NewOffer: React.FC<NewOfferProps> = ({navigation}) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');
    const store = useAppStore();
    const {token} = useContext(P2PContext);

    const [formData, setFormData] = useState<FormData>({
        currency: CURRENCIES[0],
        side_currency: CURRENCIES[1],
        side: SideEnum.SELL,
        quantity: '',
        price: '',
        limit_min: '',
        limit_max: '',
        sns_name: 'Telegram',
        sns_id: '',
        memo: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const createOfferMutation = useCreateOffer(token || '');

    const currencyOptions: PickerOption[] = useMemo(
        () =>
            CURRENCIES.map(crypto => ({
                label: crypto.currency!,
                value: JSON.stringify(crypto),
                description: crypto.network!,
            })),
        [CURRENCIES],
    );

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validate quantity
        const quantity = parseFloat(formData.quantity);
        if (!formData.quantity || isNaN(quantity) || quantity <= 0) {
            newErrors.quantity = t('newOffer.errors.invalidQuantity');
        }

        // Validate price
        const price = parseFloat(formData.price);
        if (!formData.price || isNaN(price) || price <= 0) {
            newErrors.price = t('newOffer.errors.invalidPrice');
        }

        // Validate limit min
        const limit_min = parseFloat(formData.limit_min);
        if (!formData.limit_min || isNaN(limit_min) || limit_min <= 0) {
            newErrors.limit_min = t('newOffer.errors.invalidLimitMin');
        }

        // Validate limit max
        const limit_max = parseFloat(formData.limit_max);
        if (!formData.limit_max || isNaN(limit_max) || limit_max <= 0) {
            newErrors.limit_max = t('newOffer.errors.invalidLimitMax');
        } else if (!isNaN(limit_min) && limit_max < limit_min) {
            newErrors.limit_max = t('newOffer.errors.limit_maxLessThanMin');
        }

        // Validate total availability
        if (
            !isNaN(quantity) &&
            !isNaN(price) &&
            !isNaN(limit_max) &&
            quantity * price < limit_max
        ) {
            newErrors.limit_max = t('newOffer.errors.limit_maxExceedsTotal');
        }

        // Validate SNS name
        if (!formData.sns_name.trim()) {
            newErrors.sns_name = t('newOffer.errors.invalidSnsName');
        }

        // Validate SNS ID
        if (!formData.sns_id.trim()) {
            newErrors.sns_id = t('newOffer.errors.invalidSnsId');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateField = (field: keyof FormData, value: string | Currency) => {
        // Handle cryptocurrency fields
        if (field === 'currency' || field === 'side_currency') {
            if (typeof value === 'string') {
                try {
                    const crypto = JSON.parse(value) as Currency;
                    setFormData(prev => ({...prev, [field]: crypto}));
                } catch {
                    // If parsing fails, ignore
                    return;
                }
            } else {
                setFormData(prev => ({...prev, [field]: value}));
            }
        } else {
            setFormData(prev => ({...prev, [field]: value}));
        }
        // Clear error for this field when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({...prev, [field]: undefined}));
        }
    };

    const createOffer = async () => {
        if (!validateForm()) {
            showMessage({
                message: t('newOffer.alerts.validationError.message'),
                description: t('newOffer.alerts.validationError.description'),
                type: 'danger',
            });
            return;
        }

        const createOfferConfirmed = async () => {
            store.setLoading(true);

            try {
                // Format currency string as "network:currency" (e.g., "microbitcoin:MBC", "TRON:USDT")
                const formatCurrency = (crypto: Currency): string => {
                    return `${crypto.network?.toLocaleLowerCase()}:${
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
                    sns_name: formData.sns_name,
                    sns_id: formData.sns_id,
                    memo: formData.memo,
                });

                showMessage({
                    message: t('newOffer.alerts.offerCreated.message'),
                    description: t('newOffer.alerts.offerCreated.description'),
                    backgroundColor: Colors[scheme!].primary,
                });

                store.setLoading(false);
                navigation.goBack();
            } catch (e) {
                showMessage({
                    message: t('newOffer.alerts.error.message'),
                    description: (e as Error).message,
                    type: 'danger',
                });

                store.setLoading(false);
            }
        };

        const getCurrencyLabel = (crypto: Currency): string => {
            return crypto.network
                ? `${crypto.currency} (${crypto.network})`
                : crypto.currency;
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

    const isFormValid = () => {
        return (
            formData.quantity &&
            formData.price &&
            formData.limit_min &&
            formData.limit_max &&
            formData.sns_name &&
            formData.sns_id &&
            Object.keys(errors).length === 0
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
                            <FormItem
                                title={t('newOffer.form.side.title')}
                                description={t(
                                    'newOffer.form.side.description',
                                )}>
                                <BottomSheetPicker
                                    options={SIDE_OPTIONS}
                                    selectedValue={formData.side}
                                    onValueChange={(value: string) =>
                                        updateField('side', value)
                                    }
                                    title={t('newOffer.form.side.title')}
                                />
                            </FormItem>

                            {/* Currency Pair */}
                            <FormItem
                                title={t('newOffer.form.currency.title')}
                                description={t(
                                    'newOffer.form.currency.description',
                                )}>
                                <BottomSheetPicker
                                    options={currencyOptions}
                                    selectedValue={JSON.stringify(
                                        formData.currency,
                                    )}
                                    onValueChange={(value: string) =>
                                        updateField('currency', value)
                                    }
                                    title={t('newOffer.form.currency.title')}
                                />
                            </FormItem>

                            <FormItem
                                title={t('newOffer.form.side_currency.title')}
                                description={t(
                                    'newOffer.form.side_currency.description',
                                )}>
                                <BottomSheetPicker
                                    options={currencyOptions}
                                    selectedValue={JSON.stringify(
                                        formData.side_currency,
                                    )}
                                    onValueChange={(value: string) =>
                                        updateField('side_currency', value)
                                    }
                                    title={t(
                                        'newOffer.form.side_currency.title',
                                    )}
                                />
                            </FormItem>

                            {/* Quantity */}
                            <FormItem
                                title={t('newOffer.form.quantity.title')}
                                description={t(
                                    'newOffer.form.quantity.description',
                                )}>
                                <Input
                                    placeholder={t(
                                        'newOffer.form.quantity.placeholder',
                                    )}
                                    value={formData.quantity}
                                    onChangeText={value =>
                                        updateField('quantity', value)
                                    }
                                    keyboardType="decimal-pad"
                                />
                                {errors.quantity && (
                                    <Text
                                        variant="body3"
                                        color="error"
                                        style={{marginTop: 4}}>
                                        {errors.quantity}
                                    </Text>
                                )}
                            </FormItem>

                            {/* Price */}
                            <FormItem
                                title={t('newOffer.form.price.title')}
                                description={t(
                                    'newOffer.form.price.description',
                                    {
                                        side_currency: `${formData.side_currency.currency} (${formData.side_currency.network})`,
                                    },
                                )}>
                                <Input
                                    placeholder={t(
                                        'newOffer.form.price.placeholder',
                                    )}
                                    value={formData.price}
                                    onChangeText={value =>
                                        updateField('price', value)
                                    }
                                    keyboardType="decimal-pad"
                                />
                                {errors.price && (
                                    <Text
                                        variant="body3"
                                        color="error"
                                        style={{marginTop: 4}}>
                                        {errors.price}
                                    </Text>
                                )}
                            </FormItem>

                            {/* Min Limit */}
                            <FormItem
                                title={t('newOffer.form.limit_min.title')}
                                description={t(
                                    'newOffer.form.limit_min.description',
                                    {
                                        side_currency: `${formData.side_currency.currency} (${formData.side_currency.network})`,
                                    },
                                )}>
                                <Input
                                    placeholder={t(
                                        'newOffer.form.limit_min.placeholder',
                                    )}
                                    value={formData.limit_min}
                                    onChangeText={value =>
                                        updateField('limit_min', value)
                                    }
                                    keyboardType="decimal-pad"
                                />
                                {errors.limit_min && (
                                    <Text
                                        variant="body3"
                                        color="error"
                                        style={{marginTop: 4}}>
                                        {errors.limit_min}
                                    </Text>
                                )}
                            </FormItem>

                            {/* Max Limit */}
                            <FormItem
                                title={t('newOffer.form.limit_max.title')}
                                description={t(
                                    'newOffer.form.limit_max.description',
                                    {
                                        side_currency: `${formData.side_currency.currency} (${formData.side_currency.network})`,
                                    },
                                )}>
                                <Input
                                    placeholder={t(
                                        'newOffer.form.limit_max.placeholder',
                                    )}
                                    value={formData.limit_max}
                                    onChangeText={value =>
                                        updateField('limit_max', value)
                                    }
                                    keyboardType="decimal-pad"
                                />
                                {errors.limit_max && (
                                    <Text
                                        variant="body3"
                                        color="error"
                                        style={{marginTop: 4}}>
                                        {errors.limit_max}
                                    </Text>
                                )}
                            </FormItem>

                            {/* Contact Method */}
                            <FormItem
                                title={t('newOffer.form.sns_name.title')}
                                description={t(
                                    'newOffer.form.sns_name.description',
                                )}>
                                <BottomSheetPicker
                                    options={SNS_OPTIONS}
                                    selectedValue={formData.sns_name}
                                    onValueChange={value =>
                                        updateField('sns_name', value)
                                    }
                                    title={t('newOffer.form.sns_name.title')}
                                />
                            </FormItem>

                            <FormItem
                                title={t('newOffer.form.sns_id.title')}
                                description={t(
                                    'newOffer.form.sns_id.description',
                                )}>
                                <Input
                                    placeholder={t(
                                        'newOffer.form.sns_id.placeholder',
                                    )}
                                    value={formData.sns_id}
                                    onChangeText={value =>
                                        updateField('sns_id', value)
                                    }
                                    autoCapitalize="none"
                                />
                                {errors.sns_id && (
                                    <Text
                                        variant="body3"
                                        color="error"
                                        style={{marginTop: 4}}>
                                        {errors.sns_id}
                                    </Text>
                                )}
                            </FormItem>

                            {/* Memo (Optional) */}
                            <FormItem
                                title={t('newOffer.form.memo.title')}
                                optional
                                description={t(
                                    'newOffer.form.memo.description',
                                )}>
                                <Input
                                    placeholder={t(
                                        'newOffer.form.memo.placeholder',
                                    )}
                                    value={formData.memo}
                                    onChangeText={value =>
                                        updateField('memo', value)
                                    }
                                    multiline
                                    numberOfLines={3}
                                />
                            </FormItem>
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
                                !isFormValid() ||
                                createOfferMutation.isPending ||
                                !token
                            }
                            onPress={createOffer}
                        />
                    </Container>
                </KeyboardAvoidingView>
            </Container>
        </DismissKeyboard>
    );
};

export default NewOffer;
