import React, {useContext} from 'react';
import {HStack} from '@/components/common';
import {
    FormItem,
    Input,
    IconButton,
    BottomSheetPicker,
    PickerOption,
} from '@/components/extended';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Navigation} from '@/types/Navigation';
import {Image, useColorScheme} from 'react-native';
import useAppStore from '@/store/appStore';
import {useWallet} from '@/providers';
import {isMatchAddress} from '@/utils/address';
import {Wallet} from '@/types/Wallet';
import {Colors} from '@/theme';
import {CHAINS} from '@/utils/constants';
import {base64ToHex} from '@/utils/common';

interface WithdrawAddressProps {
    address: string;
    setAddress: any;
}

const WithdrawAddress = ({address, setAddress}: WithdrawAddressProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('withdraw');
    const store = useAppStore();
    const {chain, wallet, chainKey} = useWallet();

    const sortFunc = (a: Wallet.AddressBook, b: Wallet.AddressBook) => {
        if (a.title > b.title) return 1;
        if (a.title < b.title) return -1;
        return 0;
    };

    const sortedAddresses: PickerOption[] = [
        ...store.addressBook.filter(a => a.favorite).sort(sortFunc),
        ...store.addressBook.filter(a => !a.favorite).sort(sortFunc),
    ].map(addr => ({
        label: addr.title,
        description: addr.address,
        value: JSON.stringify(addr),
        group: 'Address Book',
        avatarProps: {
            additional: (
                <Image
                    source={CHAINS[addr.chain].logo}
                    style={{
                        width: 20,
                        height: 20,
                    }}
                />
            ),
            backgroundColor: `#${base64ToHex(addr.address).substring(0, 6)}`,
            color: 'white',
        },
    }));

    const walletAddresses: PickerOption[] = store.wallets
        .filter(w => w.uuid !== wallet!.uuid)
        .map(w =>
            (
                Object.keys(w.chains) as (
                    | Wallet.ChainEnum.MICROBITCOIN
                    | Wallet.ChainEnum.TRON
                )[]
            ).map(chain => ({
                label: w.title,
                description: w.chains[chain].depositAddress,
                value: JSON.stringify({
                    address: w.chains[chain].depositAddress,
                    chain: chain,
                }),
                group: 'Wallets',
                avatarProps: {
                    additional: (
                        <Image
                            source={CHAINS[chain].logo}
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        />
                    ),
                    backgroundColor: `#${base64ToHex(
                        w.chains[chain].depositAddress,
                    ).substring(0, 6)}`,
                    color: 'white' as keyof typeof Colors.dark &
                        keyof typeof Colors.light,
                },
            })),
        )
        .flat();

    const getFromClipboard = () => {
        Clipboard.getString().then(string => {
            const match = isMatchAddress(string, chain!.regex.address);

            if (match) {
                setAddress(string);
            }
        });
    };

    const chooseAddressBookItem = (addressJSON: string) => {
        const address: Pick<Wallet.AddressBook, 'address' | 'chain'> =
            JSON.parse(addressJSON);

        if (chainKey !== address.chain) {
            store.updateWallet(wallet!.uuid, {
                activeChain: address.chain as
                    | Wallet.ChainEnum.MICROBITCOIN
                    | Wallet.ChainEnum.TRON,
            });
        }

        setAddress(address.address);
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
                            title={t('selectAddress')}
                            options={[...sortedAddresses, ...walletAddresses]}
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
                    </HStack>
                }
            />
        </FormItem>
    );
};

export default WithdrawAddress;
