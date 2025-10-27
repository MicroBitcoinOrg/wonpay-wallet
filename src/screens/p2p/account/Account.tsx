import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {
    Container,
    FocusAwareStatusBar,
    HStack,
    Text,
    VStack,
} from '@/components/common';
import {IconButton} from '@/components/extended';
import AccountCard from './layout/AccountCard';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Balances from './tabs/Balances';
import Trades from './tabs/Trades';
import Offers from './tabs/Offers';
import {useTranslation} from 'react-i18next';
import {Colors, Typography} from '@/theme';
import P2PList from './tabs/P2PList';
import {useP2PNavigation} from '@/hooks/useTypedNavigation';

const styles = StyleSheet.create({
    tabsContainer: {
        marginHorizontal: -20,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },

    buttonText: {
        marginTop: 5,
    },
});

const Tab = createMaterialTopTabNavigator();

const Account = () => {
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');
    const navigation = useP2PNavigation();

    return (
        <Container paddingTop gradient style={{gap: 20}}>
            <FocusAwareStatusBar barStyle="light-content" />
            <AccountCard />
            <HStack gap={64}>
                <VStack alignItems="center" justifyContent="center">
                    <IconButton
                        iconColor="textPrimary"
                        name="chevron-down"
                        iconSet="ionicons"
                        onPress={() => navigation.navigate('Deposit')}
                    />
                    <Text
                        variant="sub1"
                        color="white"
                        style={styles.buttonText}>
                        {t('account.deposit')}
                    </Text>
                </VStack>
                <VStack alignItems="center" justifyContent="center">
                    <IconButton
                        iconColor="textPrimary"
                        name="chevron-up"
                        iconSet="ionicons"
                    />
                    <Text
                        variant="sub1"
                        color="white"
                        style={styles.buttonText}>
                        {t('account.withdraw')}
                    </Text>
                </VStack>
            </HStack>

            <Tab.Navigator
                style={styles.tabsContainer}
                screenOptions={{
                    tabBarLabelStyle: {
                        ...Typography.body2,
                        textTransform: 'none',
                    },
                    tabBarStyle: {
                        backgroundColor: Colors[scheme!].background,
                        borderBottomColor: Colors[scheme!].border,
                        shadowOpacity: 0,
                        elevation: 0,
                        borderBottomWidth: 1,
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: Colors[scheme!].primaryLight,
                    },
                }}>
                <Tab.Screen
                    name="P2PList"
                    options={{title: t('account.market')}}
                    component={P2PList}
                />
                <Tab.Screen
                    name="Balances"
                    options={{title: t('account.balances')}}
                    component={Balances}
                />
                <Tab.Screen
                    name="Trades"
                    options={{title: t('account.trades')}}
                    component={Trades}
                />
                <Tab.Screen
                    name="Offers"
                    options={{title: t('account.offers')}}
                    component={Offers}
                />
            </Tab.Navigator>
        </Container>
    );
};

export default Account;
