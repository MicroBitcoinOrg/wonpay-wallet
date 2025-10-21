import React, {
    cloneElement,
    Fragment,
    ReactElement,
    useCallback,
    useMemo,
    useRef,
} from 'react';

import {StyleSheet} from 'react-native';

import {Container} from '../../components/common';
import {Colors} from '../../theme';
import {useColorScheme} from 'react-native';

import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';

interface BottomSheetProps {
    children: ReactElement;
    content: ReactElement;
}

const BottomSheet = ({children, content}: BottomSheetProps) => {
    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const scheme = useColorScheme();

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const backgroundStyle = useMemo(
        () => ({
            backgroundColor: Colors[scheme!].background,
        }),
        [Colors[scheme!].background],
    );

    const handleIndicatorStyle = useMemo(
        () => ({
            backgroundColor: Colors[scheme!].textSecondary,
        }),
        [Colors[scheme!].textSecondary],
    );

    // renders
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

    return (
        <Fragment>
            {cloneElement(children, {onPress: handlePresentModalPress})}
            <BottomSheetModal
                backgroundStyle={backgroundStyle}
                handleIndicatorStyle={handleIndicatorStyle}
                backdropComponent={renderBackdrop}
                ref={bottomSheetModalRef}
                onChange={handleSheetChanges}>
                <BottomSheetView style={styles.contentContainer}>
                    <Container paddingBottom>{content}</Container>
                </BottomSheetView>
            </BottomSheetModal>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
});

export default BottomSheet;
