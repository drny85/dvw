import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { setShowScheduler } from '@/features/referrals/referralsSlide'
import { Referral } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { AnimatePresence, MotiView } from 'moti'
import React, { useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import useAppDispatch from '../hooks/useAppDispatch'
import useAppSelector from '../hooks/useAppSelector'
import { schedulePushNotification } from '../hooks/useNotification'
import useThemeColor from '../hooks/useThemeColor'
import DateTimePickerComponent from './DateTimePicker'
import Text from './Text'
import View from './View'
import { updateReferral } from '@/features/referrals/referralActions'

const Scheduler = ({ referral }: { referral: Referral }) => {
    const showFollowUp = useAppSelector((s) => s.referrals.showScheduler)
    const [followUp, setFollowUp] = useState<Date>(new Date())
    const dispatch = useAppDispatch()
    const bgColor = useThemeColor('secondary')
    const btnColor = useThemeColor('background')
    const iconColor = useThemeColor('text')
    const handleFollowUp = useCallback(async () => {
        try {
            if (!referral || !followUp) return

            await schedulePushNotification({
                title: 'Follow Up',
                data: { id: referral.id!, type: 'reminder' },
                body: `Get in contact with ${referral.name}`,
                date: followUp?.toISOString()
            })
            dispatch(
                updateReferral({
                    ...referral,
                    followUpOn: followUp?.toISOString()
                })
            )
            console.log('follow up scheduled', followUp.toISOString())
            dispatch(setShowScheduler(false))
        } catch (error) {
            console.log(error)
        }
    }, [referral, followUp])
    return (
        <AnimatePresence>
            {showFollowUp && (
                <>
                    <MotiView
                        style={{
                            padding: SIZES.padding,
                            borderRadius: SIZES.radius,
                            justifyContent: 'center',
                            gap: SIZES.padding,
                            alignItems: 'center',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            zIndex: 300,
                            height: SIZES.height * 0.4,

                            backgroundColor: bgColor,
                            ...Styles.boxShadow
                        }}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -20 }}
                        transition={{
                            type: 'timing',
                            duration: 400,
                            delay: 200
                        }}
                    >
                        <Text center fontFamily="QSBold">
                            Schedule Follow Up
                        </Text>
                        <View
                            style={{ position: 'absolute', top: 20, right: 20 }}
                        >
                            <FontAwesome
                                name="close"
                                size={24}
                                color={iconColor}
                                onPress={() =>
                                    dispatch(setShowScheduler(false))
                                }
                            />
                        </View>

                        <DateTimePickerComponent
                            onDateChange={(date) => {
                                setFollowUp(date)
                            }}
                            isVisible
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                borderRadius: 20
                            }}
                            mode="datetime"
                            value={followUp}
                            onVisibilityChange={() => {}}
                        />

                        <TouchableOpacity
                            onPress={handleFollowUp}
                            style={{
                                paddingHorizontal: SIZES.padding,
                                paddingVertical: SIZES.base,
                                borderRadius: SIZES.radius,
                                backgroundColor: btnColor
                            }}
                        >
                            <Text fontFamily="SFBold" fontSize={20}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </MotiView>
                </>
            )}
        </AnimatePresence>
    )
}

export default Scheduler
