import { Button, Keyboard } from 'react-native'

import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SIZES } from '@/constants/Sizes'
import useThemeColor from '../hooks/useThemeColor'
import Text from './Text'
import View from './View'

type Props = {
    isVisible: boolean
    comment: string
    onClose: () => void
    onUpdate: (newComment: string) => void
}
const NotesBottomSheet = ({ isVisible, comment, onClose, onUpdate }: Props) => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const backgroundColor = useThemeColor('primary')
    const warningColor = useThemeColor('warning')
    const ascent = useThemeColor('accent')
    const snapPoints = useMemo(() => ['50%'], [])
    const [newComment, setNewComment] = useState(comment)

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

    const handleUpdate = () => {
        onUpdate(newComment)
        onClose()
        Keyboard.dismiss()
    }

    useEffect(() => {
        if (isVisible) {
            bottomSheetRef.current?.snapToIndex(0)
        } else {
            bottomSheetRef.current?.close()
        }
    }, [isVisible])
    return (
        <BottomSheet
            backgroundStyle={{
                backgroundColor: backgroundColor
            }}
            index={-1}
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            overDragResistanceFactor={5}
            handleIndicatorStyle={{ backgroundColor: ascent }}
            handleStyle={{ backgroundColor }}
            onClose={() => {
                Keyboard.dismiss()
                onClose()
            }}
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
                    value={newComment}
                    multiline
                    autoFocus
                    maxLength={160}
                    onChangeText={setNewComment}
                    //placeholderTextColor={theme.TEXT_COLOR + 90}
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
                            handleUpdate()
                        }}
                    />
                </View>
            </View>
        </BottomSheet>
    )
}

export default NotesBottomSheet
