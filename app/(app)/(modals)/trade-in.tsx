import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import LinesMenu from '@/common/components/myPlan/Menu'
import NeoView from '@/common/components/NeoView'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import SegmentedControl from '@/common/components/SegmentedControl'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { INDEXES, Phone, PHONES } from '@/constants'
import { SIZES } from '@/constants/Sizes'
import { setLinesData } from '@/features/wireless/wirelessSlide'
import { Line, TradeInDeviceType } from '@/types'
import { calculateTradeInValues } from '@/utils/calculateTradeIn'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { useEffect, useState } from 'react'
import {
    Button,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

type Props = {
    lineId: string
    lineIndex: string
}

const TradeIn = () => {
    const { lineId, lineIndex } = useLocalSearchParams<Props>()
    const dispatch = useAppDispatch()
    const bgColor = useThemeColor('accent')
    const [showPhones, setShowPhones] = useState(false)
    const [phone, setPhone] = useState<Phone | null>(null)
    const [selectedSegment, setSelectedSegment] =
        useState<TradeInDeviceType>('Iphone')
    const handleSegmentChange = (value: TradeInDeviceType) => {
        setSelectedSegment(value)
    }

    const lines = useAppSelector((s) => s.wireless.lines)
    const line = lines.find((line) => line.id === lineId)

    const handleRemoveTradeIn = () => {
        const newLines = lines.map((line) => {
            if (line.id === lineId) {
                return {
                    ...line,
                    tradeIn: false,
                    tradeInValues: null
                }
            }
            return line
        })

        dispatch(setLinesData(newLines))
        router.back()
    }

    const applyTradeIn = () => {
        if (!phone) return
        const newLines = lines.map((line) => {
            if (line.id === lineId) {
                return {
                    ...line,
                    tradeIn: true,
                    byod: false,
                    tradeInValues: calculateTradeInValues(
                        line.name,
                        selectedSegment,
                        phone
                    )
                }
            }
            return line
        })

        dispatch(setLinesData(newLines))
        router.back()
    }

    const discounts = calculateTradeInValues(
        line?.name!,
        selectedSegment,
        phone!
    )

    useEffect(() => {
        if (!line) return
        if (line?.tradeIn && line.tradeInValues) {
            if (line.tradeInValues.phoneRetailValue) {
                setPhone(line.tradeInValues.phone)
            }

            // setShowPricing(true)
        }
        if (line && line?.tradeInValues?.device) {
            handleSegmentChange(line.tradeInValues.device)
        }
    }, [line, selectedSegment])

    return (
        <Screen>
            <Header
                title="Trade In"
                onPressBack={router.back}
                hasRightIcon
                rightIcon={
                    <TouchableOpacity
                        onPress={handleRemoveTradeIn}
                        style={{ paddingRight: SIZES.padding }}
                    >
                        <FontAwesome name="trash-o" size={24} />
                    </TouchableOpacity>
                }
            />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.padding
                }}
            >
                <Row style={{ gap: SIZES.base, alignSelf: 'center' }}>
                    <Text fontFamily="QSBold" fontSize={20} center>
                        Trading for line #
                    </Text>
                    <NeoView
                        innerStyleContainer={{
                            borderRadius: SIZES.radius * 2,
                            padding: 6
                        }}
                        containerStyle={{
                            borderRadius: SIZES.radius * 2,
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: bgColor
                        }}
                    >
                        {line && (
                            <LinesMenu
                                line={line}
                                index={+lineIndex}
                                showFullName={true}
                                fontSize={15}
                            />
                        )}
                    </NeoView>
                </Row>

                <Divider small />
                <Text fontSize={18} fontFamily="QSBold" center>
                    Select the OS for the new phone
                </Text>
                <SegmentedControl
                    selectedIndex={INDEXES.indexOf(selectedSegment)}
                    values={INDEXES}
                    onChange={(values) => {
                        setPhone(null)
                        handleSegmentChange(values as TradeInDeviceType)
                    }}
                />
                <View>
                    <NeoView
                        containerStyle={{
                            borderRadius: SIZES.base,
                            alignSelf: 'center'
                        }}
                        innerStyleContainer={{
                            borderRadius: SIZES.base,
                            padding: SIZES.base,
                            paddingHorizontal: SIZES.padding * 3
                        }}
                    >
                        <TouchableOpacity onPress={() => setShowPhones(true)}>
                            <Text
                                center
                                capitalize
                                fontSize={18}
                                fontFamily="QSBold"
                            >
                                {phone
                                    ? 'Change Phone'
                                    : `Pick an ${selectedSegment}`}
                            </Text>
                        </TouchableOpacity>
                    </NeoView>
                </View>
                {phone && (
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Row style={{ gap: SIZES.base }}>
                            <Text fontSize={18} fontFamily="SFHeavy">
                                {phone.name}
                            </Text>
                            <Text fontSize={18} fontFamily="SFHeavy">
                                ${phone.value}
                            </Text>
                        </Row>
                    </View>
                )}

                {discounts !== null && phone && (
                    <>
                        <Divider small />
                        <View
                            style={{
                                justifyContent: 'center',
                                padding: SIZES.padding,
                                gap: SIZES.padding
                            }}
                        >
                            <View
                                style={{
                                    alignSelf: 'flex-start',
                                    gap: SIZES.base
                                }}
                            >
                                <Text
                                    fontSize={20}
                                    capitalize
                                    fontFamily="SFBold"
                                >
                                    Total Discount
                                </Text>
                                <Text>
                                    $
                                    {phone?.isFree
                                        ? phone.value
                                        : discounts.discount.toFixed(2)}
                                </Text>

                                {phone && (
                                    <View>
                                        <Text
                                            fontSize={20}
                                            capitalize
                                            fontFamily="SFBold"
                                        >
                                            Due Balance
                                        </Text>
                                        <Text>
                                            ${discounts.balance.toFixed(2)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {phone && (
                                <View
                                    style={{
                                        backgroundColor: bgColor,
                                        padding: SIZES.padding,
                                        borderRadius: SIZES.radius,
                                        gap: SIZES.base
                                    }}
                                >
                                    <Text
                                        capitalize
                                        center
                                        color="white"
                                        fontFamily="SFBold"
                                        fontSize={20}
                                    >
                                        Monthly Payment
                                    </Text>
                                    <Text color="white" center>
                                        ${discounts.balance.toFixed(2)} / 36
                                        months
                                    </Text>
                                    <Text
                                        color="white"
                                        fontFamily="QSBold"
                                        fontSize={24}
                                        center
                                    >
                                        ${discounts.monthlyPrice.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            <View>
                                <Button
                                    title={
                                        line?.tradeIn
                                            ? 'Update Trade-In'
                                            : 'Apply Trade In'
                                    }
                                    onPress={applyTradeIn}
                                />
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
            <Modal animationType="slide" visible={showPhones}>
                <Screen style={{ flex: 1 }}>
                    <Header
                        title="Pick One"
                        onPressBack={() => setShowPhones(false)}
                    />

                    <ScrollView
                        contentContainerStyle={{
                            gap: SIZES.base,
                            padding: SIZES.base,
                            marginBottom: SIZES.padding
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {PHONES[selectedSegment].map((p) => (
                            <NeoView
                                key={p.name}
                                containerStyle={{
                                    borderRadius: SIZES.base
                                }}
                                innerStyleContainer={{
                                    borderRadius: SIZES.base,
                                    padding: SIZES.base
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setPhone(p)
                                        setShowPhones(false)
                                    }}
                                    key={p.name}
                                    style={{ marginVertical: SIZES.base }}
                                >
                                    <Row
                                        style={{
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Row
                                            style={{
                                                justifyContent: 'space-between',
                                                flex: 0.8
                                            }}
                                        >
                                            <Text fontFamily="QSBold">
                                                {p.name}
                                            </Text>

                                            {p && p.isFree && (
                                                <Text
                                                    fontFamily="QSBold"
                                                    fontSize={16}
                                                >
                                                    FREE
                                                </Text>
                                            )}
                                        </Row>

                                        <Text fontFamily="QSBold">
                                            ${p.value}
                                        </Text>
                                    </Row>
                                </TouchableOpacity>
                            </NeoView>
                        ))}
                        <View>
                            <Text fontSize={16} fontFamily="SFLight" center>
                                This price is for the base storage model
                            </Text>
                        </View>
                    </ScrollView>
                </Screen>
            </Modal>
        </Screen>
    )
}

export default TradeIn
