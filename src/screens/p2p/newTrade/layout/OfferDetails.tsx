import React from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {HStack, Text, VStack} from '../../../../components/common';
import {Colors} from '../../../../theme';
import {useTranslation} from 'react-i18next';
import NumberFormat from 'react-number-format';
import {CryptoOfferResponse} from '../../../../services/mex/api/types';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {format} from 'date-fns';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
    },
    infoBox: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
    },
});

interface OfferDetailsProps {
    offer: CryptoOfferResponse;
}

const OfferDetails = ({offer}: OfferDetailsProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');

    return (
        <VStack
            style={[
                styles.container,
                {
                    backgroundColor: Colors[scheme!].card,

                    gap: 16,
                },
            ]}>
            <HStack justifyContent="space-between" style={{width: '100%'}}>
                <VStack>
                    <HStack style={{gap: 4}}>
                        <Text variant="body1">
                            {offer.offeror_currency.currency}
                        </Text>
                        <IoniconsIcon
                            size={16}
                            color={Colors[scheme!].textPrimary}
                            name="swap-horizontal"
                        />
                        <Text variant="body1">
                            {offer.trader_currency.currency}
                        </Text>
                    </HStack>
                </VStack>
                <VStack>
                    <NumberFormat
                        displayType="text"
                        value={offer.price}
                        decimalScale={4}
                        suffix={` ${offer.trader_currency.currency}`}
                        thousandSeparator
                        fixedDecimalScale
                        renderText={value => (
                            <Text variant="body1">{value}</Text>
                        )}
                    />
                </VStack>
            </HStack>

            <HStack
                justifyContent="space-between"
                flex={1}
                style={{
                    gap: 4,
                    width: '100%',
                }}>
                <Text variant="body3" color="textSecondary">
                    {t('marketplace.limit')}
                </Text>
                <HStack justifyContent="flex-start">
                    <NumberFormat
                        displayType="text"
                        value={offer.limit_min}
                        decimalScale={2}
                        thousandSeparator
                        fixedDecimalScale
                        renderText={value => (
                            <Text variant="body3">{value}</Text>
                        )}
                    />
                    <Text variant="body3">-</Text>
                    <NumberFormat
                        displayType="text"
                        value={offer.limit_max}
                        decimalScale={2}
                        suffix={` ${offer.trader_currency.currency}`}
                        thousandSeparator
                        fixedDecimalScale
                        renderText={value => (
                            <Text variant="body3">{value}</Text>
                        )}
                    />
                </HStack>
            </HStack>
            <HStack
                justifyContent="space-between"
                flex={1}
                style={{
                    gap: 4,
                    width: '100%',
                }}>
                <Text variant="body3" color="textSecondary">
                    {t('marketplace.available')}
                </Text>
                <NumberFormat
                    displayType="text"
                    value={offer.quantity}
                    decimalScale={2}
                    suffix={` ${offer.offeror_currency.currency}`}
                    thousandSeparator
                    fixedDecimalScale
                    renderText={value => <Text variant="body3">{value}</Text>}
                />
            </HStack>

            {offer.memo && (
                <HStack
                    justifyContent="space-between"
                    style={{width: '100%', gap: 4}}>
                    <Text variant="body3" color="textSecondary">
                        {t('newTrade.offerDetails.memo')}
                    </Text>
                    <Text variant="body3" style={{marginTop: 4}}>
                        {offer.memo}
                    </Text>
                </HStack>
            )}

            <HStack
                justifyContent="space-between"
                style={{width: '100%', gap: 4}}>
                <Text variant="body3" color="textSecondary">
                    {t('newTrade.offerDetails.seller')}
                </Text>
                <Text variant="body3" style={{marginTop: 4}}>
                    {offer.user.username ||
                        offer.user.address.slice(0, 16) + '...'}
                </Text>
            </HStack>
        </VStack>
    );
};

export default OfferDetails;
