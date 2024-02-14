import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import React, { useEffect, useRef } from 'react'
import { Alert, TextInput as Input, StyleSheet } from 'react-native'

import ButtonRadio from '@/common/components/RadioButton'
import Row from '@/common/components/Row'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import {
    ORDER_TYPE,
    Referral,
    SERVICE,
    STATUS,
    services,
    statuses
} from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import { TouchableOpacity } from 'react-native'
import {
    GooglePlacesAutocomplete,
    GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import DateModal from '@/common/components/DateModal'
import useAppSelector from '@/common/hooks/useAppSelector'
import { isFullName } from '@/utils/isFullName'
import moment from 'moment'

import DataPickerModal from '@/common/components/DataPickerModal'
import Loading from '@/common/components/Loading'
import { useHelpers } from '@/common/hooks/referrals/useHelpers'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import {
    addReferral,
    updateReferral
} from '@/features/referrals/referralActions'
import {
    setEditingReferral,
    setHasWireless,
    setReferralState,
    setReferrralLines
} from '@/features/referrals/referralsSlide'
import { setSaleQuoteReferral } from '@/features/sales/salesSlide'
import { formatPhone } from '@/utils/formatPhone'
import { isEmailValid } from '@/utils/isEmailValid'
import { FlatList } from 'react-native-gesture-handler'
import { Dispatch } from '@reduxjs/toolkit'

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_KEY as string

const ReferralsScreen = () => {
    const dispatch = useAppDispatch()

    const user = useAppSelector((s) => s.auth.user)
    const { referral: editingReferral, editing } = useAppSelector(
        (s) => s.referrals
    )
    const referralLines = useAppSelector((s) => s.referrals.referralLines)

    const { loading, helpers } = useHelpers()
    const scrollViewRef = useRef<KeyboardAwareScrollView>(null)
    const [index, setIndex] = React.useState(0)
    const monRef = useRef<Input>(null)
    const googleRef = useRef<GooglePlacesAutocompleteRef>(null)
    const [isReferral, setIsReferral] = React.useState(true)
    const [showMoveIn, setShowMoveIn] = React.useState(false)
    const [showStatus, setShowStatus] = React.useState(false)
    const [address, setAddress] = React.useState('')
    const [moveIn, setMoveIn] = React.useState<string | null>(null)
    const [showInternetPicker, setShowInternetPicker] = React.useState(false)
    const [showReferees, setShowReferees] = React.useState(false)
    const [showManagers, setShowManagers] = React.useState(false)
    const [showTvPicker, setShowTvPicker] = React.useState(false)
    const [showOrderDate, setShowOrderDate] = React.useState(false)
    const [showOrderDueDate, setShowOrderDueDate] = React.useState(false)
    const [showWirelessPicker, setShowWirelessPicker] = React.useState(false)
    const [showHomePicker, setShowHomePicker] = React.useState(false)

    const [orderType, setOrderType] = React.useState<ORDER_TYPE>('new')
    const [isVZW, setIsVZW] = React.useState<boolean>(false)
    const bgColor = useThemeColor('background')

    const secondaryColor = useThemeColor('secondary')
    const textColor = useThemeColor('text')
    const placeholderColor = useThemeColor('placeholder')
    const [referral, setReferral] = React.useState<Referral>({
        name: '',
        address: address,
        apt: '',
        moveIn: moveIn,
        addedBy: user?.id!,
        applicationId: null,
        isReferral,
        comment: null,
        due_date: null,
        email_sent: false,
        email_sent_on: null,
        date_entered: new Date().toISOString(),
        isVerizonWirelessCustomer: false,
        propertyName: '',
        followUpType: null,
        mon: null,
        emailInstroductionSent: false,
        manager: null,
        package: {
            internet: null,
            home: null,
            tv: null,
            wireless: null
        },
        order_date: null,
        phone: '',
        referee: null,
        status: { id: 'new', name: 'New' },
        type: orderType,
        updated: null,
        userName: user?.name!,
        userId: user?.id!,
        email: '',
        followUpOn: null,
        referralLines: referralLines || 0
    })

    const validateServicesOrdered = (): boolean => {
        if (
            referral.package?.home === null &&
            referral.package?.internet === null &&
            referral.package?.tv === null &&
            referral.package.wireless === null
        )
            return false
        return true
    }

    const onPressPrev = () => {
        if (index !== 0) {
            setIndex((prev) => {
                if (address && prev === 2) {
                    googleRef.current?.setAddressText(address)
                }
                return prev - 1
            })
        }
    }

    const onPressNext = async () => {
        if (index === 0) {
            setIndex((prev) => prev + 1)
        }
        if (index === 1) {
            console.log(address)
            if (address === '') {
                Alert.alert('Please enter a valid address')
                googleRef.current?.focus()
                return
            }
            if (referral.apt === '') {
                Alert.alert('Please enter apt # or Floor #')
                return
            }
            if (referral.propertyName === '') {
                Alert.alert(
                    'Please enter a name for this property \n if you dont know the name, please just enter the address. Ex 123 Main St'
                )
                return
            }
            if (moveIn === null) {
                Alert.alert('Please enter a valid move in date')
                setShowMoveIn(true)
                return
            }
            setIndex((prev) => prev + 1)
        }
        if (index === 2) {
            if (!isFullName(referral.name)) {
                Alert.alert('Please enter the full name')
                return
            }
            if (referral.phone.length < 14) {
                Alert.alert('Please enter valid phone')
                return
            }
            if (referral.email && !isEmailValid(referral.email)) {
                Alert.alert('Please enter a valid email')
                return
            }
            setIndex((prev) => prev + 1)
        }
        if (index === 3) {
            if (referral.status.id === 'closed') {
                if (!referral.mon) {
                    Alert.alert('MON Error', 'Please enter a valid MON', [
                        { text: 'OK', onPress: () => monRef.current?.focus() }
                    ])
                    return
                }
                if (!validateServicesOrdered()) {
                    Alert.alert('Please select at least one package')
                    return
                }
                if (referral.order_date === null) {
                    Alert.alert('Please enter a valid order date')
                    return
                }
                if (referral.due_date === null) {
                    Alert.alert('Please enter a valid due date')
                    return
                }
            }

            try {
                if (editing && editingReferral) {
                    const r = { ...referral, referralLines }
                    dispatch(updateReferral(r))
                    dispatch(setEditingReferral(false))
                    setReferralState(null)
                    if (
                        referral.status.id === 'closed' &&
                        editingReferral.status.id !== 'closed'
                    ) {
                        dispatch(
                            setSaleQuoteReferral({
                                ...referral,
                                isVerizonWirelessCustomer: isVZW
                            })
                        )

                        router.push('/(app)/(modals)/Congratulations')
                    } else {
                        router.back()
                    }
                } else {
                    if (referral.status.id === 'closed') {
                        dispatch(
                            addReferral({
                                ...referral,
                                isVerizonWirelessCustomer: isVZW,
                                referralLines
                            })
                        )
                        dispatch(
                            setSaleQuoteReferral({
                                ...referral,
                                isVerizonWirelessCustomer: isVZW
                            })
                        )

                        // setShowCongratulations(true)
                        router.push('/(app)/(modals)/Congratulations')
                        //router.push('/(app)/(root)/(sales)/congratulations')
                    } else {
                        dispatch(
                            addReferral({
                                ...referral,
                                isVerizonWirelessCustomer: isVZW,
                                referralLines
                            })
                        )
                        router.back()
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                dispatch(setReferrralLines(0))
            }
        }
    }

    useEffect(() => {
        if (editingReferral && editing) {
            setAddress(editingReferral.address)
            setReferral(editingReferral)
            setMoveIn(referral.moveIn)
            setIsVZW(referral.isVerizonWirelessCustomer)
            setIndex(3)
        }

        return () => {
            dispatch(setEditingReferral(false))
            dispatch(setReferralState(null))
            setIndex(0)
        }
    }, [editingReferral, editing])

    useEffect(() => {
        if (helpers.filter((h) => h.type === 'ce').length === 1) {
            setReferral({
                ...referral,
                manager: helpers.filter((h) => h.type === 'ce')[0]
            })
        }
    }, [helpers.length])

    if (loading) return <Loading />

    return (
        <Screen style={{ flex: 1 }}>
            <Row
                style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: SIZES.padding,
                    marginVertical: SIZES.base
                }}
            >
                {index === 0 ? (
                    <TouchableOpacity
                        onPress={() => {
                            router.back()
                        }}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={26}
                            color={textColor}
                        />
                    </TouchableOpacity>
                ) : (
                    <Text />
                )}
                <Text center fontFamily="SFBold" fontSize={18}>
                    {index === 0
                        ? 'Main Info'
                        : index === 2
                        ? "Customer's Info"
                        : 'Referral Info'}
                </Text>
                {index !== 0 ? (
                    <TouchableOpacity onPress={router.back}>
                        <FontAwesome name="close" size={26} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <Text />
                )}
            </Row>

            <KeyboardAwareScrollView
                ref={scrollViewRef}
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.padding
                }}
                scrollEventThrottle={30}
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets
                keyboardShouldPersistTaps="handled"
                extraHeight={60}
            >
                {index === 0 &&
                    mainInfo(
                        bgColor,
                        isReferral,
                        setIsReferral,
                        orderType,
                        setOrderType
                    )}
                {index === 1 &&
                    SectionOne(
                        googleRef,
                        bgColor,
                        placeholderColor,
                        textColor,
                        setAddress,
                        address,
                        referral,
                        setReferral,
                        setShowMoveIn,
                        editing,
                        setShowReferees,
                        isReferral,
                        moveIn
                    )}
                {index === 2 &&
                    SectionTwo(
                        referral,
                        setReferral,
                        setShowManagers,
                        placeholderColor
                    )}

                {index === 3 &&
                    SectionThree(
                        setShowStatus,
                        placeholderColor,
                        referral,
                        monRef,
                        setReferral,
                        setShowInternetPicker,
                        secondaryColor,
                        setShowTvPicker,
                        setShowHomePicker,
                        setShowWirelessPicker,
                        validateServicesOrdered,
                        setShowOrderDate,
                        setShowOrderDueDate,
                        orderType,
                        isVZW,
                        setIsVZW,
                        dispatch,
                        referralLines
                    )}
            </KeyboardAwareScrollView>
            <View style={{ padding: SIZES.padding }}>
                <Row style={{ justifyContent: 'space-between' }}>
                    {index === 0 ? (
                        <Text />
                    ) : (
                        <TouchableOpacity
                            disabled={index === 0}
                            onPress={onPressPrev}
                        >
                            <Row style={{ gap: SIZES.base }}>
                                <FontAwesome
                                    name="chevron-left"
                                    size={24}
                                    color={textColor}
                                />

                                <Text>Prev</Text>
                            </Row>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onPressNext}>
                        <Row style={{ gap: SIZES.base }}>
                            <Text
                                fontFamily={
                                    index === 3 ? 'SFBold' : 'SFRegular'
                                }
                            >
                                {index === 3 ? 'Save Referral' : 'Next'}
                            </Text>

                            <FontAwesome
                                name="chevron-right"
                                size={24}
                                color={textColor}
                            />
                        </Row>
                    </TouchableOpacity>
                </Row>
            </View>

            <DateModal
                maxDate={moment().format('YYYY-MM-DD')}
                minDate={moment().subtract(2, 'weeks').format('YYYY-MM-DD')}
                date={
                    referral.order_date
                        ? referral.order_date
                        : new Date().toISOString()
                }
                onChange={(e, date) => {
                    if (date) {
                        setReferral({
                            ...referral!,
                            order_date: date.toISOString()
                        })
                        setShowOrderDate(false)
                    }
                }}
                show={showOrderDate}
                setShow={() => setShowOrderDate(false)}
            />
            <DateModal
                maxDate={moment().add(3, 'months').format('YYYY-MM-DD')}
                minDate={moment().format('YYYY-MM-DD')}
                date={
                    referral.due_date
                        ? referral.due_date
                        : new Date().toISOString()
                }
                onChange={(e, date) => {
                    if (date) {
                        setReferral({
                            ...referral!,
                            due_date: date.toISOString()
                        })
                        setShowOrderDueDate(false)
                        scrollViewRef.current?.scrollToEnd()
                    }
                }}
                show={showOrderDueDate}
                setShow={() => setShowOrderDueDate(false)}
            />

            <DateModal
                date={moveIn ? moveIn : new Date().toISOString()}
                onChange={(event, date) => {
                    if (date) {
                        setMoveIn(date?.toISOString())
                        setShowMoveIn(false)
                        setReferral({
                            ...referral!,
                            moveIn: date.toISOString()
                        })
                    }
                }}
                show={showMoveIn}
                setShow={() => setShowMoveIn(false)}
            />

            <DataPickerModal
                title="Status"
                onPress={(status: STATUS) => {
                    setReferral({
                        ...referral,
                        status: status,
                        order_date:
                            status.id === 'closed'
                                ? new Date().toISOString()
                                : null
                    })
                    setShowStatus(false)
                }}
                onCancel={() => setShowStatus(false)}
                visisble={showStatus}
                data={statuses}
            />

            <DataPickerModal
                title="Referees / LA"
                onPress={(referee) => {
                    setReferral({
                        ...referral,
                        referee: referee
                    })
                    setShowReferees(false)
                }}
                onCancel={() => setShowReferees(false)}
                visisble={showReferees}
                onAdd={() => {
                    setShowReferees(false)
                    router.back()
                    router.push('/(app)/(root)/(settings)/referee')
                }}
                data={helpers
                    .filter((h) => h.type === 'referee')
                    .sort((a, b) => (a.name > b.name ? 1 : -1))}
            />

            <DataPickerModal
                title="Manager or CE"
                onPress={(manager) => {
                    setReferral({
                        ...referral,
                        manager: manager
                    })
                    setShowManagers(false)
                }}
                onCancel={() => setShowManagers(false)}
                visisble={showManagers}
                data={helpers.filter((h) => h.type === 'ce')}
            />

            <DataPickerModal
                onCancel={() => setShowInternetPicker(false)}
                data={services[0].internet}
                visisble={showInternetPicker}
                title="Internet"
                onPress={(int_serv: SERVICE) => {
                    setShowInternetPicker(false)
                    setReferral({
                        ...referral,
                        package: {
                            ...referral.package!,
                            internet: int_serv as SERVICE
                        }
                    })
                }}
            />
            <DataPickerModal
                onCancel={() => setShowTvPicker(false)}
                data={services[1].tv}
                visisble={showTvPicker}
                title="TV"
                onPress={(tv_serv) => {
                    setShowTvPicker(false)
                    setReferral({
                        ...referral,
                        package: {
                            ...referral.package!,
                            tv: tv_serv as SERVICE
                        }
                    })
                }}
            />
            <DataPickerModal
                onCancel={() => setShowHomePicker(false)}
                data={services[2].phone}
                visisble={showHomePicker}
                title="Home Phone"
                onPress={(home_serv) => {
                    setShowHomePicker(false)
                    setReferral({
                        ...referral,
                        package: {
                            ...referral.package!,
                            home: home_serv as SERVICE
                        }
                    })
                }}
            />
            <DataPickerModal
                data={services[3].wireless}
                visisble={showWirelessPicker}
                title="Wireless"
                onCancel={() => setShowWirelessPicker(false)}
                onPress={(wireless_serv) => {
                    setShowWirelessPicker(false)
                    setReferral({
                        ...referral,
                        package: {
                            ...referral.package!,
                            wireless: wireless_serv as SERVICE
                        }
                    }),
                        dispatch(setHasWireless(false))
                }}
            />
            {/* <Modal
                presentationStyle="overFullScreen"
                visible={showCongratulations}
                animationType="slide"
            >
                <Congratulations setShow={setShowCongratulations} />
            </Modal> */}
        </Screen>
    )
}

export default ReferralsScreen

const styles = StyleSheet.create({
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
        borderRadius: SIZES.radius
    },
    remove: {
        position: 'absolute',
        right: -8,
        top: -8,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        borderRadius: 12
    },
    choice: {
        padding: SIZES.base,
        minWidth: '45%',
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

function SectionThree(
    setShowStatus: React.Dispatch<React.SetStateAction<boolean>>,
    placeholderColor: string,
    referral: Referral,
    monRef: React.RefObject<Input>,
    setReferral: React.Dispatch<React.SetStateAction<Referral>>,
    setShowInternetPicker: React.Dispatch<React.SetStateAction<boolean>>,
    secondaryColor: string,
    setShowTvPicker: React.Dispatch<React.SetStateAction<boolean>>,
    setShowHomePicker: React.Dispatch<React.SetStateAction<boolean>>,
    setShowWirelessPicker: React.Dispatch<React.SetStateAction<boolean>>,
    validateServicesOrdered: () => boolean,
    setShowOrderDate: React.Dispatch<React.SetStateAction<boolean>>,
    setShowOrderDueDate: React.Dispatch<React.SetStateAction<boolean>>,
    orderType: ORDER_TYPE,
    isVZW: boolean,
    setIsVZW: React.Dispatch<React.SetStateAction<boolean>>,
    dispatch: Dispatch,
    referralLines: number
): React.ReactNode {
    return (
        <View>
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Referral's Status
                </Text>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setShowStatus(true)}
                >
                    <Row
                        style={{
                            width: '100%',
                            ...Styles.boxShadow,
                            backgroundColor: placeholderColor,
                            padding: SIZES.base * 1.5,
                            borderRadius: SIZES.radius * 2
                        }}
                    >
                        <FontAwesome
                            name="clock-o"
                            color={'white'}
                            size={24}
                            style={{
                                marginHorizontal: SIZES.base
                            }}
                        />
                        <View
                            style={{
                                borderRadius: SIZES.radius,
                                overflow: 'hidden',
                                marginLeft: SIZES.padding
                            }}
                        >
                            <Text fontFamily="SFBold" color="white">
                                {referral.status.name}
                            </Text>
                        </View>
                    </Row>
                </TouchableOpacity>
            </View>
            <AnimatePresence>
                {referral.status.id === 'closed' && (
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -20 }}
                        transition={{ duration: 300 }}
                    >
                        <Text
                            fontFamily="SFBold"
                            style={{
                                margin: SIZES.base
                            }}
                        >
                            Order Number / MON
                        </Text>
                        <TextInput
                            keyboardType={
                                referral.mon && referral.mon.length >= 2
                                    ? 'number-pad'
                                    : 'default'
                            }
                            placeholder="MON or Order Number"
                            maxLength={13}
                            ref={monRef}
                            autoCorrect={false}
                            value={referral.mon!}
                            onChangeText={(text) =>
                                setReferral({
                                    ...referral,
                                    mon: text.toUpperCase()
                                })
                            }
                        />
                    </MotiView>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {referral.mon !== null &&
                    referral.mon.length === 13 &&
                    referral.status.id === 'closed' && (
                        <MotiView
                            style={{
                                marginBottom: 8,
                                gap: SIZES.padding
                            }}
                            from={{
                                opacity: 0,
                                translateY: -SIZES.padding
                            }}
                            animate={{
                                opacity: 1,
                                translateY: SIZES.padding,
                                scale: 1
                            }}
                            transition={{
                                type: 'timing',
                                repeat: 0,
                                duration: 300
                            }}
                            exit={{ opacity: 0 }}
                        >
                            <Text center fontFamily="SFBold">
                                Select a Package
                            </Text>
                            <Row
                                style={{
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                    paddingHorizontal: 10,
                                    gap: SIZES.padding
                                }}
                            >
                                <View>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setShowInternetPicker(true)
                                        }
                                        style={[
                                            styles.choice,
                                            {
                                                backgroundColor:
                                                    referral.package
                                                        ?.internet !== null
                                                        ? placeholderColor
                                                        : secondaryColor
                                            }
                                        ]}
                                    >
                                        <Text
                                            color="white"
                                            fontFamily={
                                                referral.package?.internet !==
                                                null
                                                    ? 'SFBold'
                                                    : 'SFRegular'
                                            }
                                        >
                                            {referral.package?.internet
                                                ? referral.package.internet.name
                                                : 'Internet'}
                                        </Text>
                                    </TouchableOpacity>
                                    {referral.package?.internet !== null && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setReferral({
                                                    ...referral,
                                                    package: {
                                                        ...referral.package!,
                                                        internet: null
                                                    }
                                                })
                                            }
                                            style={[
                                                styles.remove,
                                                {
                                                    backgroundColor:
                                                        placeholderColor
                                                }
                                            ]}
                                        >
                                            <FontAwesome
                                                name="close"
                                                size={18}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => setShowTvPicker(true)}
                                        style={[
                                            styles.choice,
                                            {
                                                backgroundColor:
                                                    referral.package?.tv !==
                                                    null
                                                        ? placeholderColor
                                                        : secondaryColor
                                            }
                                        ]}
                                    >
                                        <Text
                                            color="white"
                                            fontFamily={
                                                referral.package?.tv !== null
                                                    ? 'SFBold'
                                                    : 'SFRegular'
                                            }
                                        >
                                            {referral.package?.tv
                                                ? referral.package.tv.name
                                                : 'TV'}
                                        </Text>
                                    </TouchableOpacity>
                                    {referral.package?.tv !== null && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setReferral({
                                                    ...referral,
                                                    package: {
                                                        ...referral.package!,
                                                        tv: null
                                                    }
                                                })
                                            }
                                            style={[
                                                styles.remove,
                                                {
                                                    backgroundColor:
                                                        placeholderColor
                                                }
                                            ]}
                                        >
                                            <FontAwesome
                                                name="close"
                                                size={18}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </Row>
                            <Row
                                style={{
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                    paddingHorizontal: 10,
                                    gap: SIZES.padding
                                }}
                            >
                                <View>
                                    <TouchableOpacity
                                        onPress={() => setShowHomePicker(true)}
                                        style={[
                                            styles.choice,
                                            {
                                                backgroundColor:
                                                    referral.package?.home !==
                                                    null
                                                        ? placeholderColor
                                                        : secondaryColor
                                            }
                                        ]}
                                    >
                                        <Text
                                            color="white"
                                            fontFamily={
                                                referral.package?.home !== null
                                                    ? 'SFBold'
                                                    : 'SFRegular'
                                            }
                                        >
                                            {referral.package?.home
                                                ? referral.package.home.name
                                                : 'Home Phone'}
                                        </Text>
                                    </TouchableOpacity>
                                    {referral.package?.home !== null && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setReferral({
                                                    ...referral,
                                                    package: {
                                                        ...referral.package!,
                                                        home: null
                                                    }
                                                })
                                            }
                                            style={[
                                                styles.remove,
                                                {
                                                    backgroundColor:
                                                        placeholderColor
                                                }
                                            ]}
                                        >
                                            <FontAwesome
                                                name="close"
                                                size={18}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            dispatch(setHasWireless(true))
                                            setShowWirelessPicker(true)
                                        }}
                                        style={[
                                            styles.choice,
                                            {
                                                backgroundColor:
                                                    referral.package
                                                        ?.wireless !== null
                                                        ? placeholderColor
                                                        : secondaryColor
                                            }
                                        ]}
                                    >
                                        <Text
                                            color="white"
                                            fontFamily={
                                                referral.package?.wireless !==
                                                null
                                                    ? 'SFBold'
                                                    : 'SFRegular'
                                            }
                                        >
                                            {referral.package?.wireless
                                                ? referralLines +
                                                  ' ' +
                                                  referral.package.wireless.name
                                                : 'Wireless'}
                                        </Text>
                                    </TouchableOpacity>
                                    {referral.package?.wireless !== null && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setReferral({
                                                    ...referral,
                                                    package: {
                                                        ...referral.package!,
                                                        wireless: null
                                                    }
                                                })
                                            }
                                            style={[
                                                styles.remove,
                                                {
                                                    backgroundColor:
                                                        placeholderColor
                                                }
                                            ]}
                                        >
                                            <FontAwesome
                                                name="close"
                                                size={18}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </Row>
                        </MotiView>
                    )}
            </AnimatePresence>
            <AnimatePresence>
                {validateServicesOrdered() && (
                    <MotiView
                        style={{ marginTop: SIZES.base }}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -20 }}
                        transition={{ type: 'timing', duration: 300 }}
                    >
                        <View>
                            <Text
                                fontFamily="SFBold"
                                style={{
                                    margin: SIZES.base * 1.5
                                }}
                            >
                                Order Date
                            </Text>
                            <Row
                                style={{
                                    width: '100%',
                                    ...Styles.boxShadow,
                                    backgroundColor: placeholderColor,
                                    padding: SIZES.base * 1.5,
                                    borderRadius: SIZES.radius * 2
                                }}
                            >
                                <FontAwesome
                                    name="calendar"
                                    color={'white'}
                                    size={24}
                                    style={{
                                        marginHorizontal: SIZES.base
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowOrderDate(true)}
                                >
                                    <Text color="white" fontFamily="SFBold">
                                        {referral.order_date
                                            ? moment(
                                                  referral.order_date
                                              ).format('dddd Do, MMM YYYY')
                                            : 'Pick a Order Date'}
                                    </Text>
                                </TouchableOpacity>
                            </Row>
                        </View>
                    </MotiView>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {referral.order_date &&
                    referral.status.id === 'closed' &&
                    referral.mon &&
                    validateServicesOrdered() && (
                        <MotiView
                            style={{ marginTop: SIZES.base }}
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            exit={{ opacity: 0, translateY: -20 }}
                            transition={{ type: 'timing', duration: 300 }}
                        >
                            <View>
                                <Text
                                    fontFamily="SFBold"
                                    style={{
                                        margin: SIZES.base * 1.5
                                    }}
                                >
                                    Due Date
                                </Text>
                                <Row
                                    style={{
                                        width: '100%',
                                        ...Styles.boxShadow,
                                        backgroundColor: placeholderColor,
                                        padding: SIZES.base * 1.5,
                                        borderRadius: SIZES.radius * 2
                                    }}
                                >
                                    <FontAwesome
                                        name="calendar"
                                        color={'white'}
                                        size={24}
                                        style={{
                                            marginHorizontal: SIZES.base
                                        }}
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            setShowOrderDueDate(true)
                                        }
                                    >
                                        <Text color="white" fontFamily="SFBold">
                                            {referral.due_date
                                                ? moment(
                                                      referral.due_date
                                                  ).format('dddd Do, MMM YYYY')
                                                : 'Pick a Due Date'}
                                        </Text>
                                    </TouchableOpacity>
                                </Row>
                            </View>
                        </MotiView>
                    )}
            </AnimatePresence>
            <AnimatePresence>
                {referral.status.id === 'closed' && referral.due_date && (
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 600 }}
                    >
                        <View
                            style={[
                                Styles.boxShadow,
                                {
                                    ...styles.row,
                                    backgroundColor: placeholderColor,
                                    marginTop: SIZES.base * 1.5
                                }
                            ]}
                        >
                            <Text fontFamily="SFBold" color="white">
                                Is a Verizon Wireless Customer?
                            </Text>
                            <Row
                                style={{
                                    justifyContent: 'space-around',
                                    width: '80%',
                                    marginTop: SIZES.base
                                }}
                            >
                                <ButtonRadio
                                    selected={isVZW}
                                    title="Yes"
                                    onPress={() => {
                                        //setIsVZW(true)
                                        setIsVZW(true)
                                        setReferral({
                                            ...referral!,
                                            isVerizonWirelessCustomer: true
                                        })
                                    }}
                                />
                                <ButtonRadio
                                    selected={!isVZW}
                                    title="No"
                                    onPress={() => {
                                        // setIsVZW(false)
                                        setIsVZW(false)
                                        setReferral({
                                            ...referral!,
                                            isVerizonWirelessCustomer: true
                                        })
                                    }}
                                />
                            </Row>
                        </View>
                    </MotiView>
                )}
            </AnimatePresence>

            {orderType === 'acp' && (
                <View style={{ marginVertical: SIZES.base * 1.5 }}>
                    <Text
                        fontFamily="SFBold"
                        style={{
                            margin: SIZES.base
                        }}
                    >
                        ACP Application ID
                    </Text>
                    <TextInput
                        placeholder="B98765-43210"
                        value={referral.applicationId!}
                        maxLength={12}
                        onChangeText={(text) =>
                            setReferral({
                                ...referral,
                                applicationId: text.toUpperCase()
                            })
                        }
                    />
                </View>
            )}
            <View style={{ marginVertical: SIZES.base * 1.5 }}>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Comment or Note
                </Text>
                <TextInput
                    placeholder="Comment or Note"
                    isMultiline
                    value={referral.comment!}
                    onChangeText={(text) =>
                        setReferral({
                            ...referral,
                            comment: text
                        })
                    }
                />
            </View>
        </View>
    )
}

const SectionOne = (
    googleRef: React.RefObject<GooglePlacesAutocompleteRef>,
    bgColor: string,
    placeholderColor: string,
    textColor: string,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    address: string,
    referral: Referral,
    setReferral: React.Dispatch<React.SetStateAction<Referral>>,
    setShowMoveIn: React.Dispatch<React.SetStateAction<boolean>>,
    editing: boolean,
    setShowReferees: React.Dispatch<React.SetStateAction<boolean>>,
    isReferral: boolean,
    moveIn: string | null
): React.ReactNode => {
    return (
        <View
            style={{
                flex: 1,
                // marginTop: SIZES.padding,
                padding: SIZES.base,
                gap: SIZES.padding
            }}
        >
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Customer's Address
                </Text>
                <FlatList
                    data={[]}
                    horizontal
                    renderItem={() => <></>}
                    contentContainerStyle={{ width: '100%' }}
                    ListHeaderComponentStyle={{ width: '100%' }}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        <GooglePlacesAutocomplete
                            ref={googleRef}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            keyboardShouldPersistTaps="handled"
                            placeholder="Type Customer's Address"
                            fetchDetails={true}
                            minLength={2}
                            styles={{
                                container: {
                                    flex: 0,
                                    paddingHorizontal: 4,
                                    width: '100%'
                                },
                                textInput: {
                                    borderRadius: SIZES.radius * 2,
                                    backgroundColor: bgColor,
                                    borderWidth: 0.5,
                                    paddingVertical: SIZES.base * 1.5,
                                    borderColor: placeholderColor,
                                    color: textColor
                                },
                                textInputContainer: {
                                    backgroundColor: bgColor
                                },
                                row: {
                                    backgroundColor: bgColor
                                },
                                description: {
                                    color: textColor
                                }
                            }}
                            textInputProps={{
                                placeholderTextColor: placeholderColor
                            }}
                            query={{
                                key: GOOGLE_KEY,
                                language: 'en', // language of the results
                                components: 'country:us'
                            }}
                            enablePoweredByContainer={false}
                            debounce={500}
                            onPress={(data, details) => {
                                if (details?.formatted_address) {
                                    setAddress(details?.formatted_address)
                                    setReferral({
                                        ...referral,
                                        address: details?.formatted_address!
                                    })
                                }
                            }}
                        />
                    }
                />
                {editing && (
                    <Text color="grey" style={{ marginLeft: SIZES.padding }}>
                        {address}
                    </Text>
                )}
            </View>
            <AnimatePresence>
                {address.length > 0 && (
                    <MotiView
                        style={{ gap: SIZES.padding }}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -20 }}
                    >
                        <View>
                            <Text
                                fontFamily="SFBold"
                                style={{
                                    margin: SIZES.base
                                }}
                            >
                                Apt, Suite, Flr
                            </Text>
                            <TextInput
                                placeholder="Apt, Suite, FLR"
                                value={referral.apt!}
                                onChangeText={(text) =>
                                    setReferral({
                                        ...referral,
                                        apt: text.toUpperCase()
                                    })
                                }
                            />
                        </View>
                        <View>
                            <Text
                                fontFamily="SFBold"
                                style={{
                                    margin: SIZES.base
                                }}
                            >
                                Property's Name
                            </Text>
                            <TextInput
                                placeholder="Ex, The Avalon"
                                value={referral.propertyName}
                                autoCapitalize="words"
                                onChangeText={(text) =>
                                    setReferral({
                                        ...referral!,
                                        propertyName: text
                                    })
                                }
                            />
                        </View>
                        <View>
                            <Text
                                fontFamily="SFBold"
                                style={{
                                    margin: SIZES.base
                                }}
                            >
                                Moving Date
                            </Text>
                            <Row
                                style={{
                                    width: '100%',
                                    ...Styles.boxShadow,
                                    backgroundColor: placeholderColor,
                                    padding: SIZES.base * 1.5,
                                    borderRadius: SIZES.radius * 2
                                }}
                            >
                                <FontAwesome
                                    name="calendar"
                                    color={'white'}
                                    size={24}
                                    style={{
                                        marginHorizontal: SIZES.base
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowMoveIn(true)}
                                >
                                    <Text color="white" fontFamily="SFBold">
                                        {moveIn
                                            ? moment(moveIn).format(
                                                  'dddd Do, MMM YYYY'
                                              )
                                            : 'Pick a Moving Date'}
                                    </Text>
                                </TouchableOpacity>
                            </Row>
                        </View>
                        {isReferral && (
                            <View>
                                <View>
                                    <Text
                                        fontFamily="SFBold"
                                        style={{
                                            margin: SIZES.base
                                        }}
                                    >
                                        Referred By
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setShowReferees(true)}
                                    >
                                        <Row
                                            style={{
                                                width: '100%',
                                                ...Styles.boxShadow,
                                                backgroundColor:
                                                    placeholderColor,
                                                padding: SIZES.base * 1.5,
                                                borderRadius: SIZES.radius * 2
                                            }}
                                        >
                                            <FontAwesome
                                                name="user-o"
                                                color={'white'}
                                                size={24}
                                                style={{
                                                    marginHorizontal: SIZES.base
                                                }}
                                            />
                                            <View
                                                style={{
                                                    borderRadius: SIZES.radius,
                                                    overflow: 'hidden',
                                                    marginLeft: SIZES.padding
                                                }}
                                            >
                                                <Text
                                                    fontFamily="SFBold"
                                                    color="white"
                                                >
                                                    {referral.referee
                                                        ? referral.referee.name
                                                        : 'Pick a Referred By'}
                                                </Text>
                                            </View>
                                        </Row>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </MotiView>
                )}
            </AnimatePresence>
        </View>
    )
}

function SectionTwo(
    referral: Referral,
    setReferral: React.Dispatch<React.SetStateAction<Referral>>,
    setShowManagers: React.Dispatch<React.SetStateAction<boolean>>,
    placeholderColor: string
): React.ReactNode {
    return (
        <View style={Styles.flex}>
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Full Name
                </Text>
                <TextInput
                    placeholder="Full Name"
                    value={referral.name}
                    onChangeText={(text) =>
                        setReferral({ ...referral, name: text })
                    }
                    autoCapitalize="words"
                />
            </View>
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Cell Phone
                </Text>
                <TextInput
                    placeholder="Cell Phone"
                    value={referral.phone}
                    keyboardType="number-pad"
                    onChangeText={(text) =>
                        setReferral({
                            ...referral,
                            phone: formatPhone(text)
                        })
                    }
                />
            </View>
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Email Address
                </Text>
                <TextInput
                    placeholder="Email address"
                    value={referral.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) =>
                        setReferral({
                            ...referral,
                            email: text.toLowerCase()
                        })
                    }
                />
            </View>
            <View>
                <View>
                    <Text
                        fontFamily="SFBold"
                        style={{
                            margin: SIZES.base
                        }}
                    >
                        Account Manager / CE
                    </Text>
                    <Row
                        style={{
                            width: '100%',
                            ...Styles.boxShadow,
                            backgroundColor: placeholderColor,
                            padding: SIZES.base * 1.5,
                            borderRadius: SIZES.radius * 2
                        }}
                    >
                        <FontAwesome
                            name="user-o"
                            color={'white'}
                            size={24}
                            style={{
                                marginHorizontal: SIZES.base
                            }}
                        />
                        <View
                            style={{
                                borderRadius: SIZES.radius,
                                overflow: 'hidden',
                                marginLeft: SIZES.padding
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setShowManagers(true)
                                }}
                            >
                                <Text fontFamily="SFBold" color="white">
                                    {referral.manager
                                        ? referral.manager.name
                                        : ' Pick a Manager or CE'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Row>
                </View>
            </View>
        </View>
    )
}

function mainInfo(
    bgColor: string,
    isReferral: boolean,
    setIsReferral: React.Dispatch<React.SetStateAction<boolean>>,
    orderType: string,
    setOrderType: React.Dispatch<React.SetStateAction<ORDER_TYPE>>
) {
    return (
        <View style={{ flex: 1, gap: SIZES.padding * 1.5 }}>
            <View
                style={[
                    Styles.boxShadow,
                    { ...styles.row, backgroundColor: bgColor }
                ]}
            >
                <Text fontFamily="SFBold">Is This a Referral?</Text>
                <Row
                    style={{
                        justifyContent: 'space-around',
                        width: '80%',
                        marginTop: SIZES.base
                    }}
                >
                    <ButtonRadio
                        selected={isReferral}
                        title="Yes"
                        onPress={() => {
                            setIsReferral(true)
                        }}
                    />
                    <ButtonRadio
                        selected={!isReferral}
                        title="No"
                        onPress={() => {
                            setIsReferral(false)
                        }}
                    />
                </Row>
            </View>
            <View
                style={[
                    Styles.boxShadow,
                    { ...styles.row, backgroundColor: bgColor }
                ]}
            >
                <Text fontFamily="SFBold">Order Type</Text>
                <Row
                    style={{
                        justifyContent: 'space-around',
                        width: '80%',
                        marginTop: SIZES.base
                    }}
                >
                    <ButtonRadio
                        selected={orderType === 'new'}
                        title="New"
                        onPress={() => {
                            setOrderType('new')
                        }}
                    />
                    <ButtonRadio
                        selected={orderType === 'move'}
                        title="Move"
                        onPress={() => {
                            setOrderType('move')
                        }}
                    />
                    <ButtonRadio
                        selected={orderType === 'acp'}
                        title="ACP"
                        onPress={() => {
                            setOrderType('acp')
                        }}
                    />
                </Row>
            </View>

            <Text fontSize={20} fontFamily="QSLight">{`This customer is ${
                isReferral ? 'a Referral' : 'not a Referral'
            } and is ${
                orderType === 'new'
                    ? 'new customer'
                    : orderType === 'move'
                    ? 'a moving customer'
                    : 'ACP customer'
            } `}</Text>
        </View>
    )
}
