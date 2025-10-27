import React from 'react';
import {TouchableOpacity, useColorScheme} from 'react-native';
import {Avatar, HStack, Text, VStack} from '@/components/common';
import {Colors} from '@/theme';
import {useWallet} from '@/providers';
import useAppStore from '@/store/appStore';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {BottomSheetPicker} from '@/components/extended';
import {CHAINS} from '@/utils/constants';
import {Wallet} from '@/types/Wallet';
import {HStackProps} from '@/components/common/HStack';

const NetworkPicker = (props: HStackProps) => {
    const {wallet, chainKey, chain} = useWallet();
    const store = useAppStore();
    const scheme = useColorScheme();

    const mappedNetworks = wallet
        ? (Object.keys(wallet?.chains) as Wallet.ChainEnum[]).map(_chain => ({
              label: CHAINS[_chain].name!,
              value: _chain,
              description: CHAINS[_chain].currency!.ticker,
          }))
        : [];

    return (
        <BottomSheetPicker
            title="Choose wallet network"
            options={mappedNetworks}
            selectedValue={chainKey!}
            onValueChange={value =>
                store.updateWallet(wallet?.uuid!, {
                    activeChain: value as
                        | Wallet.ChainEnum.MICROBITCOIN
                        | Wallet.ChainEnum.TRON,
                })
            }>
            <TouchableOpacity>
                <HStack
                    justifyContent="space-between"
                    width="100%"
                    backgroundColor={Colors[scheme!].card}
                    padding={15}
                    borderRadius={10}
                    borderBottomLeftRadius={0}
                    borderBottomRightRadius={0}
                    {...props}>
                    <HStack gap={8}>
                        <Avatar
                            source={chain?.logo}
                            backgroundColor={chain?.color}
                            style={{width: 25, height: 25}}
                            size="sm"
                            imageProps={{
                                tintColor: Colors[scheme!].white,
                            }}
                        />
                        <Text
                            color="textSecondary"
                            textTransform="uppercase"
                            variant="sub1"
                            fontWeight="bold">
                            {chain?.name}
                        </Text>
                    </HStack>
                    <HStack gap={4}>
                        <Text color="textSecondary" variant="body3">
                            Change network
                        </Text>
                        <EntypoIcon
                            name="chevron-thin-right"
                            size={12}
                            color={Colors[scheme!].textSecondary}
                        />
                    </HStack>
                </HStack>
            </TouchableOpacity>
        </BottomSheetPicker>
    );
};

export default NetworkPicker;
