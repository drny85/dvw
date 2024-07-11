import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { setShowScheduler } from '@/features/referrals/referralsSlide'
import { Referral } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { AnimatePresence, MotiView } from 'moti'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import useAppDispatch from '../hooks/useAppDispatch'
import useAppSelector from '../hooks/useAppSelector'
import { schedulePushNotification } from '../hooks/useNotification'
import useThemeColor from '../hooks/useThemeColor'
import DateTimePickerComponent from './DateTimePicker'
import Text from './Text'
import View from './View'
import { updateReferral } from '@/features/referrals/referralActions'
import ButtonRadio from './RadioButton'
import { router } from 'expo-router'

const Scheduler = ({
    referral,
    hide
}: {
    referral: Referral
    hide?: boolean
}) => {
    const showFollowUp = useAppSelector((s) => s.referrals.showScheduler)
    const [followUp, setFollowUp] = useState<Date>(new Date())
    const [followUpType, setFollowUpType] =
        useState<Referral['followUpType']>(null)
    const dispatch = useAppDispatch()
    const bgColor = useThemeColor('background')
    const btnColor = useThemeColor('background')
    const iconColor = useThemeColor('text')
    const handleFollowUp = useCallback(async () => {
        try {
            if (!referral || !followUp) return

            if (!followUpType) {
                Alert.alert('Please select a Follow Up Type')
                return
            }

            const identifier = await schedulePushNotification({
                title: 'Follow Up',
                data: { id: referral.id!, type: 'reminder' },
                body: `Get in contact with ${referral.name}`,
                date: followUp?.toISOString()
            })
            if (!identifier) return
            dispatch(
                updateReferral({
                    ...referral,
                    followUpOn: followUp?.toISOString(),
                    followUpType: followUpType || null,
                    notificationIdentifier: identifier
                })
            )

            dispatch(setShowScheduler(false))
            if (hide) {
                router.replace('/(app)/(root)/(feeds)/(home)/followups')
            }
        } catch (error) {
            console.log(error)
        }
    }, [referral, followUp, followUpType])

    useEffect(() => {
        if (!hide) return
        setFollowUpType('wireless')
    }, [hide])
    return (
        <AnimatePresence>
            {(showFollowUp || hide) && (
                <>
                    <MotiView
                        style={{
                            padding: SIZES.padding,
                            borderRadius: SIZES.radius,
                            justifyContent: 'center',
                            gap: SIZES.padding,
                            alignItems: 'center',
                            position: 'absolute',
                            left: 10,
                            right: 10,
                            top: 0,
                            zIndex: 300,
                            height: SIZES.height * 0.4,

                            backgroundColor: bgColor,
                            ...Styles.boxShadow,
                            shadowColor: 'rgba(0,0,0,0.4)'
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
                        <Text center fontFamily="QSBold" fontSize={18}>
                            Schedule Follow Up
                        </Text>
                        <View
                            style={{ position: 'absolute', top: 20, right: 20 }}
                        >
                            <FontAwesome
                                name="close"
                                size={24}
                                color={iconColor}
                                onPress={() => {
                                    if (hide) {
                                        router.replace(
                                            '/(app)/(root)/(feeds)/(home)/followups'
                                        )
                                    } else {
                                        dispatch(setShowScheduler(false))
                                    }
                                }}
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
                            minuteInterval={5}
                            onVisibilityChange={() => {}}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                gap: SIZES.padding
                            }}
                        >
                            <ButtonRadio
                                title="Fios"
                                selected={followUpType === 'fios'}
                                onPress={() => {
                                    setFollowUpType('fios')
                                }}
                            />
                            <ButtonRadio
                                title="Wireless"
                                selected={followUpType === 'wireless'}
                                onPress={() => {
                                    setFollowUpType('wireless')
                                }}
                            />
                        </View>

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
