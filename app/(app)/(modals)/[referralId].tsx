import CommentsOrNotes from '@/common/components/CommentsOrNotes'
import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import NeoView from '@/common/components/NeoView'
import NotesModal from '@/common/components/referrals/NotesModal'
import Row from '@/common/components/Row'
import Scheduler from '@/common/components/Scheduler'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { useReferral } from '@/common/hooks/referrals/useReferral'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import {
    deleteReferral,
    updateReferral
} from '@/features/referrals/referralActions'
import {
    setComment,
    setEditingReferral,
    setReferralState,
    setShowScheduler
} from '@/features/referrals/referralsSlide'
import { sendIntroductionEmail, sendWirelessClosedTemplate } from '@/firebase'

import { Referral } from '@/types'
import { Entypo, FontAwesome } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { router, useLocalSearchParams } from 'expo-router'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

const ReferralDetails = () => {
    const { referralId: id } = useLocalSearchParams<{ referralId: string }>()
    const comment = useAppSelector((s) => s.referrals.comment)
    const [sendingWirelessEmail, setSendingWirelessEmail] = useState(false)
    const [show, setShow] = useState(false)
    const dispatch = useAppDispatch()
    const { loading, referral } = useReferral(id!)
    const [sendingEmail, setSendingEmail] = useState(false)
    const bgColor = useThemeColor('background')
    const bgDanger = useThemeColor('error')
    const textColor = useThemeColor('text')
    const deleteColor = useThemeColor('warning')

    const sendIntroEmail = useCallback(async () => {
        try {
            if (!id) return
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

    const updateComment = async (newComment: string | null) => {
        try {
            if (referral?.comment === newComment) return

            const newReferral: Referral = {
                ...referral!,
                comment: newComment
            }

            dispatch(updateReferral(newReferral))
            dispatch(setComment(null))
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
                        onPress: async () => {
                            if (!referral?.id) return
                            dispatch(deleteReferral(referral.id))
                            //await deleteContact(referral.email)
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
        router.push('/(app)/(modals)/referral')
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

    const sendWirelessT = async () => {
        try {
            if (!referral?.id) return
            const func = sendWirelessClosedTemplate()
            setSendingWirelessEmail(true)
            const sent = await func({ referralId: referral?.id })
            if (sent.data === true) {
                Alert.alert('Email Sent')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSendingWirelessEmail(false)
        }
    }

    useEffect(() => {
        if (!referral) return
        if (referral?.followUpOn) {
            const diff = moment(referral?.followUpOn).isBefore(
                moment().subtract(5, 'minutes')
            )
            if (diff) {
                dispatch(
                    updateReferral({
                        ...referral,
                        followUpOn: null,
                        followUpType: null
                    })
                )
            }
        }
    }, [referral?.followUpOn])

    if (loading || !id) return <Loading />
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
                onPressBack={() => {
                    // if (goHome) {
                    //     dispatch(setGoHome(false))
                    //     router.push('/(app)/(root)/(feeds)/(home)')
                    // } else {
                    //     router.push(`/(app)/(root)/(sales)`)
                    // }
                    router.back()
                }}
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
            <KeyboardAvoidingView
                keyboardVerticalOffset={60}
                style={{ flex: 1 }}
                behavior="padding"
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        padding: SIZES.padding,
                        gap: SIZES.padding,
                        marginBottom: 20
                    }}
                >
                    <Scheduler referral={referral} />
                    <View
                        style={[
                            Styles.boxShadow,
                            styles.container,
                            { backgroundColor: bgColor }
                        ]}
                    >
                        <Text center fontSize={22} fontFamily="SFBold">
                            {referral?.name}
                        </Text>

                        {!referral.propertyName.includes(referral.address) && (
                            <Text
                                color="grey"
                                fontSize={16}
                                fontFamily="QSBold"
                            >
                                {referral.propertyName}
                            </Text>
                        )}

                        <View
                            style={{ gap: SIZES.base, marginTop: SIZES.base }}
                        >
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
                            </Row>
                            {referral?.email && (
                                <Row
                                    style={{ justifyContent: 'space-between' }}
                                >
                                    <Text fontFamily="QSLight">
                                        Email: {referral?.email}
                                    </Text>
                                    {sendingEmail && (
                                        <ActivityIndicator
                                            size="small"
                                            color={textColor}
                                        />
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
                                    {moment(referral?.email_sent_on).format(
                                        'lll'
                                    )}
                                </Text>
                            )}
                        </View>

                        <Row
                            style={{
                                justifyContent: 'center',
                                gap: SIZES.padding * 3,
                                marginTop: SIZES.base
                            }}
                        >
                            {!referral.followUpOn && (
                                <NeoView rounded size={40}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            dispatch(setShowScheduler(true))
                                        }}
                                    >
                                        <FontAwesome
                                            name="calendar-o"
                                            color={textColor}
                                            size={24}
                                        />
                                    </TouchableOpacity>
                                </NeoView>
                            )}
                            <NeoView rounded size={40}>
                                <TouchableOpacity onPress={makeCall}>
                                    <FontAwesome
                                        name="phone"
                                        size={24}
                                        color={textColor}
                                    />
                                </TouchableOpacity>
                            </NeoView>
                            {!referral.emailInstroductionSent &&
                                referral.status.id !== 'not_sold' &&
                                referral.status.id !== 'closed' && (
                                    <NeoView rounded size={40}>
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
                                                name="handshake-o"
                                                size={24}
                                                color={textColor}
                                            />
                                        </TouchableOpacity>
                                    </NeoView>
                                )}

                            {sendingWirelessEmail ? (
                                <ActivityIndicator size={'small'} />
                            ) : !referral.emailWirelessTemplateSent ? (
                                <NeoView rounded size={40}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Alert.alert(
                                                'Send Wireless Template',
                                                `Would you like to send helpful wireless information to ${referral.name}?`,
                                                [
                                                    {
                                                        text: 'Cancel',
                                                        style: 'cancel'
                                                    },
                                                    {
                                                        text: 'Yes, Send it',
                                                        onPress: sendWirelessT
                                                    }
                                                ]
                                            )
                                        }}
                                    >
                                        <Row style={{ gap: 4 }}>
                                            <Entypo
                                                name="email"
                                                size={24}
                                                color={textColor}
                                            />
                                        </Row>
                                    </TouchableOpacity>
                                </NeoView>
                            ) : null}
                        </Row>
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
                                        'ddd, MMM Do, YYYY'
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
                                {referral?.isVerizonWirelessCustomer
                                    ? 'YES'
                                    : 'NO'}
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
                                Due Date:{' '}
                                <Text>
                                    {moment(referral.due_date).format('LL')}
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

                    <CommentsOrNotes
                        comment={referral.comment || ''}
                        onOpen={() => {
                            dispatch(setComment(referral.comment))
                            setShow(true)
                        }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
            {/* <NotesBottomSheet
                ref={bottomSheetRef}
                onClose={handlePresentModalClose}
                onUpdate={updateComment}
            /> */}
            <NotesModal
                show={show}
                setShow={setShow}
                onDone={() => {
                    updateComment(comment)
                    setShow(false)
                }}
            />
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
