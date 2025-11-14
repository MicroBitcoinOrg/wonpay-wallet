import React, {useContext, useState} from 'react';
import {Alert, ScrollView, StyleSheet, useColorScheme} from 'react-native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {P2PContext} from '@/providers';
import {
    Container,
    DismissKeyboard,
    KeyboardAvoidingView,
    VStack,
} from '@/components/common';
import {Button} from '@/components/extended';
import {Amount, OfferDetails, Total} from './layout';
import {Colors} from '@/theme';
import useAppStore from '@/store/appStore';
import {useQueryClient} from '@tanstack/react-query';
import {useCreateTrade} from '@/services/mex/hooks';
import {StackScreenProps} from '@react-navigation/stack';
import {Navigation} from '@/types/Navigation';
import {SideEnum} from '@/services/mex/api';

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
        paddingBottom: 16,
        paddingTop: 16,
    },
});

type NewTradeProps = StackScreenProps<Navigation.P2PParamList, 'NewTrade'>;

const NewTrade: React.FC<NewTradeProps> = ({navigation, route}) => {
    const queryClient = useQueryClient();
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');
    const store = useAppStore();
    const {token} = useContext(P2PContext);
    const offer = route.params;

    const [amount, setAmount] = useState<string>('');
    const createTradeMutation = useCreateTrade(token || '');

    const isAmountValid = () => {
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount)) {
            return false;
        }

        // Check against offer limits
        const tradeValue = numAmount * offer.price;
        return tradeValue >= offer.limit_min && tradeValue <= offer.limit_max;
    };

    const createTrade = async () => {
        const numAmount = parseFloat(amount);

        const createTradeConfirmed = async () => {
            store.setLoading(true);

            try {
                const trade = await createTradeMutation.mutateAsync({
                    reference: offer.reference,
                    data: {
                        amount:
                            offer.side === SideEnum.BUY
                                ? numAmount / offer.price
                                : numAmount,
                    },
                });

                showMessage({
                    message: t('newTrade.alerts.tradeCreated.message'),
                    description: t('newTrade.alerts.tradeCreated.description'),
                    backgroundColor: Colors[scheme!].primary,
                });

                store.setLoading(false);

                // Navigate back to P2P main screen
                // TODO: Navigate to trade details when TradeDetails screen is implemented
                // navigation.navigate('TradeDetails', {trade_reference: trade.reference});
                navigation.goBack();
            } catch (e) {
                showMessage({
                    message: t('newTrade.alerts.error.message'),
                    description: (e as Error).message,
                    type: 'danger',
                });

                store.setLoading(false);
                navigation.goBack();
            }
        };

        Alert.alert(
            t('newTrade.alerts.tradeConfirmation.message'),
            t('newTrade.alerts.tradeConfirmation.description', {
                amount: (offer.side === SideEnum.BUY
                    ? numAmount / offer.price
                    : numAmount * offer.price
                ).toFixed(2),
                currency: offer.offeror_currency.currency,
                total: Number(amount).toFixed(2),
                sideCurrency: offer.trader_currency.currency,
            }),
            [
                {
                    text: t('newTrade.alerts.tradeConfirmation.cancel'),
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: t('newTrade.alerts.tradeConfirmation.confirm'),
                    onPress: createTradeConfirmed,
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <VStack flex={1}>
                            <Amount
                                amount={amount}
                                setAmount={setAmount}
                                offer={offer}
                            />
                        </VStack>
                        <OfferDetails offer={offer} />
                    </ScrollView>
                    <Container
                        style={[
                            styles.bottomContainer,
                            {
                                borderColor: Colors[scheme!].border,
                            },
                        ]}>
                        <Total amount={amount} offer={offer} />
                        <Button
                            title={t('newTrade.confirmButton')}
                            disabled={
                                !isAmountValid() ||
                                createTradeMutation.isPending
                            }
                            onPress={createTrade}
                        />
                    </Container>
                </KeyboardAvoidingView>
            </Container>
        </DismissKeyboard>
    );
};

export default NewTrade;
