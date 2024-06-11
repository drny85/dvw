import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import Screen from '@/common/components/Screen'
import SegmentedControl from '@/common/components/SegmentedControl'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { INDEXES, VALUES } from '@/constants'
import { SIZES } from '@/constants/Sizes'
import { setLinesData } from '@/features/wireless/wirelessSlide'
import { TradeInDeviceType } from '@/types'
import { calculateTradeInValues } from '@/utils/calculateTradeIn'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
    Button,
    TextInput as Input,
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
    const inputRef = useRef<Input>(null)
    const dispatch = useAppDispatch()
    const bgColor = useThemeColor('accent')
    const [showInput, setShowInput] = useState(false)
    const innerColor = useThemeColor('background')
    const [phoneValue, setPhoneValue] = useState('')
    const [selectedSegment, setSelectedSegment] =
        useState<TradeInDeviceType>('Iphone')
    const handleSegmentChange = (value: TradeInDeviceType) => {
        setSelectedSegment(value)
    }

    const line = useAppSelector((s) =>
        s.wireless.lines.find((l) => l.id === lineId)
    )
    const lines = useAppSelector((s) => s.wireless.lines)

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
    const phoneDiscount = useMemo(() => {
        if (
            selectedSegment === 'Iphone' &&
            line?.name === 'Unlimited Welcome'
        ) {
            return 415
        } else if (
            selectedSegment === 'Iphone' &&
            line?.name !== 'Unlimited Welcome'
        ) {
            return 830
        } else if (
            selectedSegment === 'Android' &&
            line?.name === 'Unlimited Welcome'
        ) {
            return 400
        } else if (
            selectedSegment === 'Android' &&
            line?.name !== 'Unlimited Welcome'
        ) {
            return 800
        } else {
            return 0
        }
    }, [selectedSegment, line?.name])
    const phoneBalance = useMemo(() => {
        if (!phoneValue) return 0

        return Math.abs(phoneDiscount - +phoneValue)
    }, [phoneDiscount, phoneValue, line?.name])

    const applyTradeIn = () => {
        if (!phoneBalance) return
        const newLines = lines.map((line) => {
            if (line.id === lineId) {
                return {
                    ...line,
                    tradeIn: true,
                    byod: false,
                    tradeInValues: calculateTradeInValues(
                        line.name,
                        selectedSegment,
                        +phoneValue
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
        +phoneValue
    )

    useEffect(() => {
        if (!line) return
        if (line?.tradeIn && line.tradeInValues) {
            if (line.tradeInValues.phoneRetailValue) {
                setPhoneValue(line.tradeInValues.phoneRetailValue.toString())
            }

            // setShowPricing(true)
        }
        if (line && line?.tradeInValues?.device) {
            handleSegmentChange(line.tradeInValues.device)
        }
    }, [line])

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
                <Text fontFamily="QSBold" fontSize={20} center>
                    Trading for line #{+lineIndex + 1}, {line?.name}
                </Text>
                <Divider small />
                <Text fontSize={18} fontFamily="QSBold" center>
                    Select the OS for the new phone
                </Text>
                <SegmentedControl
                    selectedIndex={INDEXES.indexOf(selectedSegment)}
                    values={INDEXES}
                    onChange={(values) =>
                        handleSegmentChange(values as TradeInDeviceType)
                    }
                />
                <View>
                    <Text center capitalize fontSize={18} fontFamily="QSBold">
                        Pick the phone retail value
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: SIZES.base,
                            marginTop: SIZES.base,
                            flexWrap: 'wrap'
                        }}
                    >
                        {VALUES.map((value) => (
                            <View
                                key={value}
                                style={{
                                    padding: SIZES.base,
                                    backgroundColor:
                                        phoneValue === value
                                            ? bgColor
                                            : innerColor,
                                    borderRadius: SIZES.base,
                                    borderWidth: StyleSheet.hairlineWidth
                                }}
                            >
                                <Text
                                    key={value}
                                    fontFamily="SFBold"
                                    fontSize={18}
                                    color={
                                        phoneValue === value ? 'white' : 'text'
                                    }
                                    onPress={() => {
                                        if (value === 'Other') {
                                            setShowInput(true)
                                            setPhoneValue('')
                                            inputRef.current?.focus()
                                        } else {
                                            setPhoneValue(value)
                                            setShowInput(false)
                                        }
                                    }}
                                >
                                    {value}
                                </Text>
                            </View>
                        ))}
                    </View>
                    {showInput && (
                        <TextInput
                            ref={inputRef}
                            placeholder="$999.99"
                            value={phoneValue}
                            keyboardType="numeric"
                            onChangeText={setPhoneValue}
                            style={{
                                borderRadius: SIZES.radius,
                                borderColor: 'grey',
                                borderWidth: StyleSheet.hairlineWidth,
                                marginVertical: SIZES.base
                            }}
                        />
                    )}
                </View>
                {discounts !== null && (
                    <View
                        style={{
                            justifyContent: 'center',
                            padding: SIZES.padding,
                            gap: SIZES.padding
                        }}
                    >
                        <View
                            style={{ alignSelf: 'flex-start', gap: SIZES.base }}
                        >
                            <Text fontSize={20} capitalize fontFamily="SFBold">
                                Total Discount
                            </Text>
                            <Text>${phoneDiscount.toFixed(2)}</Text>

                            {phoneValue && (
                                <View>
                                    <Text
                                        fontSize={20}
                                        capitalize
                                        fontFamily="SFBold"
                                    >
                                        Due Balance
                                    </Text>
                                    <Text>${discounts.balance.toFixed(2)}</Text>
                                </View>
                            )}
                        </View>
                        {phoneValue && (
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
                                    ${discounts.balance.toFixed(2)} / 36 months
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
                                title="Apply Trade In"
                                onPress={applyTradeIn}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
        </Screen>
    )
}

export default TradeIn
