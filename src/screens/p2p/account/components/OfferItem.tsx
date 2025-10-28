import {HStack, Text, VStack} from '@/components/common';
import {Pressable, useColorScheme, View} from 'react-native';
import {Colors} from '@/theme';
import React, {useContext} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Navigation} from '@/types/Navigation';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {NumericFormat} from 'react-number-format';
import {format} from 'date-fns';
import {Badge, Button} from '@/components/extended';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import {showMessage} from 'react-native-flash-message';
import {useQueryClient} from '@tanstack/react-query';
import {P2PContext} from '@/providers';
import {CryptoOfferResponse} from '@/services/mex/api/types';
import {useDeleteOffer} from '@/services/mex/hooks';
import {useTranslation} from 'react-i18next';

interface Props extends CryptoOfferResponse {}

const Component = (props: Props) => {
    const {t} = useTranslation('p2p');
    const queryClient = useQueryClient();
    const {token} = useContext(P2PContext);
    const {
        side,
        quantity,
        created,
        price,
        currency,
        filled,
        side_currency,
        offeror_currency,
        limit_min,
        limit_max,
        reference,
    } = props;
    const navigation = useNavigation<NavigationProp<Navigation.P2PParamList>>();
    const scheme = useColorScheme();
    const deleteOfferMutation = useDeleteOffer(token || '');

    const navigateToOfferDetails = () => {
        // Navigate to marketplace to see all offers or implement offer management screen
        // For now, this is intentionally left empty as users manage offers from this list
    };

    const handleDeleteOffer = async () => {
        try {
            await deleteOfferMutation.mutateAsync({reference});
            showMessage({
                message: t('myOffers.offerDeleted'),
                type: 'success',
            });
        } catch (e) {
            showMessage({
                message: t('myOffers.deleteOfferFailed'),
                description: String(e),
                type: 'danger',
            });
        }
    };

    return (
        <Pressable onPress={navigateToOfferDetails}>
            <VStack
                style={{
                    padding: 16,
                    gap: 16,
                    borderBottomWidth: 1,
                    borderColor: Colors[scheme!].border,
                }}
                justifyContent="flex-start"
                alignItems="flex-start">
                <HStack justifyContent="space-between" style={{width: '100%'}}>
                    <VStack gap={4}>
                        <HStack style={{gap: 4}} justifyContent="flex-start">
                            <NumericFormat
                                displayType="text"
                                value={price}
                                decimalScale={2}
                                suffix={` ${side_currency.currency}`}
                                thousandSeparator
                                fixedDecimalScale
                                renderText={value => (
                                    <Text variant="body1">{value}</Text>
                                )}
                            />
                            <IoniconsIcon
                                size={16}
                                color={Colors[scheme!].textSecondary}
                                name="swap-horizontal"
                            />
                            <Text variant="body1" color="textSecondary">
                                1.00 {currency.currency}
                            </Text>
                        </HStack>
                        <Text color="textSecondary" variant="sub1">
                            {format(new Date(created * 1000), 'd MMM yyyy')}
                        </Text>
                    </VStack>

                    <Badge
                        label={t(`marketplace.${side}`)}
                        style={{backgroundColor: Colors[scheme!].card}}
                    />
                </HStack>

                <VStack
                    backgroundColor={Colors[scheme!].card}
                    gap={16}
                    borderRadius={10}
                    padding={16}
                    width="100%">
                    <HStack width="100%" justifyContent="space-between">
                        <Text variant="body3" color="textSecondary">
                            {t('marketplace.limit')}
                        </Text>
                        <HStack justifyContent="flex-start">
                            <NumericFormat
                                displayType="text"
                                value={limit_min}
                                decimalScale={2}
                                thousandSeparator
                                fixedDecimalScale
                                renderText={value => (
                                    <Text variant="body3">{value}</Text>
                                )}
                            />
                            <Text variant="body3">-</Text>
                            <NumericFormat
                                displayType="text"
                                value={limit_max}
                                decimalScale={2}
                                suffix={` ${side_currency.currency}`}
                                thousandSeparator
                                fixedDecimalScale
                                renderText={value => (
                                    <Text variant="body3">{value}</Text>
                                )}
                            />
                        </HStack>
                    </HStack>
                    <HStack width="100%" justifyContent="space-between">
                        <Text variant="body3" color="textSecondary">
                            {t('marketplace.available')}
                        </Text>
                        <NumericFormat
                            displayType="text"
                            value={quantity - filled}
                            decimalScale={2}
                            suffix={` ${offeror_currency.currency}`}
                            thousandSeparator
                            fixedDecimalScale
                            renderText={value => (
                                <Text variant="body3">{value}</Text>
                            )}
                        />
                    </HStack>
                </VStack>
                <Button
                    onPress={handleDeleteOffer}
                    fullWidth
                    title={t('myOffers.remove')}
                    color="error"
                    border
                    disabled={deleteOfferMutation.isPending}
                    leftContent={
                        <OcticonsIcon
                            color={Colors[scheme!].black}
                            size={16}
                            name="trash"
                        />
                    }
                />
            </VStack>
        </Pressable>
    );
};

export default Component;
