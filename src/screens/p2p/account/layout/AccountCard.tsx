import React, {useContext} from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Avatar, HStack, Text, VStack} from '@/components/common';
import Config from 'react-native-config';
import {Colors} from '@/theme';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {P2PContext} from '@/providers';
import {useMyProfile} from '@/services/mex/hooks';
import {Button} from '@/components/extended';
import {base64ToHex} from '@/utils/common';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width - 60,
        height: 100,
        borderRadius: 10,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    walletCardContainer: {
        marginBottom: 30,
        marginHorizontal: -20,
    },
});

const AccountCard = () => {
    const {t} = useTranslation('p2p');
    const {token} = useContext(P2PContext);
    const scheme = useColorScheme();

    const {data: profile, isLoading: isProfileLoading} = useMyProfile(token);

    return (
        <VStack
            backgroundColor={Colors[scheme!].background}
            gap={16}
            borderRadius={10}
            padding={15}>
            {!profile && (
                <SkeletonPlaceholder
                    backgroundColor={Colors[scheme!].background}
                    highlightColor={Colors[scheme!].card}>
                    <SkeletonPlaceholder.Item
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={16}>
                        <SkeletonPlaceholder.Item
                            width={45}
                            height={45}
                            borderRadius={45}
                        />
                        <SkeletonPlaceholder.Item
                            width={175}
                            height={25}
                            borderRadius={4}
                        />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            )}
            {profile && (
                <HStack justifyContent="space-between" gap={16}>
                    <Avatar
                        title={profile?.address}
                        backgroundColor={`#${base64ToHex(
                            profile.address,
                        ).substring(0, 6)}`}
                        color="white"
                    />
                    <VStack gap={4}>
                        <Text variant="body1" numberOfLines={1}>
                            {t('account.account')}
                        </Text>
                        <Text
                            variant="sub1"
                            color="textSecondary"
                            numberOfLines={1}
                            ellipsizeMode="middle">
                            {profile?.address}
                        </Text>
                    </VStack>
                </HStack>
            )}
        </VStack>
    );
};

export default AccountCard;
