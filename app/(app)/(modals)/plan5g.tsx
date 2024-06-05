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
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Switcher from '@/common/components/Switcher'
import useThemeColor from '@/common/hooks/useThemeColor'
import { router } from 'expo-router'
import useAppSelector from '@/common/hooks/useAppSelector'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { setFromQuote } from '@/features/wireless/wirelessSlide'

const PRICE = {
    plus: 80,
    home: 60
}

const Plan5G = () => {
    const [isAutoPay, setIsAutoPay] = useState(true)
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const dispatch = useAppDispatch()
    const iconColor = useThemeColor('text')
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
        <Screen>
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
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <FontAwesome name="list" size={24} />
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
                            backgroundColor: '#ffffff',
                            borderRadius: SIZES.radius,
                            gap: SIZES.padding
                        }}
                    >
                        <Row style={{ justifyContent: 'space-between' }}>
                            <Text fontFamily="SFBold" fontSize={20}>
                                5G Home Plus
                            </Text>
                            <Text fontFamily="SFBold" fontSize={20}>
                                $ $
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
                        <Text color="button" style={{ textAlign: 'right' }}>
                            {isAutoPay ? 'with auto pay' : 'without auto pay'}
                        </Text>
                        <View
                            style={{
                                padding: SIZES.padding,
                                borderRadius: SIZES.radius,
                                backgroundColor: '#e5e5e5',
                                gap: SIZES.base,
                                width: '100%'
                            }}
                        >
                            <Row style={{ gap: SIZES.base }}>
                                <AntDesign
                                    name="download"
                                    size={24}
                                    color="black"
                                />
                                <Text fontSize={14}>
                                    Up to 300 Mbps download
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <MaterialIcons
                                    name="4k"
                                    size={24}
                                    color="black"
                                />
                                <Text fontSize={14}>
                                    Ultra HD 4K video streaming
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <FontAwesome
                                    name="wifi"
                                    size={24}
                                    color="black"
                                />
                                <Text fontSize={14}>
                                    Router and Whole-Home Wi-fi included
                                </Text>
                            </Row>

                            <Row style={{ gap: SIZES.base }}>
                                <AntDesign
                                    name="lock1"
                                    size={24}
                                    color="black"
                                />
                                <Text fontSize={14}>
                                    3 Year Price Guarantee
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <Entypo name="icloud" size={24} color="black" />
                                <Text fontSize={14}>
                                    Verizon Cloud Unlimited
                                </Text>
                            </Row>
                        </View>
                    </View>
                    <View
                        style={{
                            padding: SIZES.padding,
                            backgroundColor: '#ffffff',
                            borderRadius: SIZES.radius,
                            gap: SIZES.padding
                        }}
                    >
                        <Row style={{ justifyContent: 'space-between' }}>
                            <Text fontFamily="SFBold" fontSize={20}>
                                5G Home
                            </Text>
                            <Text fontFamily="SFBold" fontSize={20}>
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
                        <Text color="button" style={{ textAlign: 'right' }}>
                            {isAutoPay ? 'with auto pay' : 'without auto pay'}
                        </Text>
                        <View
                            style={{
                                padding: SIZES.padding,
                                borderRadius: SIZES.radius,
                                backgroundColor: '#e5e5e5',
                                gap: SIZES.base,
                                width: '100%'
                            }}
                        >
                            <Row style={{ gap: SIZES.base }}>
                                <AntDesign
                                    name="download"
                                    size={24}
                                    color="black"
                                />
                                <Text fontSize={14}>
                                    Up to 100 Mbps download
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <MaterialIcons
                                    name="hd"
                                    size={24}
                                    color="black"
                                />
                                <Text fontSize={14}>
                                    1080p HD video streaming
                                </Text>
                            </Row>
                            <Row style={{ gap: SIZES.base }}>
                                <FontAwesome
                                    name="wifi"
                                    size={24}
                                    color="black"
                                />
                                <Text fontSize={14}>
                                    Wireless router included
                                </Text>
                            </Row>

                            <Row style={{ gap: SIZES.base }}>
                                <AntDesign
                                    name="lock1"
                                    size={24}
                                    color="black"
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
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            source={require('@/assets/images/5g.png')}
                            resizeMode="contain"
                        />
                    </View>
                </ScrollView>
                <View
                    style={{
                        flex: 0.1,
                        padding: SIZES.padding,
                        alignItems: 'center',
                        borderTopRightRadius: SIZES.radius * 2,

                        borderTopLeftRadius: SIZES.radius * 2,
                        width: '100%',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <Switcher
                        containerStyle={{
                            borderBottomWidth: 0
                        }}
                        value={fromQuote}
                        title={
                            <Text fontFamily="QSBold">
                                Get Pricing from My Plan
                            </Text>
                        }
                        onValueChange={() => {
                            dispatch(setFromQuote(!fromQuote))
                        }}
                    />
                    <Text fontFamily="SFLight" fontSize={12}>
                        Toggle this on if you want to get the discount based on
                        the plan you are working on for wireless
                    </Text>
                </View>
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
                    <View style={{ flex: 1, padding: SIZES.padding }}>
                        <Switcher
                            value={isAutoPay}
                            title={<Text fontFamily="QSBold">Auto Pay</Text>}
                            onValueChange={() => {
                                setIsAutoPay((prev) => !prev)
                            }}
                        />
                        <Switcher
                            value={isMobile}
                            title={
                                <Text fontFamily="QSBold">
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
                                    containerStyle={{
                                        borderTopWidth:
                                            StyleSheet.hairlineWidth,
                                        borderTopColor: 'grey',
                                        width: '100%'
                                    }}
                                    value={isPremium}
                                    title={
                                        <Text fontFamily="QSBold">
                                            Premium Plan
                                        </Text>
                                    }
                                    onValueChange={() => {
                                        setIsPremium((prev) => !prev)
                                    }}
                                />
                                <Text fontFamily="SFLight" fontSize={14}>
                                    Note: If the plan includes 5G Ultra
                                    Wideband, is Premium
                                </Text>
                            </View>
                        )}
                    </View>
                </Screen>
            </Modal>
        </Screen>
    )
}

export default Plan5G
