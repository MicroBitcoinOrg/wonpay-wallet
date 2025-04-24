import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    TouchableHighlightProps,
    useColorScheme,
    View,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Avatar, HStack, Text} from '../../../components/common';
import {base64ToHex} from '../../../utils/common';
import {Colors} from '../../../theme';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        height: 80,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    contentContainer: {
        marginLeft: 10,
        flex: 1,
    },
    topContentContainer: {
        marginBottom: 5,
        flex: 1,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressText: {
        fontSize: 12,
        opacity: 0.5,
    },
    favoriteContainer: {
        marginLeft: 10,
    },
});

interface ChainItemProps extends TouchableHighlightProps {
    style?: Record<string, unknown>;
    chain: Wallet.Chain;
}

const ChainItem: React.FC<ChainItemProps> = ({style, chain, ...props}) => {
    const scheme = useColorScheme();
    const {t} = useTranslation();

    return (
        <TouchableHighlight
            disabled={!chain.active}
            underlayColor={Colors[scheme!].card}
            {...props}>
            <View
                style={[
                    styles.container,
                    {
                        borderColor: Colors[scheme!].border,
                        backgroundColor: Colors[scheme!].background,
                        opacity: chain.active ? 1 : 0.5,
                    },
                    style,
                ]}>
                <Avatar
                    title={chain.name}
                    backgroundColor={`#${base64ToHex(chain.name).substring(
                        0,
                        6,
                    )}`}
                    color="white"
                />
                <View style={styles.contentContainer}>
                    <HStack
                        justifyContent="space-between"
                        style={styles.topContentContainer}>
                        <Text style={styles.titleText}>{chain.name}</Text>
                    </HStack>
                    <Text style={styles.addressText}>
                        {chain.currency.ticker}
                    </Text>
                </View>
                {!chain.active && <Text variant="sub1">{t('comingSoon')}</Text>}
            </View>
        </TouchableHighlight>
    );
};

export default ChainItem;
