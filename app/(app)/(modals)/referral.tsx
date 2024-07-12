import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import React, { useEffect, useRef } from 'react'
import { Alert, TextInput as Input } from 'react-native'

import Row from '@/common/components/Row'
import View from '@/common/components/View'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
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
import { TouchableOpacity } from 'react-native'
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete'
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
import { isEmailValid } from '@/utils/isEmailValid'

import CustomerInfoThirdScreen from '@/common/components/referrals/CustomerInfoThirdScreen'
import MainInfoFirstScreen from '@/common/components/referrals/MainInfoFirstScreen'
import NotesModal from '@/common/components/referrals/NotesModal'
import ReferralHeader from '@/common/components/referrals/ReferralHeader'
import ReferralInfoLastScreen from '@/common/components/referrals/ReferralInfoLastScreen'
import ReferralInfoSecondScreen from '@/common/components/referrals/ReferralInfoSecondScreen'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'

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
    const [showComment, setShowComment] = React.useState(false)
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
    const [processing, setProcessing] = React.useState(false)

    const [orderType, setOrderType] = React.useState<ORDER_TYPE>('new')
    const [isVZW, setIsVZW] = React.useState<boolean>(false)
    const bgColor = useThemeColor('background')
    const textColor = useThemeColor('text')

    const [referral, setReferral] = React.useState<Referral>({
        name: '',
        address: address,
        apt: '',
        moveIn: moveIn,
        addedBy: user?.id!,
        applicationId: null,
        isReferral,
        comment: [],
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
        referralLines: referralLines || 0,
        notificationIdentifier: null
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
            if (isReferral && !referral.referee) {
                Alert.alert('Please select a referee')
                setShowReferees(true)
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
            if (isReferral && !referral.manager) {
                Alert.alert('Please select a CE')
                setShowManagers(true)
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
                    setProcessing(true)
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
                setProcessing(false)
                dispatch(setReferrralLines(0))
            }
        }
    }

    useEffect(() => {
        if (editingReferral && editing) {
            setAddress(editingReferral.address)
            setReferral({
                ...editingReferral,
                comment:
                    editingReferral &&
                    typeof editingReferral.comment === 'string'
                        ? [
                              {
                                  message: editingReferral.comment,
                                  timestamp: new Date().toISOString()
                              }
                          ]
                        : editingReferral.comment
            })
            setMoveIn(editingReferral.moveIn)
            setIsVZW(editingReferral.isVerizonWirelessCustomer)
            setIndex(3)
            setIsReferral(editingReferral.isReferral)
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

    useStatusBarColor('dark')

    if (loading || processing) return <Loading />

    return (
        <>
            <Screen style={{ flex: 1 }}>
                <ReferralHeader index={index} />

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
                    {index === 0 && (
                        <MainInfoFirstScreen
                            bgColor={bgColor}
                            isReferral={isReferral}
                            orderType={orderType}
                            setOrderType={setOrderType}
                            setIsReferral={setIsReferral}
                        />
                    )}
                    {index === 1 && (
                        <ReferralInfoSecondScreen
                            address={address}
                            editing={editing}
                            googleRef={googleRef}
                            isReferral={isReferral}
                            moveIn={moveIn}
                            referral={referral}
                            setAddress={setAddress}
                            setReferral={setReferral}
                            setShowMoveIn={setShowMoveIn}
                            setShowReferees={setShowReferees}
                        />
                    )}
                    {index === 2 && (
                        <CustomerInfoThirdScreen
                            isReferral={isReferral}
                            referral={referral}
                            setReferral={setReferral}
                            setShowManagers={setShowManagers}
                        />
                    )}

                    {index === 3 && (
                        <ReferralInfoLastScreen
                            isVZW={isVZW}
                            monRef={monRef}
                            orderType={orderType}
                            referral={referral}
                            referralLines={referralLines}
                            setIsVZW={setIsVZW}
                            setReferral={setReferral}
                            setShowComment={setShowComment}
                            setShowHomePicker={setShowHomePicker}
                            setShowInternetPicker={setShowInternetPicker}
                            setShowOrderDate={setShowOrderDate}
                            setShowOrderDueDate={setShowOrderDueDate}
                            setShowWirelessPicker={setShowWirelessPicker}
                            setShowStatus={setShowStatus}
                            setShowTvPicker={setShowTvPicker}
                            validateServicesOrdered={validateServicesOrdered}
                        />
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
            </Screen>
            <NotesModal
                show={showComment}
                setShow={setShowComment}
                onDone={(newComment) => {
                    if (!newComment) return
                    setReferral({
                        ...referral!,
                        comment: [
                            {
                                message: newComment,
                                timestamp: new Date().toISOString()
                            },
                            ...referral.comment
                        ]
                    })
                    setShowComment(false)
                }}
            />
        </>
    )
}

export default ReferralsScreen
