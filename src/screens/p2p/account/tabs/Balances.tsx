import React, {useContext} from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Colors} from '@/theme';
import {P2PContext} from '@/providers';
import {useBalances} from '@/services/mex/hooks';
import {useTranslation} from 'react-i18next';
import {Avatar, HStack, Text, VStack} from '@/components/common';
import {NumericFormat} from 'react-number-format';
import {NotFound} from '@/components/extended';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
});

const Balances = () => {
    const {t} = useTranslation('p2p');
    const {token} = useContext(P2PContext);
    const scheme = useColorScheme();

    const {
        data: balances,
        isRefetching,
        isLoading,
        refetch,
    } = useBalances(token);

    if (!balances || balances.length === 0) {
        return <NotFound description={t('account.noBalances')} />;
    }

    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={{paddingBottom: 90, paddingTop: 10}}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading || isRefetching}
                    onRefresh={refetch}
                    tintColor={Colors[scheme!].textPrimary}
                />
            }
            data={balances}
            keyExtractor={(item, index) =>
                `${item.currency}-${item.network}-${index}`
            }
            renderItem={({item}) => (
                <HStack
                    justifyContent="space-between"
                    borderBottomWidth={0.5}
                    borderColor={Colors[scheme!].border}
                    paddingHorizontal={20}
                    paddingVertical={15}>
                    <HStack gap={16}>
                        <Avatar
                            backgroundColor="card"
                            color="textSecondary"
                            title={item.currency}></Avatar>
                        <VStack gap={4}>
                            <Text variant="body1" color="textPrimary">
                                {item.currency}
                            </Text>
                            <Text variant="sub1" color="textSecondary">
                                {item.network}
                            </Text>
                        </VStack>
                    </HStack>
                    <VStack gap={4} alignItems="flex-end">
                        <NumericFormat
                            displayType="text"
                            value={item.balance}
                            decimalScale={4}
                            thousandSeparator
                            fixedDecimalScale
                            renderText={value => (
                                <Text variant="body1">{value}</Text>
                            )}
                        />

                        {item.frozen > 0 && (
                            <NumericFormat
                                displayType="text"
                                value={item.frozen}
                                decimalScale={4}
                                thousandSeparator
                                fixedDecimalScale
                                renderText={value => (
                                    <Text variant="sub1" color="textSecondary">
                                        {value}
                                    </Text>
                                )}
                            />
                        )}
                    </VStack>
                </HStack>
            )}
        />
    );
};

export default Balances;
