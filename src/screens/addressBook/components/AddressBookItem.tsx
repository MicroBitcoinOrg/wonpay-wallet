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

const styles = StyleSheet.create({
    container: {
        height: 80,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    contentContainer: {
        marginLeft: 10,
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
    favoriteContainer: {
        marginLeft: 10,
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
                />
                <View style={styles.contentContainer}>
                    <HStack
                        justifyContent="flex-start"
                        style={styles.topContentContainer}>
                        <Text style={styles.titleText}>
                            {addressBookItem.title}
                        </Text>
                        {addressBookItem.favorite && (
                            <View style={styles.favoriteContainer}>
                                <Ionicon
                                    name="star"
                                    size={20}
                                    color="#F7B500"
                                />
                            </View>
                        )}
                    </HStack>
                    <Text style={styles.addressText}>
                        {addressBookItem.address}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

export default AddressBookItem;
