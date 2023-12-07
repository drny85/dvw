import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetView
} from '@gorhom/bottom-sheet'

import React, { forwardRef, useCallback, useMemo } from 'react'

type Props = {
    children: React.ReactNode
}

const BottomSheetCustomModal = forwardRef(({ children }: Props, ref: any) => {
    const snapPoints = useMemo(() => ['50%', '90%'], [])

    const bgColor = useThemeColor('background')

    const textColor = useThemeColor('text')

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={3}
            />
        ),
        []
    )

    return (
        <BottomSheetModal
            ref={ref}
            index={1}
            topInset={SIZES.statusBarHeight + SIZES.padding + SIZES.base}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            keyboardBehavior="fillParent"
            handleIndicatorStyle={{
                backgroundColor: textColor
            }}
            backgroundStyle={{
                backgroundColor: bgColor
            }}
            enablePanDownToClose
        >
            <BottomSheetView>{children}</BottomSheetView>
        </BottomSheetModal>
    )
})

export default BottomSheetCustomModal
