import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { forwardRef, useMemo } from 'react'
import TotalView from './TotalView'
import { router } from 'expo-router'

type Props = { index?: number }
const TotalContainer = forwardRef(({ index }: Props, ref: any) => {
    const snapPoints = useMemo(
        () => ['1%', '10%', '30%', '50%', '60%', '75%'],
        []
    )
    const bgColor = useThemeColor('background')
    const handleColor = useThemeColor('secondary')

    return (
        <BottomSheet
            ref={ref}
            index={index ? index : -1}
            backgroundStyle={{ backgroundColor: bgColor }}
            snapPoints={snapPoints}
            handleIndicatorStyle={{ backgroundColor: handleColor }}
        >
            <BottomSheetView style={{ padding: SIZES.padding }}>
                <TotalView
                    showResetAll
                    onClickSave={() => {
                        // router.push(`/(app)/(root)/(plan)/saveQuote`)
                        router.push('/(app)/(nova)/saveQuote')
                    }}
                />
            </BottomSheetView>
        </BottomSheet>
    )
})

export default TotalContainer
