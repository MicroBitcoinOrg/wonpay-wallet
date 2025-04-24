import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {WalletContext} from '../../../providers';
import {NotFound} from '../../../components/extended';
import {FlatList, View} from 'react-native';
import {CurrencyItem} from '../components';
import {useNavigation} from '@react-navigation/native';
import {Navigation} from '../../../types/Navigation';

interface TokensProps {
    isNFT?: boolean;
}

const Tokens: React.FC<TokensProps> = ({isNFT}) => {
    const navigation = useNavigation<Navigation.AppNavigationProp>();
    const {t} = useTranslation('tokens');
    const {wallet} = useContext(WalletContext);
    const tokens = wallet?.balances.filter(b => !b.main);

    return (
        <View style={{flex: 1}}>
            {tokens?.length === 0 && (
                <NotFound
                    description={t('noTokens')}
                    size="sm"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '20%',
                        zIndex: -1,
                    }}
                />
            )}
            {tokens && tokens.length > 0 && (
                <FlatList
                    data={tokens}
                    keyExtractor={item => item.currency.ticker}
                    contentContainerStyle={{paddingBottom: 90}}
                    renderItem={({item}) => (
                        <CurrencyItem
                            onPress={() =>
                                navigation.navigate('RootStack', {
                                    screen: 'MainTabs',
                                    params: {
                                        screen: 'WalletStack',
                                        params: {
                                            screen: 'Currency',
                                            params: {balance: item},
                                        },
                                    },
                                })
                            }
                            onLongPress={() =>
                                navigation.navigate('RootStack', {
                                    screen: 'MainTabs',
                                    params: {
                                        screen: 'WalletStack',
                                        params: {
                                            screen: 'Withdraw',
                                            params: {
                                                token: item.currency.ticker,
                                            },
                                        },
                                    },
                                })
                            }
                            balance={item}
                        />
                    )}
                />
            )}
        </View>
    );
};

export default Tokens;
