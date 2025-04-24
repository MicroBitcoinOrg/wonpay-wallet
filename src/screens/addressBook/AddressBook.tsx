import React, {useEffect, useRef} from 'react';
import {Animated, FlatList, StyleSheet} from 'react-native';
// @ts-ignore
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {Container} from '../../components/common';
import {AddressBookItem} from './components';
import {NotFound} from '../../components/extended';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    leftAction: {
        flex: 1,
        backgroundColor: '#6D7278',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
    },
    rightAction: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 10,
        margin: 10,
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        padding: 20,
    },
    noAddressBookImage: {
        height: 200,
    },
    noAddressBookText: {
        fontSize: 14,
        color: '#003478',
        textAlign: 'center',
    },
});

interface AddressBookProps {
    navigation: any;
    route: any;
}

const AddressBook = ({navigation, route}: AddressBookProps) => {
    const {t} = useTranslation('addressBook');
    const {type} = route.params ?? {};
    const store = useAppStore();
    const swipableRefs = useRef<any>({});

    const sortFunc = (a: Wallet.AddressBook, b: Wallet.AddressBook) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
    };

    const sortedAddresses = [
        ...store.addressBook.filter(address => address.favorite).sort(sortFunc),
        ...store.addressBook
            .filter(address => !address.favorite)
            .sort(sortFunc),
    ];

    const renderLeftActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <RectButton style={styles.leftAction}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{translateX: trans}],
                        },
                    ]}>
                    {t('edit')}
                </Animated.Text>
            </RectButton>
        );
    };

    const renderRightActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [-101, -100, -50, 0],
            outputRange: [-1, 0, 0, 20],
        });

        return (
            <RectButton style={styles.rightAction}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{translateX: trans}],
                        },
                    ]}>
                    {t('delete')}
                </Animated.Text>
            </RectButton>
        );
    };

    /*const chooseAddress = (chosenAddressBookItem: AddressBookType) => {
        callback(chosenAddressBookItem);
        navigation.goBack();
    };*/

    const editAddress = (editedAddressBookItem: Wallet.AddressBook) => {
        swipableRefs.current[editedAddressBookItem.address].close();
        navigation.navigate('ManageAddressBookItem', {
            ...editedAddressBookItem,
            type: 'edit',
        });
    };

    const deleteAddress = (deletedAddressBookItem: Wallet.AddressBook) => {
        store.deleteAddressBookItem(deletedAddressBookItem.address);
    };

    useEffect(() => {
        if (type === 'choose-address') {
            navigation.setOptions({
                headerRight: () => null,
            });
        }
    }, []);

    return (
        <Container>
            {store.addressBook.length === 0 && (
                <NotFound description={t('noAddresses')} />
            )}
            {store.addressBook.length > 0 && (
                <FlatList
                    style={{marginHorizontal: -20}}
                    data={sortedAddresses}
                    contentContainerStyle={{paddingBottom: 90}}
                    keyExtractor={item => item.address}
                    renderItem={({item}) => (
                        <Swipeable
                            ref={(el: any) => {
                                swipableRefs.current[item.address] = el;
                            }}
                            renderLeftActions={(progress: any, dragX: any) =>
                                renderLeftActions(progress, dragX)
                            }
                            renderRightActions={(progress: any, dragX: any) =>
                                renderRightActions(progress, dragX)
                            }
                            onSwipeableRightWillOpen={() => deleteAddress(item)}
                            onSwipeableLeftWillOpen={() => editAddress(item)}>
                            <AddressBookItem addressBookItem={item} />
                        </Swipeable>
                    )}
                />
            )}
        </Container>
    );
};

export default AddressBook;
