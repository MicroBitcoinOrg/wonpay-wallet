import React, {
    createRef,
    RefObject,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TextInput,
    TextInputKeyPressEventData,
    useColorScheme,
    View,
    ViewProps,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
    Container,
    DismissKeyboard,
    FocusAwareStatusBar,
    HStack,
    KeyboardAvoidingView,
    Text,
    VStack,
} from '../../components/common';
import {Button, Input} from '../../components/extended';
import {SeedWord, SeedWordInput} from './components';
import {OnboardingContext} from '../../providers';
import {generateSeedPhrase, isValidSeedPhrase} from '../../utils/address';
import useAppStore from '../../store/appStore';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    seedPhraseContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    seedWordContainer: {
        marginBottom: 15,
        width: '30%',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 30,
    },
});

interface RecoveryPhraseProps extends ViewProps {
    navigation: any;
    route: any;
}

const RecoveryPhrase: React.FC<RecoveryPhraseProps> = ({
    navigation,
}: RecoveryPhraseProps) => {
    const scheme = useColorScheme();
    const {t} = useTranslation('recoveryPhrase');
    const store = useAppStore();
    const [seedPhrase, setSeedPhrase] = useState<(string | undefined)[]>(
        new Array(12).fill(undefined),
    );
    const [title, setTitle] = useState<string>(
        `${t('initialTitle')} #${store.wallets.length + 1}`,
    );
    const [secureImport, setSecureImport] = useState<boolean>(true);
    const {onboarding, dispatchOnboardingAction} =
        useContext(OnboardingContext);
    const seedWordsRef = useRef<(TextInput | null)[]>(
        new Array(seedPhrase.length),
    );

    const handleContinue = () => {
        if (secureImport && !isValidSeedPhrase(seedPhrase)) {
            return;
        }

        dispatchOnboardingAction({
            type: 'setWalletValues',
            wallet: {seedPhrase: seedPhrase.join(' '), title},
        });
        navigation.navigate('Finished');
    };

    const handleKeys = (
        index: number,
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    ) => {
        if (
            index !== 0 &&
            e.nativeEvent.key === 'Backspace' &&
            (!seedPhrase[index] || seedPhrase[index] === '')
        ) {
            // @ts-ignore
            seedWordsRef.current[index - 1].focus();
        }

        if (index !== 11 && e.nativeEvent.key === ' ') {
            // @ts-ignore
            seedWordsRef.current[index + 1].focus();
        }
    };

    const handleSeedWordChanged = (index: number, text: string) => {
        const splitted = text.split(' ');

        if (index === 0 && splitted.length === 12) {
            setSeedPhrase(splitted);
            return;
        }

        const newSeedPhrase = [...seedPhrase];
        newSeedPhrase[index] = splitted[0];
        setSeedPhrase(newSeedPhrase);
    };

    const handleSeedPhraseChanged = (text: string) => {
        if (text !== '') {
            setSeedPhrase(text.split(' '));
        } else {
            setSeedPhrase(new Array(12).fill(undefined));
        }
    };

    const checkSeedPhrase = () => {
        if (seedPhrase.length > 24) {
            return true;
        }

        if (!secureImport) {
            return seedPhrase.some(seedWord => seedWord === undefined);
        }

        return seedPhrase.some(
            seedWord => seedWord === undefined || seedWord === '',
        );
    };

    const changeSecureMethod = (method: 'standard' | 'unsecured') => {
        setSecureImport(method === 'standard');
        setSeedPhrase(new Array(12).fill(undefined));
    };

    useEffect(() => {
        if (onboarding!.processType === 'create') {
            setSeedPhrase(generateSeedPhrase());
        }
    }, []);

    return (
        <DismissKeyboard>
            <Container paddingTop paddingBottom>
                <FocusAwareStatusBar barStyle="light-content" />
                <KeyboardAvoidingView
                    style={styles.container}
                    keyboardVerticalOffset={0}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <VStack
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            flex={1}>
                            {onboarding!.processType === 'import' && (
                                <HStack style={styles.inputContainer}>
                                    <Button
                                        flex={1}
                                        title={t('standard')}
                                        border
                                        borderColor="border"
                                        type={
                                            !secureImport ? 'text' : 'contained'
                                        }
                                        color={
                                            scheme === 'dark'
                                                ? 'secondary'
                                                : 'primary'
                                        }
                                        onPress={() =>
                                            changeSecureMethod('standard')
                                        }
                                        size="md"
                                        style={{marginRight: 10}}
                                    />
                                    <Button
                                        flex={1}
                                        title={t('unsecured')}
                                        border
                                        borderColor="border"
                                        type={
                                            !secureImport ? 'contained' : 'text'
                                        }
                                        color={
                                            scheme === 'dark'
                                                ? 'secondary'
                                                : 'primary'
                                        }
                                        onPress={() =>
                                            changeSecureMethod('unsecured')
                                        }
                                        size="md"
                                    />
                                </HStack>
                            )}
                            {onboarding!.processType === 'import' &&
                                secureImport && (
                                    <View style={styles.seedPhraseContainer}>
                                        {seedPhrase.map(
                                            (seedWord: any, index: number) => {
                                                return (
                                                    <SeedWordInput
                                                        value={
                                                            seedPhrase[index]
                                                        }
                                                        onChangeText={text =>
                                                            handleSeedWordChanged(
                                                                index,
                                                                text,
                                                            )
                                                        }
                                                        autoCapitalize="none"
                                                        autoCorrect={false}
                                                        number={index + 1}
                                                        ref={el =>
                                                            (seedWordsRef.current[
                                                                index
                                                            ] = el)
                                                        }
                                                        style={
                                                            styles.seedWordContainer
                                                        }
                                                        returnKeyType={
                                                            index + 1 < 12
                                                                ? 'next'
                                                                : 'done'
                                                        }
                                                        key={index}
                                                        blurOnSubmit={
                                                            !(index + 1 < 12)
                                                        }
                                                        clearButtonMode="while-editing"
                                                        onSubmitEditing={() =>
                                                            // @ts-ignore
                                                            index + 1 < 12 &&
                                                            seedWordsRef.current[
                                                                index + 1
                                                            ]!.focus()
                                                        }
                                                        onKeyPress={e =>
                                                            handleKeys(index, e)
                                                        }
                                                    />
                                                );
                                            },
                                        )}
                                    </View>
                                )}

                            {onboarding!.processType === 'create' && (
                                <View style={styles.seedPhraseContainer}>
                                    {seedPhrase.map(
                                        (seedWord: any, index: number) => {
                                            return (
                                                <SeedWord
                                                    style={
                                                        styles.seedWordContainer
                                                    }
                                                    word={seedWord}
                                                    key={index}
                                                    number={index + 1}
                                                />
                                            );
                                        },
                                    )}
                                </View>
                            )}

                            {onboarding!.processType === 'import' &&
                                !secureImport && (
                                    <View style={styles.inputContainer}>
                                        <Text
                                            variant="body1"
                                            color="textPrimary">
                                            Recovery phrase
                                        </Text>
                                        <Input
                                            color="textPrimary"
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                            textAlignVertical="top"
                                            multiline
                                            onChangeText={
                                                handleSeedPhraseChanged
                                            }
                                            style={{
                                                height: 150,
                                                padding: 16,
                                                borderTopLeftRadius: 8,
                                                borderTopRightRadius: 8,
                                            }}
                                        />
                                    </View>
                                )}
                            <View style={styles.inputContainer}>
                                <Text variant="body1" color="textPrimary">
                                    Wallet title
                                </Text>
                                <Input
                                    color="textPrimary"
                                    placeholder={t('walletTitle.placeholder')}
                                    onChangeText={setTitle}
                                    value={title}
                                />
                            </View>
                        </VStack>
                    </ScrollView>
                    <Button
                        title={t('confirmButton')}
                        color="primary"
                        disabled={checkSeedPhrase() || title === ''}
                        onPress={handleContinue}
                        style={{marginVertical: 20}}
                    />
                </KeyboardAvoidingView>
            </Container>
        </DismissKeyboard>
    );
};

export default RecoveryPhrase;
