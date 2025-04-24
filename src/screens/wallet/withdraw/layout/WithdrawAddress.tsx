import React, {useContext} from 'react';
import {HStack} from '../../../../components/common';
import {FormItem, Input, IconButton} from '../../../../components/extended';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {StackNavigationProp} from '@react-navigation/stack';
import {AddressBookItem} from '../../../addressBook/components';
import {Navigation} from '../../../../types/Navigation';
import {useColorScheme} from 'react-native';
import useAppStore from '../../../../store/appStore';
import {WalletContext} from '../../../../providers';

interface WithdrawAddressProps {
    address: string;
    setAddress: any;
}

const WithdrawAddress = ({address, setAddress}: WithdrawAddressProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('withdraw');
    const navigation = useNavigation<Navigation.AppNavigationProp>();
    const store = useAppStore();
    const {walletChain} = useContext(WalletContext);

    const sortFunc = (a: Wallet.AddressBook, b: Wallet.AddressBook) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
    };

    const sortedAddresses = [
        ...store.addressBook.filter(a => a.favorite).sort(sortFunc),
        ...store.addressBook.filter(a => !a.favorite).sort(sortFunc),
    ];

    const getFromQRCode = () => {
        navigation.navigate('RootStack', {
            screen: 'QRCodeScanner',
            params: {
                type: 'withdraw',
            },
        });
    };

    const getFromClipboard = () => {
        Clipboard.getString().then(string => {
            const addresses = string.match(
                new RegExp(walletChain!.regex.address),
            );

            if (addresses && addresses.length > 0) {
                setAddress(addresses[0]);
            }
        });
    };

    const chooseAddressBookItem = (
        chosenAddressBookItem: Wallet.AddressBook,
        nav: StackNavigationProp<any>,
    ) => {
        setAddress(chosenAddressBookItem.address);
        nav.goBack();
    };

    const openAddressBookList = () => {
        navigation.navigate('ChooseList', {
            data: sortedAddresses,
            keyExtractor: (item: Wallet.AddressBook) => item.address,
            renderItem: (
                item: Wallet.AddressBook,
                nav: Navigation.AppNavigationProp,
            ) => (
                <AddressBookItem
                    addressBookItem={item}
                    onPress={() => chooseAddressBookItem(item, nav)}
                />
            ),
            headerTitle: t('selectAddress'),
        });
    };

    return (
        <FormItem title={t('withdrawAddress.title')}>
            <Input
                placeholder={t('withdrawAddress.placeholder')}
                autoFocus={!address || address === ''}
                onChangeText={text => setAddress(text)}
                onLongPress={getFromClipboard}
                value={address}
                returnKeyType={'next'}
                rightContent={
                    <HStack>
                        <IconButton
                            iconSet="ionicons"
                            name="people-outline"
                            disabled={
                                !store.addressBook ||
                                store.addressBook.length === 0
                            }
                            transparent
                            color={
                                scheme === 'dark' ? 'textPrimary' : 'primary'
                            }
                            onPress={openAddressBookList}
                        />
                        <IconButton
                            transparent
                            color={
                                scheme === 'dark' ? 'textPrimary' : 'primary'
                            }
                            iconSet="ionicons"
                            name="scan-outline"
                            onPress={getFromQRCode}
                        />
                    </HStack>
                }
            />
        </FormItem>
    );
};

export default WithdrawAddress;
