import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    TouchableHighlightProps,
    useColorScheme,
    View,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Avatar, HStack, Image, Text} from '../../../components/common';
import {base64ToHex} from '../../../utils/common';
import {Colors} from '../../../theme';
import {Wallet} from '../../../types/Wallet';
import {getChainByAddress} from '../../../utils/address';

const styles = StyleSheet.create({
    container: {
        height: 80,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
    },
    contentContainer: {
        marginLeft: 15,
        flex: 1,
    },
    topContentContainer: {
        marginBottom: 5,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressText: {
        fontSize: 12,
        opacity: 0.5,
    },
});

interface AddressBookItemProps extends TouchableHighlightProps {
    style?: Record<string, unknown>;
    addressBookItem: Wallet.AddressBook;
}

const AddressBookItem: React.FC<AddressBookItemProps> = ({
    style,
    addressBookItem,
    ...props
}: AddressBookItemProps) => {
    const scheme = useColorScheme();

    const chain = getChainByAddress(addressBookItem.address);

    return (
        <TouchableHighlight underlayColor={Colors[scheme!].card} {...props}>
            <View
                style={[
                    styles.container,
                    {
                        borderColor: Colors[scheme!].border,
                        backgroundColor: Colors[scheme!].background,
                    },
                    style,
                ]}>
                <Avatar
                    title={addressBookItem.title}
                    backgroundColor={`#${base64ToHex(
                        addressBookItem.address,
                    ).substring(0, 6)}`}
                    color="white"
                    additional={
                        !!chain && (
                            <Image
                                tintColor={Colors[scheme!].textSecondary}
                                source={chain.logo}
                                style={{
                                    width: 12,
                                    height: 12,
                                }}
                            />
                        )
                    }
                />
                <View style={styles.contentContainer}>
                    <HStack
                        justifyContent="flex-start"
                        alignItems="center"
                        style={styles.topContentContainer}>
                        <Text style={styles.titleText}>
                            {addressBookItem.title}
                        </Text>
                    </HStack>
                    <Text style={styles.addressText}>
                        {addressBookItem.address}
                    </Text>
                </View>
                {addressBookItem.favorite && (
                    <Ionicon name="star" size={20} color="#F7B500" />
                )}
            </View>
        </TouchableHighlight>
    );
};

export default AddressBookItem;
