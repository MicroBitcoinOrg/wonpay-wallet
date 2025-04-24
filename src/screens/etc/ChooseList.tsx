import React from 'react';
import {FlatList, Platform, StyleSheet} from 'react-native';
import {Container, Divider, HStack, Text} from '../../components/common';

interface ChooseListProps {
    route: any;
    navigation: any;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dividerContainer: {
        padding: 20,
    },
    titleContainer: {
        marginBottom: 10,
    },
});

const ChooseList: React.FC<ChooseListProps> = ({route, navigation}) => {
    const defaultParams = {
        data: [],
        keyExtractor: undefined,
        renderItem: undefined,
        headerTitle: '',
        headerRight: undefined,
    };
    const params = route.params
        ? {...defaultParams, ...route.params}
        : defaultParams;

    return (
        <Container>
            <HStack style={styles.dividerContainer}>
                {Platform.OS === 'ios' && <Divider />}
            </HStack>
            <HStack style={{marginBottom: 20}} justifyContent="space-between">
                <Text variant="h3">{params.headerTitle}</Text>
                {params.headerRight && params.headerRight}
            </HStack>
            <FlatList
                data={params.data}
                style={{marginHorizontal: -20}}
                renderItem={({item}) => params.renderItem(item, navigation)}
                keyExtractor={params.keyExtractor}
            />
        </Container>
    );
};

export default ChooseList;
