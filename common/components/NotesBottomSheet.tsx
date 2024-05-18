import { Button, Keyboard } from 'react-native'

import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet'
import { forwardRef, useCallback, useMemo, useState } from 'react'

import { SIZES } from '@/constants/Sizes'
import useThemeColor from '../hooks/useThemeColor'
import Text from './Text'
import View from './View'
import useAppSelector from '../hooks/useAppSelector'
import useAppDispatch from '../hooks/useAppDispatch'
import { setComment } from '@/features/referrals/referralsSlide'

type Props = {
    onClose: () => void
    onUpdate: (newComment: string) => void
}
const NotesBottomSheet = forwardRef<BottomSheetModal, Props>(
    ({ onClose, onUpdate }: Props, ref: any) => {
        const dispatch = useAppDispatch()
        const backgroundColor = useThemeColor('primary')
        const warningColor = useThemeColor('warning')
        const ascent = useThemeColor('accent')
        const snapPoints = useMemo(() => ['40%', '60%'], [])
        const comment = useAppSelector((s) => s.referrals.comment)

        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                />
            ),
            []
        )

        const handleChange = useCallback(
            (text: string) => {
                dispatch(setComment(text))
                //Keyboard.dismiss()
                //onClose()
            },
            [comment]
        )

        // useEffect(() => {
        //     if (isVisible) {
        //         bottomSheetRef.current?.snapToIndex(0)
        //     } else {
        //         bottomSheetRef.current?.close()
        //     }
        // }, [isVisible])
        return (
            <BottomSheetModal
                backgroundStyle={{
                    backgroundColor: backgroundColor
                }}
                index={0}
                topInset={SIZES.statusBarHeight + SIZES.padding + 80}
                ref={ref}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                overDragResistanceFactor={5}
                handleIndicatorStyle={{ backgroundColor: ascent }}
                handleStyle={{ backgroundColor }}
                // onClose={() => {
                //     Keyboard.dismiss()
                //     onClose()
                // }}
            >
                <View
                    style={{
                        padding: SIZES.base,
                        marginTop: 20
                    }}
                >
                    <Text fontFamily="QSBold">Notes or Comments</Text>
                    <BottomSheetTextInput
                        style={{
                            marginTop: 10,
                            marginBottom: 10,
                            borderRadius: 10,
                            minHeight: 70,
                            fontSize: 16,
                            lineHeight: 20,
                            padding: SIZES.base,
                            backgroundColor: 'rgba(151, 151, 151, 0.25)'
                        }}
                        placeholder="Comments or Notes about this referral"
                        value={comment || ''}
                        multiline
                        autoFocus
                        maxLength={160}
                        onChangeText={handleChange}
                    />

                    <View
                        style={{
                            width: '60%',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}
                    >
                        <Button
                            color={warningColor}
                            title={'Cancel'}
                            onPress={() => {
                                Keyboard.dismiss()
                                onClose()
                            }}
                        />
                        <Button
                            title={'Done'}
                            onPress={() => {
                                Keyboard.dismiss()
                                onUpdate(comment!)
                            }}
                        />
                    </View>
                </View>
            </BottomSheetModal>
        )
    }
)

export default NotesBottomSheet
