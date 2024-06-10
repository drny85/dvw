import React, { useEffect, useState } from 'react'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import Row from '@/common/components/Row'
import { SIZES } from '@/constants/Sizes'
import {
    AntDesign,
    Entypo,
    FontAwesome,
    MaterialIcons
} from '@expo/vector-icons'
import { Image, Modal, ScrollView, TouchableOpacity } from 'react-native'
import Switcher from '@/common/components/Switcher'
import useThemeColor from '@/common/hooks/useThemeColor'
import { router } from 'expo-router'
import useAppSelector from '@/common/hooks/useAppSelector'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { setFromQuote } from '@/features/wireless/wirelessSlide'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PRICE = {
    plus: 80,
    home: 60
}

const Plan5G = () => {
    const [isAutoPay, setIsAutoPay] = useState(true)
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const { top, bottom } = useSafeAreaInsets()
    const dispatch = useAppDispatch()
    const iconColor = useThemeColor('text')
    const backgroundColor = useThemeColor('secondary')
    const innerColor = useThemeColor('background')
    const { expressAutoPay, lines, fromQuote } = useAppSelector(
        (s) => s.wireless
    )
    const isPremiumPlan =
        lines.length > 0 && lines.some((l) => !l.name.includes('Welcome'))

    useEffect(() => {
        if (fromQuote) {
            if (expressAutoPay > 0) {
                setIsAutoPay(true)
            } else {
                setIsAutoPay(false)
            }
            if (lines.length > 0) {
                setIsMobile(true)
            } else {
                setIsMobile(false)
            }
            if (isPremiumPlan) {
                setIsPremium(true)
            } else {
                setIsPremium(false)
            }
        } else {
            setIsAutoPay(true)
            setIsMobile(false)
            setIsPremium(false)
        }
    }, [expressAutoPay, fromQuote, isPremiumPlan])

    return (
        <View
            style={{
                flex: 1,
                paddingTop: top,
                backgroundColor: innerColor
            }}
        >
            <Row
                style={{
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.padding
                }}
            >
                <TouchableOpacity style={{ padding: 4 }} onPress={router.back}>
                    <FontAwesome
                        name="chevron-left"
                        size={22}
                        color={iconColor}
                    />
                </TouchableOpacity>
                <Text center fontFamily="QSBold" fontSize={24}>
                    5G Plans
                </Text>
                <TouchableOpacity
                    onPress={() => setVisible(true)}
                    style={{ padding: SIZES.base }}
                >
                    <FontAwesome name="list" size={24} color={iconColor} />
                </TouchableOpacity>
            </Row>

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <ScrollView
                    style={{ flex: 0.9 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        padding: SIZES.padding,
                        gap: SIZES.padding
                    }}
                >
                    <View
                        style={{
                            padding: SIZES.padding,
                            backgroundColor,
                            borderRadius: SIZES.radius,
                            gap: SIZES.padding
                        }}
                    >
                        <Row style={{ justifyContent: 'space-between' }}>
                            <Text fontFamily="SFBold" fontSize={22}>
                                5G Home Plus
                            </Text>
                            <Text fontFamily="SFBold" fontSize={22}>
                                $
                                {PRICE.plus -
                                    (isAutoPay ? 10 : 0) -
                                    (isMobile && isPremium
                                        ? 25
                                        : isMobile && !isPremium
                                        ? 15
                                        : 0)}
                                /mo
                            </Text>
                        </Row>
                        <Text style={{ textAlign: 'right' }}>
                            {isAutoPay ? 'with auto pay' : 'without auto pay'}
                        </Text>
                        <View
                            style={{
                                padding: SIZES.padding,
                                borderRadius: SIZES.radius,
                                backgroundColor: innerColor,
                                gap: SIZES.base,
                                width: '100%'
                            }}
                        >
                            <Row style={{ gap: SIZES.base }}>
                                <AntDesign
                                    name="download"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    Up to 300 Mbps download
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <MaterialIcons
                                    name="4k"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    Ultra HD 4K video streaming
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <FontAwesome
                                    name="wifi"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    Router and Whole-Home Wi-fi included
                                </Text>
                            </Row>

                            <Row style={{ gap: SIZES.base }}>
                                <AntDesign
                                    name="lock1"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    3 Year Price Guarantee
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <Entypo
                                    name="icloud"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    Verizon Cloud Unlimited
                                </Text>
                            </Row>
                        </View>
                    </View>
                    <View
                        style={{
                            padding: SIZES.padding,
                            backgroundColor,
                            borderRadius: SIZES.radius,
                            gap: SIZES.padding
                        }}
                    >
                        <Row style={{ justifyContent: 'space-between' }}>
                            <Text fontFamily="SFBold" fontSize={22}>
                                5G Home
                            </Text>
                            <Text fontFamily="SFBold" fontSize={22}>
                                $
                                {PRICE.home -
                                    (isAutoPay ? 10 : 0) -
                                    (isMobile && isPremium
                                        ? 15
                                        : isMobile && !isPremium
                                        ? 5
                                        : 0)}
                                /mo
                            </Text>
                        </Row>
                        <Text style={{ textAlign: 'right' }}>
                            {isAutoPay ? 'with auto pay' : 'without auto pay'}
                        </Text>
                        <View
                            style={{
                                padding: SIZES.padding,
                                borderRadius: SIZES.radius,
                                backgroundColor: innerColor,
                                gap: SIZES.base,
                                width: '100%'
                            }}
                        >
                            <Row style={{ gap: SIZES.base }}>
                                <AntDesign
                                    name="download"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    Up to 100 Mbps download
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <MaterialIcons
                                    name="hd"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    1080p HD video streaming
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <FontAwesome
                                    name="wifi"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    Wireless router included
                                </Text>
                            </Row>

                            <Row style={{ gap: SIZES.base }}>
                                <AntDesign
                                    name="lock1"
                                    size={24}
                                    color={iconColor}
                                />
                                <Text fontSize={14}>
                                    2 Year Price Guarantee
                                </Text>
                            </Row>
                        </View>
                    </View>
                    <View
                        style={{
                            padding: SIZES.padding,
                            gap: SIZES.base,
                            alignItems: 'center',
                            borderRadius: SIZES.radius
                        }}
                    >
                        <Image
                            style={{ borderRadius: SIZES.radius }}
                            source={require('@/assets/images/5g.png')}
                            resizeMode="contain"
                        />
                    </View>
                </ScrollView>
                {lines.length > 0 && (
                    <View
                        style={{
                            flex: 0.1,
                            padding: SIZES.padding,
                            alignItems: 'center',
                            borderTopRightRadius: SIZES.radius * 2,
                            paddingBottom: bottom + 6,
                            borderTopLeftRadius: SIZES.radius * 2,
                            width: '100%',
                            backgroundColor
                        }}
                    >
                        <Switcher
                            containerStyle={{
                                borderBottomWidth: 0
                            }}
                            value={fromQuote}
                            title={
                                <Text fontFamily="QSBold" color={'text'}>
                                    Get Pricing from My Plan
                                </Text>
                            }
                            onValueChange={() => {
                                dispatch(setFromQuote(!fromQuote))
                            }}
                        />
                        <Text fontFamily="SFLight" fontSize={12}>
                            Toggle this on if you want to get the discount based
                            on the plan you are working on for wireless
                        </Text>
                    </View>
                )}
            </View>
            <Modal
                animationType="slide"
                style={{ flex: 1 }}
                visible={visible}
                presentationStyle="overFullScreen"
            >
                <Screen>
                    <Row
                        style={{
                            justifyContent: 'space-between',
                            paddingHorizontal: SIZES.padding
                        }}
                    >
                        <TouchableOpacity
                            style={{ padding: 4 }}
                            onPress={() => setVisible(false)}
                        >
                            <FontAwesome
                                name="chevron-left"
                                size={22}
                                color={iconColor}
                            />
                        </TouchableOpacity>
                        <Text center fontFamily="QSBold" fontSize={24}>
                            Discounts
                        </Text>
                        <Text />
                    </Row>
                    <View
                        style={{
                            flex: 1,
                            padding: SIZES.padding,
                            gap: SIZES.padding
                        }}
                    >
                        <Switcher
                            value={isAutoPay}
                            title={
                                <Text fontFamily="QSBold" fontSize={20}>
                                    Auto Pay
                                </Text>
                            }
                            onValueChange={() => {
                                setIsAutoPay((prev) => !prev)
                            }}
                        />
                        <Switcher
                            value={isMobile}
                            title={
                                <Text fontFamily="QSBold" fontSize={20}>
                                    Is Verizon Wireless Customer?
                                </Text>
                            }
                            onValueChange={() => {
                                setIsMobile((prev) => !prev)
                            }}
                        />
                        {isMobile && (
                            <View style={{ gap: 10 }}>
                                <Switcher
                                    value={isPremium}
                                    title={
                                        <Text fontFamily="QSBold" fontSize={20}>
                                            Premium Plan
                                        </Text>
                                    }
                                    onValueChange={() => {
                                        setIsPremium((prev) => !prev)
                                    }}
                                />
                                <Text fontFamily="SFLight" fontSize={16}>
                                    Note: If the plan includes 5G Ultra
                                    Wideband, is a Premium Plan
                                </Text>
                            </View>
                        )}
                    </View>
                </Screen>
            </Modal>
        </View>
    )
}

export default Plan5G
