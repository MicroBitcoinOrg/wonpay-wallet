import React, { useState } from 'react';
import { FlatList, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { Container, Table } from '../../components/common';
import { TableItem } from '../../components/extended';
import { Colors } from '../../theme';

interface LanguageProps {
    navigation: any;
}

const DATA = [
    { title: { en: 'English', original: 'English' }, code: 'en' },
    { title: { en: 'Korean', original: '한국어' }, code: 'ko' },
    { title: { en: 'Chinese', original: '中文' }, code: 'zh' },
];

const Language: React.FC<LanguageProps> = () => {
    const scheme = useColorScheme();
    const { i18n } = useTranslation();
    const [languages] = useState(DATA);

    return (
        <Container>
            <Table flex={1}>
                <FlatList
                    data={languages}
                    keyExtractor={(item) => item.code}
                    contentContainerStyle={{ paddingBottom: 90 }}
                    renderItem={({ item }) => (
                        <TableItem
                            bottomDivider
                            title={item.title.en}
                            subtitle={item.title.original}
                            rightContent={
                                i18n.language === item.code && (
                                    <IoniconsIcon
                                        name="checkmark-circle"
                                        size={28}
                                        color={Colors[scheme!].textPrimary}
                                    />
                                )
                            }
                            onPress={() => i18n.changeLanguage(item.code)}
                        />
                    )}
                />
            </Table>
        </Container>
    );
};

export default Language;
