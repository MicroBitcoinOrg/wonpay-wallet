import React from 'react';
import {Platform, StyleSheet, useColorScheme, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {
    Container,
    FocusAwareStatusBar,
    Table,
    Text,
} from '../../components/common';
import {TableItem} from '../../components/extended';
import Config from 'react-native-config';
import {Colors} from '../../theme';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    container: {
        marginTop: parseInt(
            Platform.OS === 'ios'
                ? Config.HEADER_HEIGHT_IOS
                : Config.HEADER_HEIGHT_ANDROID,
        ),
    },
    descriptionContainer: {
        marginBottom: 15,
    },
});

interface ChangePasswordMethodProps {
    navigation: any;
}

const ChangePasswordMethod: React.FC<ChangePasswordMethodProps> = ({
    navigation,
}: ChangePasswordMethodProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('changePasswordMethod');
    const store = useAppStore();

    const handleAuthMethodChange = (type: 'password' | 'pin') => {
        store.setPassword({type});
        navigation.goBack();
    };

    return (
        <Container gradient safeArea header={false}>
            <FocusAwareStatusBar barStyle="light-content" />
            <View style={[styles.descriptionContainer]}>
                <Text variant="body3" color="white" opacity={0.5}>
                    {t('description')}
                </Text>
            </View>
            <Table>
                <TableItem
                    title={t('pinTitle')}
                    color="white"
                    underlayColor={Colors[scheme!].primary}
                    leftContent={
                        <IoniconsIcon
                            name={
                                store.password.type === 'pin'
                                    ? 'checkmark-circle'
                                    : 'ellipse-outline'
                            }
                            size={28}
                            color="white"
                        />
                    }
                    rightContent={
                        <EntypoIcon
                            name="chevron-thin-right"
                            size={20}
                            color="white"
                        />
                    }
                    onPress={() => handleAuthMethodChange('pin')}
                />
                <TableItem
                    title={t('passwordTitle')}
                    color="white"
                    underlayColor={Colors[scheme!].primary}
                    leftContent={
                        <IoniconsIcon
                            name={
                                store.password.type === 'password'
                                    ? 'checkmark-circle'
                                    : 'ellipse-outline'
                            }
                            size={28}
                            color="white"
                        />
                    }
                    rightContent={
                        <EntypoIcon
                            name="chevron-thin-right"
                            size={20}
                            color="white"
                        />
                    }
                    onPress={() => handleAuthMethodChange('password')}
                />
            </Table>
        </Container>
    );
};

export default ChangePasswordMethod;
