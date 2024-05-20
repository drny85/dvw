import useAppDispatch from '@/common/hooks/useAppDispatch'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { setComment, setHasWireless } from '@/features/referrals/referralsSlide'
import { ORDER_TYPE, Referral } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'
import React from 'react'
import { TextInput as Input, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated'
import CommentsOrNotes from '../CommentsOrNotes'
import ButtonRadio from '../RadioButton'
import Row from '../Row'
import Text from '../Text'
import TextInput from '../TextInput'
import View from '../View'

type Props = {
    setShowStatus: React.Dispatch<React.SetStateAction<boolean>>
    referral: Referral
    monRef: React.RefObject<Input>
    setReferral: React.Dispatch<React.SetStateAction<Referral>>
    setShowInternetPicker: React.Dispatch<React.SetStateAction<boolean>>
    setShowTvPicker: React.Dispatch<React.SetStateAction<boolean>>
    setShowHomePicker: React.Dispatch<React.SetStateAction<boolean>>
    setShowWirelessPicker: React.Dispatch<React.SetStateAction<boolean>>
    validateServicesOrdered: () => boolean
    setShowOrderDate: React.Dispatch<React.SetStateAction<boolean>>
    setShowOrderDueDate: React.Dispatch<React.SetStateAction<boolean>>
    orderType: ORDER_TYPE
    isVZW: boolean
    setIsVZW: React.Dispatch<React.SetStateAction<boolean>>
    referralLines: number
    setShowComment: React.Dispatch<React.SetStateAction<boolean>>
}

const ReferralInfoLastScreen = ({
    setShowComment,
    orderType,
    monRef,
    isVZW,
    referralLines,
    referral,
    setIsVZW,
    setShowHomePicker,
    setReferral,
    setShowStatus,
    setShowOrderDueDate,
    validateServicesOrdered,
    setShowOrderDate,
    setShowInternetPicker,
    setShowWirelessPicker,
    setShowTvPicker
}: Props) => {
    const placeholderColor = useThemeColor('placeholder')
    const secondaryColor = useThemeColor('secondary')
    const dispatch = useAppDispatch()
    return (
        <Animated.View
            exiting={SlideOutLeft.duration(600)}
            entering={SlideInRight.duration(600)}
        >
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
                            autoComplete="off"
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

            <View style={{ marginTop: SIZES.padding * 1.5 }}>
                <CommentsOrNotes
                    comment={referral.comment || ''}
                    onOpen={() => {
                        dispatch(setComment(referral.comment))
                        setShowComment(true)
                    }}
                />
            </View>
        </Animated.View>
    )
}

export default ReferralInfoLastScreen

const styles = StyleSheet.create({
    choice: {
        padding: SIZES.base,
        minWidth: '45%',
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center'
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
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
        borderRadius: SIZES.radius
    }
})
