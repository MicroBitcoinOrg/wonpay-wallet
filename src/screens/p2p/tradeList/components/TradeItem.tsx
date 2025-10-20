import {Avatar, HStack, Text} from '../../../../components/common';
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
    const {created, amount, offer, status, reference} = props;
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
            <HStack justifyContent="space-between" style={{width: '100%'}}>
                <HStack style={{gap: 8}}>
                    <Avatar
                        size="sm"
                        backgroundColor="card"
                        color="textSecondary">
                        <IoniconsIcon size={20} name="swap-horizontal" />
                    </Avatar>
                    <View>
                        <View style={{gap: 4}}>
                            <Text variant="body1">
                                {isMyOffer
                                    ? t('trades.selling')
                                    : t('trades.buying')}
                            </Text>
                            <NumberFormat
                                displayType="text"
                                value={amount}
                                decimalScale={2}
                                suffix={` ${offer.currency}`}
                                thousandSeparator
                                fixedDecimalScale
                                renderText={value => (
                                    <Text variant="body3" color="textSecondary">
                                        {value}
                                    </Text>
                                )}
                            />
                        </View>
                        <Text color="textSecondary" variant="sub1">
                            {format(new Date(created * 1000), 'd MMM yyyy HH:mm')}
                        </Text>
                    </View>
                </HStack>
                <Badge
                    label={t(`trades.status.${status}`)}
                    color={getStatusColor()}
                />
            </HStack>
        </Pressable>
    );
};

export default Component;
