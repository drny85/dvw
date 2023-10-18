import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import { useReferral } from '@/common/hooks/referrals/useReferral'
import useAppDispatch from '@/common/hooks/useAppDispatch'
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
import { Referral } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { router, useLocalSearchParams } from 'expo-router'
import moment from 'moment'
import React, { useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ReferralDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    const dispatch = useAppDispatch()
    const { loading, referral } = useReferral(id)
    const [editComment, setEditComment] = useState(false)
    const [newComment, setNewComment] = useState('')
    const bgColor = useThemeColor('background')
    const textColor = useThemeColor('text')
    const deleteColor = useThemeColor('warning')
    const placeholderColor = useThemeColor('placeholder')
    const updateComment = async () => {
        try {
            if (referral?.comment === newComment) return
            console.log('Updating')
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
        console.log(number)

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
                    <Text center fontSize={20} fontFamily="SFBold">
                        {referral?.name}
                    </Text>
                    <View style={{ gap: SIZES.base, marginTop: SIZES.base }}>
                        <Text fontFamily="QSLight">
                            {referral?.address.slice(
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
                            <TouchableOpacity
                                onPress={makeCall}
                                style={{ marginRight: SIZES.padding }}
                            >
                                <FontAwesome
                                    name="phone"
                                    size={22}
                                    color={textColor}
                                />
                            </TouchableOpacity>
                        </Row>

                        {referral?.email && (
                            <Text fontFamily="QSLight">
                                Email: {referral?.email}
                            </Text>
                        )}
                    </View>
                </View>
                <View
                    style={[
                        Styles.boxShadow,
                        styles.container,
                        { backgroundColor: bgColor }
                    ]}
                >
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
                    <Text>
                        Status:{' '}
                        <Text fontFamily="QSLight">
                            {referral?.status.name}
                        </Text>
                    </Text>
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
                    <Text>
                        Referred By:{' '}
                        <Text fontFamily="QSLight">
                            {referral?.referee?.name}
                        </Text>
                    </Text>
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
