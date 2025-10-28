import {HStack, Text, VStack} from '@/components/common';
import {Pressable, useColorScheme, View} from 'react-native';
import {Button} from '@/components/extended';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import {Colors} from '@/theme';
import React, {useContext} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Navigation} from '@/types/Navigation';
import {P2PContext, useWallet, WalletContext} from '@/providers';
import {NumericFormat} from 'react-number-format';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import {useQueryClient} from '@tanstack/react-query';
import {CryptoOfferResponse} from '@/services/mex/api/types';
import {useDeleteOffer} from '@/services/mex/hooks';
import {useTranslation} from 'react-i18next';

interface Props extends CryptoOfferResponse {}

const Component = (props: Props) => {
    const {t} = useTranslation('p2p');
    const queryClient = useQueryClient();
    const {token} = useContext(P2PContext);
    const {
        quantity,
        filled,
        user,
        price,
        reference,
        trader_currency,
        offeror_currency,
        currency,
        side_currency,
        limit_min,
        limit_max,
    } = props;
    const navigation = useNavigation<NavigationProp<Navigation.P2PParamList>>();
    const scheme = useColorScheme();
    const {wallet} = useWallet();

    const navigateToCreateTrade = () => {
        navigation.navigate('NewTrade', props);
    };

    const isMyOffer =
        wallet?.chains.microbitcoin.addresses?.[0]?.address === user.address;

    return (
        <Pressable onPress={isMyOffer ? undefined : navigateToCreateTrade}>
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
                    <View style={{gap: 4}}>
                        <Text variant="sub1" color="textSecondary">
                            {user.username ?? user.address}
                        </Text>

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
                    </View>
                    {!isMyOffer && (
                        <Button
                            onPress={navigateToCreateTrade}
                            title={t('marketplace.trade')}
                            size="md"
                            border
                            leftContent={
                                <OcticonsIcon
                                    color={Colors[scheme!].white}
                                    size={16}
                                    name="credit-card"
                                />
                            }
                        />
                    )}
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
            </VStack>
        </Pressable>
    );
};

export default Component;
