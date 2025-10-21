import {Avatar, HStack, Text, VStack} from '../../../../components/common';
import {Pressable, useColorScheme, View} from 'react-native';
import {Badge} from '../../../../components/extended';
import {Colors} from '../../../../theme';
import React, {useContext} from 'react';
import {WalletContext} from '../../../../providers';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import NumberFormat from 'react-number-format';
import {format} from 'date-fns';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Navigation} from '../../../../types/Navigation';
import {CryptoTradeResponse} from '../../../../services/mex/api/types';
import {useTranslation} from 'react-i18next';

interface Props extends CryptoTradeResponse {}

const Component = (props: Props) => {
    const {t} = useTranslation('p2p');
    const {created, amount, offer, status, reference, user} = props;
    const scheme = useColorScheme();
    const {wallet} = useContext(WalletContext);
    const navigation = useNavigation<NavigationProp<Navigation.P2PParamList>>();

    const isMyOffer = wallet?.addresses?.[0]?.address === offer.user.address;

    const navigateToTradeDetails = () => {
        navigation.navigate('TradeDetails', {trade_reference: reference});
    };

    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'secondary';
        }
    };

    return (
        <Pressable
            style={{
                padding: 16,
                gap: 16,
                borderBottomWidth: 1,
                borderColor: Colors[scheme!].border,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
            }}
            onPress={navigateToTradeDetails}>
            <HStack justifyContent="space-between" width="100%">
                <HStack gap={16} justifyContent="flex-start" flex={1}>
                    <Avatar
                        size="sm"
                        backgroundColor="card"
                        color="textSecondary">
                        <IoniconsIcon size={20} name="swap-horizontal" />
                    </Avatar>
                    <VStack gap={4}>
                        <Text variant="body1">
                            {isMyOffer
                                ? t('trades.selling')
                                : t('trades.buying')}
                        </Text>
                        <Text
                            color="textSecondary"
                            variant="sub1"
                            numberOfLines={1}>
                            {isMyOffer ? user.address : offer.user.address}
                        </Text>
                    </VStack>
                </HStack>
                <VStack alignItems="flex-end" gap={4} flex={1}>
                    <NumberFormat
                        displayType="text"
                        value={isMyOffer ? amount : amount * offer.price}
                        decimalScale={2}
                        suffix={` ${
                            isMyOffer
                                ? offer.trader_currency.currency
                                : offer.offeror_currency.currency
                        }`}
                        thousandSeparator
                        fixedDecimalScale
                        renderText={value => (
                            <Text
                                variant="body1"
                                numberOfLines={1}
                                color="textPrimary">
                                {value}
                            </Text>
                        )}
                    />
                    <Text color="textSecondary" variant="sub1">
                        {format(new Date(created * 1000), 'd MMM yyyy HH:mm')}
                    </Text>
                </VStack>
            </HStack>
        </Pressable>
    );
};

export default Component;
