import React from 'react';
import {Platform, StyleSheet, useColorScheme, View} from 'react-native';
import {HStack, Text} from '../common';
import {getHeaderTitle} from '@react-navigation/elements';
import {Colors} from '../../theme';
import IconButton from './IconButton';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 30 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    rightButton: {},
    leftButton: {
        marginRight: 10,
    },
});

interface HeaderProps {
    transparent?: boolean;
    barStyle?: 'light' | 'dark';
    navigation?: any;
    route?: any;
    options?: any;
    back?: any;
}

/*<TouchableOpacity onPress={navigation.goBack} style={styles.leftButton}>
    <EntypoIcon
        name="chevron-thin-left"
        size={28}
        color={transparent ? Colors[scheme!].white : Colors[scheme!].textPrimary}
    />
</TouchableOpacity>*/

const Header: React.FC<HeaderProps> = ({
    navigation,
    route,
    options,
    back,
    transparent,
}: HeaderProps) => {
    const scheme = useColorScheme();

    const title = options.headerTitle || getHeaderTitle(options, route.name);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: transparent
                        ? 'transparent'
                        : Colors[scheme!].background,
                },
                options.headerStyle,
            ]}>
            <HStack flex={1} justifyContent="flex-start">
                {options.headerLeft
                    ? options.headerLeft()
                    : back && (
                          <IconButton
                              onPress={navigation.goBack}
                              iconSet="entypo"
                              name="chevron-thin-left"
                              size="md"
                              color={transparent ? 'white' : 'textPrimary'}
                              transparent
                          />
                      )}

                {typeof title === 'string' ? (
                    <Text
                        variant="h3"
                        color={transparent ? 'white' : 'textPrimary'}>
                        {title}
                    </Text>
                ) : (
                    // @ts-ignore
                    title()
                )}
            </HStack>
            {options.headerRight && options.headerRight()}
        </View>
    );
};

Header.defaultProps = {
    barStyle: 'dark',
};

export default Header;
