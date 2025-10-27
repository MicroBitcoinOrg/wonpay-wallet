import React, {
    cloneElement,
    Fragment,
    ReactElement,
    useCallback,
    useMemo,
    useRef,
} from 'react';

import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Avatar, Text, VStack} from '@/components/common';
import {Colors} from '@/theme';
import {useColorScheme} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
    BottomSheetSectionList,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface PickerOption {
    label: string;
    value: string;
    description?: string;
    icon?: string; // Emoji or single character
    group?: string; // Group header for this option
}

interface BottomSheetPickerProps {
    children?: ReactElement;
    options: PickerOption[];
    selectedValue?: string;
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
    const {bottom} = useSafeAreaInsets();

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

    const groupedSections = useMemo(() => {
        const groups: {[key: string]: PickerOption[]} = {};
        const ungrouped: PickerOption[] = [];

        options.forEach(option => {
            if (option.group) {
                if (!groups[option.group]) {
                    groups[option.group] = [];
                }
                groups[option.group].push(option);
            } else {
                ungrouped.push(option);
            }
        });

        const sections = [];

        // Add ungrouped items first (without a header)
        if (ungrouped.length > 0) {
            sections.push({title: '', data: ungrouped});
        }

        // Add grouped items
        Object.keys(groups).forEach(groupName => {
            sections.push({title: groupName, data: groups[groupName]});
        });

        return sections;
    }, [options]);

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
                    <VStack gap={4} flex={1}>
                        <Text variant="body1">{item.label}</Text>
                        {item.description && (
                            <Text variant="sub1" color="textSecondary">
                                {item.description}
                            </Text>
                        )}
                    </VStack>
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

    const renderSectionHeader = useCallback(
        ({section}: {section: {title: string}}) => {
            if (!section.title) {
                return null;
            }
            return (
                <View
                    style={[
                        styles.sectionHeader,
                        {backgroundColor: Colors[scheme!].background},
                    ]}>
                    <Text variant="sub1" color="textSecondary">
                        {section.title}
                    </Text>
                </View>
            );
        },
        [scheme],
    );

    const renderContent = useCallback(() => {
        return (
            <View style={[styles.contentContainer]}>
                {title && (
                    <View style={styles.headerContainer}>
                        <Text variant="h3">{title}</Text>
                    </View>
                )}
                <BottomSheetSectionList
                    sections={groupedSections}
                    keyExtractor={item => item.value}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={{paddingBottom: bottom + 40}}
                />
            </View>
        );
    }, [title, groupedSections, renderItem, renderSectionHeader, bottom]);

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
                        color={
                            selectedOption ? 'textPrimary' : 'textSecondary'
                        }>
                        {selectedOption ? selectedOption.label : placeholder}
                    </Text>
                    <EntypoIcon
                        name="chevron-thin-right"
                        size={12}
                        color={Colors[scheme!].textSecondary}
                    />
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

    optionItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    optionContent: {
        marginLeft: 15,
        flex: 1,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        paddingTop: 16,
    },
    defaultTrigger: {
        width: '100%',
        minHeight: 40,
        borderBottomWidth: 0.5,
        borderRadius: 10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default BottomSheetPicker;
