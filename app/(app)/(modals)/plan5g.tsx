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
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Switcher from '@/common/components/Switcher'
import useThemeColor from '@/common/hooks/useThemeColor'
import { router } from 'expo-router'

const PRICE = {
    plus: 80,
    home: 60
}

const Plan5G = () => {
    const [isAutoPay, setIsAutoPay] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const iconColor = useThemeColor('text')

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
                <Text />
            </Row>

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <ScrollView
                    style={{ flex: 0.8 }}
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
                        flex: 0.2,
                        padding: SIZES.padding,
                        alignItems: 'center',
                        borderTopRightRadius: SIZES.radius * 2,

                        borderTopLeftRadius: SIZES.radius * 2,
                        width: '100%',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <Row>
                        <View style={{ width: '40%' }}>
                            <Switcher
                                containerStyle={{
                                    borderBottomWidth: 0
                                }}
                                value={isAutoPay}
                                title={
                                    <Text fontFamily="QSBold">Auto Pay</Text>
                                }
                                onValueChange={() => {
                                    setIsAutoPay((prev) => !prev)
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Switcher
                                containerStyle={{
                                    borderBottomWidth: 0,
                                    flex: 1
                                }}
                                value={isMobile}
                                title={
                                    <Text fontFamily="QSBold">
                                        Is VZW Customer?
                                    </Text>
                                }
                                onValueChange={() => {
                                    setIsMobile((prev) => !prev)
                                }}
                            />
                        </View>
                    </Row>

                    {isMobile && (
                        <>
                            <Switcher
                                containerStyle={{
                                    borderTopWidth: StyleSheet.hairlineWidth,
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
                            <Text fontFamily="SFLight" fontSize={12}>
                                Note: If the plan includes 5G Ultra Wideband, is
                                Premium
                            </Text>
                        </>
                    )}
                </View>
            </View>
        </Screen>
    )
}

export default Plan5G
