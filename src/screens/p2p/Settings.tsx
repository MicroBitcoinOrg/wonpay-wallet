import React, {useContext, useState} from 'react';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {P2PContext} from '@/providers';
import {Container, DismissKeyboard, Text} from '@/components/common';
import {Input} from '@/components/extended';
import {Colors} from '@/theme';
import {useUpdateUsername} from '@/services/mex/hooks/useSettings';

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 30,
    },
});

interface SettingsProps {
    navigation: any;
}

const Settings: React.FC<SettingsProps> = ({navigation}: SettingsProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('p2p');
    const {token} = useContext(P2PContext);
    const [username, setUsername] = useState<string>('');

    const updateUsername = useUpdateUsername(token || '', {
        onSuccess: () => {
            showMessage({
                message: t('alerts.usernameChanged.message'),
                description: t('alerts.usernameChanged.description'),
                backgroundColor: Colors[scheme!].primary,
            });
            setUsername('');
        },
        onError: (error: any) => {
            showMessage({
                message: t('alerts.usernameError.message'),
                description:
                    error.message || t('alerts.usernameError.description'),
                backgroundColor: Colors[scheme!].error || '#ff0000',
            });
        },
    });

    const handleUpdateUsername = () => {
        if (username.trim().length > 0 && token) {
            updateUsername.mutateAsync({
                username: username.trim(),
            });
        }
    };

    return (
        <DismissKeyboard>
            <Container>
                <View>
                    <View style={styles.inputContainer}>
                        <Text variant="body1">{t('p2pUsername.title')}</Text>
                        <Input
                            placeholder={t('p2pUsername.placeholder')}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(text: string) => setUsername(text)}
                            value={username}
                            onSubmitEditing={handleUpdateUsername}
                        />
                    </View>
                </View>
            </Container>
        </DismissKeyboard>
    );
};

export default Settings;
