import DateTimePickerComponent from '@/common/components/DateTimePicker'
import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import { useReferral } from '@/common/hooks/referrals/useReferral'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { schedulePushNotification } from '@/common/hooks/useNotification'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import {
    deleteReferral,
    updateReferral
} from '@/features/referrals/referralActions'
import {
    setEditingReferral,
    setReferralState
} from '@/features/referrals/referralsSlide'
import { sendIntroductionEmail } from '@/firebase'
import { Referral } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { router, useLocalSearchParams } from 'expo-router'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'
import React, { useCallback, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ReferralDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    const dispatch = useAppDispatch()
    const { loading, referral } = useReferral(id)
    const [sendingEmail, setSendingEmail] = useState(false)
    const goToPlan = useAppSelector((s) => s.referrals.goToPlan)
    const [editComment, setEditComment] = useState(false)
    const [showFollowUp, setShowFollowUp] = useState(false)
    const [followUp, setFollowUp] = useState(new Date())
    const [newComment, setNewComment] = useState('')
    const bgColor = useThemeColor('background')
    const bgDanger = useThemeColor('error')
    const textColor = useThemeColor('text')
    const deleteColor = useThemeColor('warning')
    const placeholderColor = useThemeColor('placeholder')

    const sendIntroEmail = useCallback(async () => {
        try {
            const func = sendIntroductionEmail()
            setSendingEmail(true)
            const res = await func({
                referralId: id
            })

            if (res.data.message) Alert.alert(res.data.message)
        } catch (error) {
            console.log(error)
        } finally {
            setSendingEmail(false)
        }
    }, [id])

    const handleFollowUp = useCallback(async () => {
        try {
            if (!referral) return
            dispatch(
                updateReferral({
                    ...referral,
                    followUpOn: followUp.toISOString()
                })
            )
            setShowFollowUp(false)
            schedulePushNotification({
                title: 'Follow Up',
                data: { id: referral.id!, type: 'reminder' },
                body: `Get in contact with ${referral.name}`,
                date: followUp.toISOString()
            })
        } catch (error) {
            console.log(error)
        }
    }, [])

    const updateComment = async () => {
        try {
            if (referral?.comment === newComment) return

            const newReferral: Referral = {
                ...referral!,
                comment: newComment
            }
            console.log(newReferral.comment)
            dispatch(updateReferral(newReferral))
        } catch (error) {
            console.log(error)
        }
    }

    const onDeleteReferral = async () => {
        try {
            Alert.alert(
                'Delete Referral',
                'Are you sure you want to delete this referral?',
                [
                    {
                        text: 'Cancel',

                        style: 'cancel'
                    },
                    {
                        text: 'Yes, Delete it',
                        onPress: () => {
                            if (!referral?.id) return
                            dispatch(deleteReferral(referral.id))
                            router.back()
                        },
                        style: 'destructive'
                    }
                ]
            )
        } catch (error) {
            console.log('Error deleting referral', error)
        }
    }

    const onEditPress = () => {
        dispatch(setEditingReferral(true))
        dispatch(setReferralState(referral))
        router.push('/referrals')
    }

    const makeCall = () => {
        const number = referral?.phone.replace(/[^0-9]/g, '').trim()
        if (!number) return

        Linking.canOpenURL(`tel:${number}`)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(`tel:${number}`)
                } else {
                    console.log("Don't know how to open URI: " + number)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    if (loading) return <Loading />
    if (!referral)
        return (
            <Screen>
                <Header title="Details" onPressBack={router.back} />
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text center>No Referral Found</Text>
                    <Text center>Please try again later</Text>
                </View>
            </Screen>
        )

    return (
        <Screen>
            <Header
                title="Details"
                onPressBack={router.back}
                hasRightIcon
                rightIcon={
                    <Row style={{ gap: SIZES.padding * 1.5 }}>
                        <TouchableOpacity
                            style={{ marginRight: SIZES.padding }}
                            onPress={onDeleteReferral}
                        >
                            <FontAwesome
                                name="trash"
                                color={deleteColor}
                                size={28}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginRight: SIZES.padding }}
                            onPress={onEditPress}
                        >
                            <FontAwesome
                                name="edit"
                                color={textColor}
                                size={28}
                            />
                        </TouchableOpacity>
                    </Row>
                }
            />
            <KeyboardAwareScrollView
                extraHeight={60}
                keyboardDismissMode="on-drag"
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.padding
                }}
            >
                <View
                    style={[
                        Styles.boxShadow,
                        styles.container,
                        { backgroundColor: bgColor }
                    ]}
                >
                    <Row
                        style={{
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Text />
                        <Text center fontSize={22} fontFamily="SFBold">
                            {referral?.name}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowFollowUp(!showFollowUp)}
                        >
                            <FontAwesome
                                name="calendar-o"
                                color={textColor}
                                size={24}
                            />
                        </TouchableOpacity>
                    </Row>
                    {!referral.propertyName.includes(referral.address) && (
                        <Text color="grey" fontSize={16} fontFamily="QSBold">
                            {referral.propertyName}
                        </Text>
                    )}
                    <AnimatePresence>
                        {showFollowUp && (
                            <MotiView
                                style={{
                                    padding: SIZES.padding,
                                    borderRadius: SIZES.radius,
                                    justifyContent: 'center',
                                    gap: SIZES.base,
                                    alignItems: 'center',

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
                                <Row>
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
                                        style={{ marginLeft: SIZES.padding }}
                                    >
                                        <Text fontFamily="SFBold">Save</Text>
                                    </TouchableOpacity>
                                </Row>
                            </MotiView>
                        )}
                    </AnimatePresence>
                    <View style={{ gap: SIZES.base, marginTop: SIZES.base }}>
                        <Text fontFamily="QSLight">
                            {referral?.address &&
                                referral?.address.slice(
                                    0,
                                    referral.address.length - 5
                                )}
                        </Text>
                        <Text fontFamily="QSLight">
                            Apt, Unit / FLR: {referral?.apt}
                        </Text>
                        <Row style={{ justifyContent: 'space-between' }}>
                            <Text fontFamily="QSLight">
                                Phone: {referral?.phone}
                            </Text>
                            <TouchableOpacity onPress={makeCall}>
                                <FontAwesome
                                    name="phone"
                                    size={22}
                                    color={textColor}
                                />
                            </TouchableOpacity>
                        </Row>
                        {referral?.email && (
                            <Row style={{ justifyContent: 'space-between' }}>
                                <Text fontFamily="QSLight">
                                    Email: {referral?.email}
                                </Text>
                                {sendingEmail && (
                                    <ActivityIndicator
                                        size="small"
                                        color={textColor}
                                    />
                                )}
                                {!referral.email_sent &&
                                    referral.status.id !== 'not_sold' && (
                                        <TouchableOpacity
                                            disabled={sendingEmail}
                                            onPress={() => {
                                                Alert.alert(
                                                    'Send Email',
                                                    'This will send an email introduction to the customer \n Would you like to send it?',
                                                    [
                                                        {
                                                            text: 'Cancel',
                                                            style: 'cancel'
                                                        },
                                                        {
                                                            text: 'Send',
                                                            onPress:
                                                                sendIntroEmail,
                                                            style: 'destructive'
                                                        }
                                                    ]
                                                )
                                            }}
                                        >
                                            <FontAwesome
                                                name="envelope"
                                                size={22}
                                                color={textColor}
                                            />
                                        </TouchableOpacity>
                                    )}
                            </Row>
                        )}
                        {referral?.followUpOn && (
                            <Text fontFamily="QSLight">
                                Follow Up:{' '}
                                {moment(referral?.followUpOn).format('lll')}
                            </Text>
                        )}
                        {referral?.email_sent && (
                            <Text fontFamily="QSLight">
                                Email Sent On:{' '}
                                {moment(referral?.email_sent_on).format('lll')}
                            </Text>
                        )}
                    </View>
                </View>
                <View
                    style={[
                        Styles.boxShadow,
                        styles.container,
                        {
                            backgroundColor:
                                referral.status.name === 'Not Sold'
                                    ? bgDanger
                                    : bgColor
                        }
                    ]}
                >
                    <Row style={{ justifyContent: 'space-between' }}>
                        <Text>
                            Status:{' '}
                            <Text fontFamily="QSLight">
                                {referral.status.name}
                            </Text>
                        </Text>
                    </Row>
                    <Row style={{ justifyContent: 'space-between' }}>
                        <Text>
                            Move In:{' '}
                            <Text fontFamily="QSLight">
                                {moment(referral?.moveIn).format(
                                    'ddd, MMMM Do, YYYY'
                                )}
                            </Text>
                        </Text>
                        <Text fontSize={13} fontFamily="QSLight">
                            {moment(referral?.moveIn).fromNow()}
                        </Text>
                    </Row>
                    {/* <Text>
                        Status:{' '}
                        <Text fontFamily="QSLight">
                            {referral?.status.name}
                        </Text>
                    </Text> */}
                    <Text>
                        Is Verizon Wireless :{' '}
                        <Text fontFamily="QSLight">
                            {referral?.isVerizonWirelessCustomer ? 'YES' : 'NO'}
                        </Text>
                    </Text>
                    {referral?.type === 'acp' && (
                        <Text>
                            ACP Customer :{' '}
                            <Text fontFamily="QSLight">
                                {referral?.type === 'acp' ? 'YES' : 'NO'}
                            </Text>
                        </Text>
                    )}
                    {referral?.referee && (
                        <Text>
                            Referred By:{' '}
                            <Text capitalize fontFamily="QSLight">
                                {referral?.referee?.name}
                            </Text>
                        </Text>
                    )}
                    {referral?.applicationId && (
                        <Text>
                            ACP:{' '}
                            <Text fontFamily="QSLight">
                                {referral?.applicationId}
                            </Text>
                        </Text>
                    )}
                </View>
                {referral?.status.id === 'closed' && (
                    <View
                        style={[
                            Styles.boxShadow,
                            styles.container,
                            { backgroundColor: bgColor, gap: SIZES.base }
                        ]}
                    >
                        <Text fontFamily="SFBold">
                            MON: <Text>{referral.mon}</Text>
                        </Text>
                        <Text fontFamily="SFBold">
                            Order Date:{' '}
                            <Text>
                                {moment(referral.order_date).format('LL')}
                            </Text>
                        </Text>
                        <Text fontFamily="SFBold">
                            Services:{' '}
                            <Text>
                                {referral.package?.internet &&
                                    `${referral.package.internet.name}`}{' '}
                                {referral.package?.tv &&
                                    `, ${referral.package.tv.name}`}{' '}
                                {referral.package?.home &&
                                    `, ${referral.package.home.name}`}
                                {referral.package?.wireless &&
                                    `, ${referral.package.wireless.name}`}
                            </Text>
                        </Text>
                    </View>
                )}

                <View
                    style={[
                        Styles.boxShadow,
                        styles.container,
                        { backgroundColor: bgColor }
                    ]}
                >
                    <Row style={{ justifyContent: 'space-between' }}>
                        <Text fontFamily="SFBold">Notes or Comments</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (referral?.comment) {
                                    setNewComment(referral?.comment)
                                }
                                setEditComment((prev) => {
                                    if (prev) {
                                        updateComment()
                                    }
                                    return !prev
                                })
                            }}
                        >
                            <Row>
                                <Text fontFamily="QSBold">
                                    {editComment ? 'Save' : 'Edit'}
                                </Text>

                                <FontAwesome
                                    style={{ marginLeft: SIZES.base }}
                                    name={editComment ? 'save' : 'edit'}
                                    size={20}
                                    color={textColor}
                                />
                            </Row>
                        </TouchableOpacity>
                    </Row>
                    {!editComment ? (
                        <TouchableOpacity
                            onLongPress={() => setEditComment(true)}
                            style={{
                                borderWidth: 0.5,
                                borderRadius: SIZES.radius,
                                borderColor: placeholderColor,
                                padding: SIZES.base
                            }}
                        >
                            <Text fontFamily="QSLight" fontSize={18}>
                                {referral?.comment}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TextInput
                            isMultiline
                            placeholder="Type any note or comment here.."
                            autoCapitalize="none"
                            value={newComment}
                            onChangeText={setNewComment}
                            style={{ fontFamily: 'QSLight' }}
                        />
                    )}
                </View>
            </KeyboardAwareScrollView>
        </Screen>
    )
}

export default ReferralDetails

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        gap: SIZES.base
    }
})
