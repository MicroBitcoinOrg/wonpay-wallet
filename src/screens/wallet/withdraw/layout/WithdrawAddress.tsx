import React, {useContext} from 'react';
import {HStack} from '@/components/common';
import {
    FormItem,
    Input,
    IconButton,
    BottomSheetPicker,
} from '@/components/extended';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Navigation} from '@/types/Navigation';
import {useColorScheme} from 'react-native';
import useAppStore from '@/store/appStore';
import {useWallet} from '@/providers';
import {isMatchAddress} from '@/utils/address';
import {Wallet} from '@/types/Wallet';

interface WithdrawAddressProps {
    address: string;
    setAddress: any;
}

const WithdrawAddress = ({address, setAddress}: WithdrawAddressProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('withdraw');
    const navigation = useNavigation<Navigation.AppNavigationProp>();
    const store = useAppStore();
    const {chain} = useWallet();

    const sortFunc = (a: Wallet.AddressBook, b: Wallet.AddressBook) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
    };

    const sortedAddresses = [
        ...store.addressBook.filter(a => a.favorite).sort(sortFunc),
        ...store.addressBook.filter(a => !a.favorite).sort(sortFunc),
    ].map(addr => ({
        label: addr.title,
        description: addr.address,
        value: addr.address,
        group: 'Address Book',
    }));

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
            const match = isMatchAddress(string, chain!.regex.address);

            if (match) {
                setAddress(string);
            }
        });
    };

    const chooseAddressBookItem = (address: string) => {
        setAddress(address);
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
                        <BottomSheetPicker
                            options={sortedAddresses}
                            onValueChange={chooseAddressBookItem}>
                            <IconButton
                                iconSet="ionicons"
                                name="people-outline"
                                disabled={
                                    !store.addressBook ||
                                    store.addressBook.length === 0
                                }
                                transparent
                                color={
                                    scheme === 'dark'
                                        ? 'textPrimary'
                                        : 'primary'
                                }
                            />
                        </BottomSheetPicker>
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
