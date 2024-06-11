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
import {
    PLUS_BYOD_VALUE,
    ULTIMATE_BYOD_VALUE,
    WELCOME_BYOD_VALUE
} from '@/constants'
import { SIZES } from '@/constants/Sizes'
import { setReturnRoute } from '@/features/settings/settingsSlice'
import {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet,
    setLinesData,
    toogleShake
} from '@/features/wireless/wirelessSlide'
import { perks } from '@/perks'
import { Line, LineName } from '@/types'
import { calculateTradeInValues } from '@/utils/calculateTradeIn'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'

import React, { useCallback, useEffect, useRef } from 'react'

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
                perks: [...perks],
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
                    price: calculatePrice({ ...line, byod: !line.byod }),
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
        router.push({
            pathname: '/(app)/(modals)/trade-in',
            params: { lineId: id, lineIndex: index }
        })
    }

    const calculatePrice = useCallback(
        (line: Line): number => {
            switch (line.name) {
                case 'Unlimited Welcome':
                    return (
                        (lines.length === 1
                            ? 75
                            : lines.length === 2
                            ? 65
                            : lines.length === 3
                            ? 50
                            : lines.length === 4
                            ? 40
                            : lines.length >= 5
                            ? 37
                            : 0) -
                        expressAutoPay -
                        mobilePlusHome(line) -
                        (line.byod ? WELCOME_BYOD_VALUE : 0) -
                        calculateLoyaltyBonus(line, expressInternet) +
                        perksTotal(line)
                    )
                case 'Unlimited Plus':
                    return (
                        (lines.length === 1
                            ? 90
                            : lines.length === 2
                            ? 80
                            : lines.length === 3
                            ? 65
                            : lines.length === 4
                            ? 55
                            : lines.length >= 5
                            ? 52
                            : 0) -
                        expressAutoPay -
                        mobilePlusHome(line) -
                        (line.byod ? PLUS_BYOD_VALUE : 0) -
                        calculateLoyaltyBonus(line, expressInternet) +
                        perksTotal(line)
                    )
                case 'Unlimited Ultimate':
                    return (
                        (lines.length === 1
                            ? 100
                            : lines.length === 2
                            ? 90
                            : lines.length === 3
                            ? 75
                            : lines.length === 4
                            ? 65
                            : lines.length >= 5
                            ? 62
                            : 0) -
                        expressAutoPay -
                        mobilePlusHome(line) -
                        (line.byod ? ULTIMATE_BYOD_VALUE : 0) -
                        calculateLoyaltyBonus(line, expressInternet) +
                        perksTotal(line)
                    )
                default:
                    return 0
            }
        },
        [
            lines.length,
            expressAutoPay,
            expressFirstResponder,
            expressInternet,
            expressHasFios
        ]
    )

    const onSwitchLine = (id: string, name: LineName) => {
        const line = lines.find((line) => line.id === id)!
        const n: Line = {
            ...line,
            originalPrice:
                name === 'Unlimited Ultimate'
                    ? 100
                    : name === 'Unlimited Plus'
                    ? 90
                    : name === 'Unlimited Welcome'
                    ? 75
                    : 0,
            name: name
        }
        const perkChecked =
            name === 'Unlimited Ultimate'
                ? {
                      ...n,

                      perks: [
                          ...perks.filter((p) => p.name !== '3 TravelPass Days')
                      ]
                  }
                : { ...n, perks: [...perks] }
        const newLines = lines.map((line) => {
            if (line.id === id) {
                return {
                    ...perkChecked,
                    price: calculatePrice(n),
                    name: name,
                    perks: line.perks,
                    tradeIn: line.tradeIn,
                    tradeInValues: line.tradeInValues
                        ? calculateTradeInValues(
                              name,
                              line.tradeInValues?.device!,
                              line.tradeInValues?.phoneRetailValue
                          )
                        : null
                }
            }
            return line
        })

        dispatch(setLinesData(newLines))
    }

    const perksTotal = (line: Line): number => {
        return line.perks
            .map((i) => (i.selected ? i.price : 0))
            .reduce(
                (acc, p) => acc + p,

                0
            )
    }

    const mobilePlusHome = (line: Line): number => {
        if (
            (expressInternet === 'one_gig' || expressInternet === 'two_gig') &&
            (line.name === 'Unlimited Plus' ||
                line.name === 'Unlimited Ultimate')
        ) {
            return 10
        } else if (
            expressHasFios &&
            expressInternet === 'one_gig' &&
            line.name === 'Unlimited Welcome'
        ) {
            return 5
        } else if (expressHasFios && expressInternet !== 'one_gig') {
            return 5
        } else {
            return 0
        }
    }

    const calculateLoyaltyBonus = (
        line: Line,
        internet: typeof expressInternet
    ): number => {
        return 0
        // if (!expressHasFios || lines.length === 0) return 0
        // const gig = internet === 'one_gig' || internet === 'two_gig'
        // if (
        //     line.name === 'Unlimited Plus' ||
        //     line.name === 'Unlimited Ultimate'
        // ) {
        //     if (gig) {
        //         return lines.length === 1 ? 25 : lines.length === 2 ? 15 : 0
        //     }
        //     return lines.length === 1
        //         ? 30
        //         : lines.length === 2
        //         ? 20
        //         : lines.length === 3
        //         ? 5
        //         : 0
        // } else if (line.name === 'Unlimited Welcome') {
        //     return lines.length === 1
        //         ? 30
        //         : lines.length === 2
        //         ? 20
        //         : lines.length === 3
        //         ? 5
        //         : 0
        // } else {
        //     return 0
        // }
    }

    useEffect(() => {
        const newLines = lines.map((line) => {
            return {
                ...line,
                price: calculatePrice(line)
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
                <TouchableOpacity style={{ padding: 2 }} onPress={router.back}>
                    <FontAwesome
                        name="chevron-left"
                        size={22}
                        color={iconColor}
                    />
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
                    onSwitchLine={onSwitchLine}
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
