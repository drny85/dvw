import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import LineSetter from '@/common/components/myPlan/LineSetter'
import LinesContainer from '@/common/components/myPlan/LinesContainer'
import TotalContainer from '@/common/components/myPlan/TotalContainer'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { setReturnRoute, setShow5G } from '@/features/settings/settingsSlice'
import {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet,
    setLinesData,
    setShowInfo,
    toogleShake
} from '@/features/wireless/wirelessSlide'
import { calculatePrice } from '@/helpers'
import { Line } from '@/types'
import { AntDesign } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'

import React, { useEffect, useRef } from 'react'

import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

const MyPlan = () => {
    const iconColor = useThemeColor('text')
    const saleQuote = useAppSelector((s) => s.sales.saleQuote)
    const dispatch = useAppDispatch()
    const bottomShetRef = useRef<BottomSheet>(null)
    const lines = useAppSelector((s) => s.wireless.lines)
    const {
        expressAutoPay,
        expressHasFios,
        expressFirstResponder,
        expressInternet
    } = useAppSelector((state) => state.wireless)

    const deleteLine = (id: string) => {
        const newLines = lines.filter((line) => line.id !== id)
        dispatch(setLinesData(newLines))
    }

    const resetAllButAutoPay = () => {
        dispatch(setLinesData([]))
        dispatch(setExpressAutoPay(10))
        dispatch(setExpressFirstResponder(false))
        dispatch(setExpressHasFios(false))
        dispatch(setExpressInternet())
    }

    const onAddLine = () => {
        if (lines.length < 10) {
            const newLine: Line = {
                id: new Date().getTime().toString(),
                name: 'Unlimited Welcome',
                price: 75 - expressAutoPay,
                byod: false,
                perks: [],
                originalPrice: 75,
                tradeIn: false,
                tradeInValues: null
            }

            dispatch(setLinesData([...lines, newLine]))
        }
    }

    const onSwitchBYOD = (id: string) => {
        const newLines = lines.map((line) => {
            if (line.id === id) {
                return {
                    ...line,
                    price: calculatePrice(
                        { ...line, byod: !line.byod },
                        lines,
                        expressAutoPay,
                        expressInternet,
                        expressHasFios
                    ),
                    byod: !line.byod,
                    tradeIn: false,
                    tradeInValues: null
                }
            }
            return line
        })
        // @ts-ignore

        dispatch(setLinesData(newLines))
    }

    const onTradeInPress = (id: string, index: string) => {
        const line = lines.find((l) => l.id === id)
        if (line && line.byod) {
            onSwitchBYOD(id)
        }
        router.push({
            pathname: '/(app)/(modals)/trade-in',
            params: { lineId: id, lineIndex: index }
        })
    }

    useEffect(() => {
        const newLines = lines.map((line) => {
            return {
                ...line,
                price: calculatePrice(
                    line,
                    lines,
                    expressAutoPay,
                    expressInternet,
                    expressHasFios
                )
            }
        })

        dispatch(setLinesData(newLines))
    }, [
        lines.length,
        expressAutoPay,
        expressFirstResponder,
        expressInternet,
        expressHasFios
    ])

    useEffect(() => {
        if (saleQuote) {
            resetAllButAutoPay()
        }

        return () => {
            console.log('Leaving plan')
        }
    }, [saleQuote])

    useEffect(() => {
        if (!bottomShetRef.current) return

        const timer = setTimeout(() => {
            if (lines.length === 0) {
                bottomShetRef.current?.close()
                dispatch(setShowInfo(false))
            }
            if (lines.length > 0) {
                if (lines.length > 0 && lines.length <= 3) {
                    bottomShetRef.current?.snapToIndex(3)
                } else if (lines.length >= 4 && lines.length <= 7) {
                    bottomShetRef.current?.snapToIndex(2)
                } else {
                    bottomShetRef.current?.snapToIndex(1)
                }
            }
        }, 300)

        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [lines.length, bottomShetRef.current])

    useStatusBarColor('dark')

    return (
        <Screen>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        dispatch(setShow5G(true))
                    }}
                >
                    <Text fontFamily="SFHeavy" fontSize={18}>
                        5G
                    </Text>
                </TouchableOpacity>
                <Text fontFamily="SFBold" fontSize={24}>
                    My Plan
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        // router.back();
                        // router.push('/(app)/(root)/(plan)/filter')
                        router.push('/(app)/(nova)/filter')
                    }}
                >
                    <AntDesign name="menu-fold" size={32} color={iconColor} />
                </TouchableOpacity>
            </View>

            <View style={{ marginVertical: SIZES.base, zIndex: 190 }}>
                <LineSetter
                    onRemoveLine={() => {
                        Alert.alert(
                            'Invalid Action',
                            'Please select the line you want to remove individually',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => dispatch(toogleShake(true))
                                }
                            ]
                        )
                    }}
                    onAddLine={onAddLine}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <LinesContainer
                    lines={lines}
                    onTradeInPress={(id, index) => onTradeInPress(id, index)}
                    onBYOD={(line) => onSwitchBYOD(line)}
                    onDelete={(id) => deleteLine(id)}
                    onPerksPress={(id) => {
                        router.push({
                            pathname: '/(app)/(modals)/perks',
                            params: { lineId: id }
                        })
                    }}
                />
            </ScrollView>
            <TotalContainer ref={bottomShetRef} />
            <AnimatePresence>
                {lines.length === 0 && (
                    <MotiView
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 30
                        }}
                        from={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, bottom: 20 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: 'timing', duration: 500 }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                dispatch(setReturnRoute('myPlan'))
                                router.push('/(app)/(modals)/quotes')
                            }}
                        >
                            <Text fontFamily="SFBold">View Saved Quotes</Text>
                        </TouchableOpacity>
                    </MotiView>
                )}
            </AnimatePresence>
        </Screen>
    )
}

export default MyPlan

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        alignItems: 'center'
    }
})
