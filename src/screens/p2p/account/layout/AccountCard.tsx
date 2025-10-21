import React, {useContext} from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Avatar, HStack, Text, VStack} from '../../../../components/common';
import Config from 'react-native-config';
import {Colors} from '../../../../theme';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {P2PContext} from '../../../../providers';
import {useMyProfile} from '../../../../services/mex/hooks';
import {Button} from '../../../../components/extended';
import {base64ToHex} from '../../../../utils/common';

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
    const {token} = useContext(P2PContext);
    const scheme = useColorScheme();

    const {data: profile, isLoading: isProfileLoading} = useMyProfile(token);

    if (!profile) return null;

    return (
        <VStack
            backgroundColor={Colors[scheme!].background}
            gap={16}
            borderRadius={10}
            padding={15}>
            <HStack justifyContent="space-between" gap={16}>
                <Avatar
                    title={profile?.address}
                    backgroundColor={`#${base64ToHex(profile.address).substring(
                        0,
                        6,
                    )}`}
                    color="white"
                />
                <VStack gap={4}>
                    <Text variant="body1" numberOfLines={1}>
                        Account
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
        </VStack>
    );
};

export default AccountCard;
