import React, {
    cloneElement,
    Fragment,
    ReactElement,
    useCallback,
    useMemo,
    useRef,
} from 'react';

import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Avatar, HStack, Text} from '../../components/common';
import {Colors} from '../../theme';
import {useColorScheme} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
    BottomSheetFlatList,
} from '@gorhom/bottom-sheet';

export interface PickerOption {
    label: string;
    value: string;
    description?: string;
    icon?: string; // Emoji or single character
}

interface BottomSheetPickerProps {
    children?: ReactElement;
    options: PickerOption[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    title?: string;
    placeholder?: string;
}

const BottomSheetPicker = ({
    children,
    options,
    selectedValue,
    onValueChange,
    title,
    placeholder = 'Select an option',
}: BottomSheetPickerProps) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const scheme = useColorScheme();

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSelectOption = useCallback(
        (value: string) => {
            onValueChange(value);
            bottomSheetModalRef.current?.dismiss();
        },
        [onValueChange],
    );

    const backgroundStyle = useMemo(
        () => ({
            backgroundColor: Colors[scheme!].background,
        }),
        [scheme],
    );

    const handleIndicatorStyle = useMemo(
        () => ({
            backgroundColor: Colors[scheme!].textSecondary,
        }),
        [scheme],
    );

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        [],
    );

    const selectedOption = useMemo(() => {
        return options.find(opt => opt.value === selectedValue);
    }, [options, selectedValue]);

    const renderItem = useCallback(
        ({item}: {item: PickerOption}) => {
            const isSelected = item.value === selectedValue;
            const avatarTitle = item.icon || item.label.charAt(0).toUpperCase();

            return (
                <TouchableOpacity
                    onPress={() => handleSelectOption(item.value)}
                    style={[
                        styles.optionItem,
                        {
                            borderBottomWidth: 0.5,
                            borderColor: Colors[scheme!].border,
                        },
                    ]}>
                    <Avatar
                        title={avatarTitle}
                        backgroundColor="card"
                        color="textSecondary"
                    />
                    <View style={styles.optionContent}>
                        <HStack justifyContent="flex-start">
                            <Text variant="body1">{item.label}</Text>
                        </HStack>
                        {item.description && (
                            <Text variant="body3" opacity={0.5}>
                                {item.description}
                            </Text>
                        )}
                    </View>
                    {isSelected && (
                        <IoniconsIcon
                            name="checkmark-circle"
                            size={24}
                            color={Colors[scheme!].primaryLight}
                        />
                    )}
                </TouchableOpacity>
            );
        },
        [selectedValue, handleSelectOption, scheme],
    );

    const renderContent = useCallback(() => {
        return (
            <View style={styles.contentContainer}>
                {title && (
                    <View style={styles.headerContainer}>
                        <Text variant="h3">{title}</Text>
                    </View>
                )}
                <BottomSheetFlatList
                    data={options}
                    keyExtractor={item => item.value}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        );
    }, [title, options, renderItem]);

    return (
        <Fragment>
            {children ? (
                cloneElement(children, {onPress: handlePresentModalPress})
            ) : (
                <TouchableOpacity
                    onPress={handlePresentModalPress}
                    style={[
                        styles.defaultTrigger,
                        {borderColor: Colors[scheme!].border},
                    ]}>
                    <Text
                        variant="body2"
                        color={selectedOption ? 'textPrimary' : 'textSecondary'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </Text>
                </TouchableOpacity>
            )}
            <BottomSheetModal
                backgroundStyle={backgroundStyle}
                handleIndicatorStyle={handleIndicatorStyle}
                backdropComponent={renderBackdrop}
                ref={bottomSheetModalRef}
                snapPoints={['50%', '75%']}>
                <BottomSheetView style={styles.sheetContent}>
                    {renderContent()}
                </BottomSheetView>
            </BottomSheetModal>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    sheetContent: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    headerContainer: {
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    optionItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionContent: {
        marginLeft: 15,
        flex: 1,
    },
    defaultTrigger: {
        width: '100%',
        minHeight: 40,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
});

export default BottomSheetPicker;
