import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import { MotiView, ScrollView } from 'moti'
import Paginator from './Paginator'
import { useFilteredClosedReferrals } from '@/common/hooks/referrals/useFilteredClosedReferrals'
import { usePayout } from '@/common/hooks/referrals/usePayout'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import { SIZES } from '@/constants/Sizes'
import { INTERNETnames, Referral, TVnames, WIRELESSnames } from '@/types'
import Divider from '../Divider'
import Loading from '../Loading'
import Row from '../Row'
import PercentageIndicator from './PercentageIndicator'
import Text from '../Text'
import useThemeColor from '@/common/hooks/useThemeColor'
import CircularProgressBar from '../CircularProgressBar'

const weeklyWirelessGoal = 2

const Metrics = () => {
    // const { weeklyWirelessGoal } = useAppSelector((state) => state.settings)
    const bgColor = useThemeColor('background')
    const accentColor = useThemeColor('accent')
    const scrollXInternet = useRef(new Animated.Value(0)).current
    const scrollXTv = useRef(new Animated.Value(0)).current
    const scrollXWireless = useRef(new Animated.Value(0)).current
    const { referrals, loading: loadingRefs } = useReferrals()

    const [data, setData] = useState<Referral[]>([])
    const { internet, tv, wireless } = usePayout(data)

    const { wtd, mtd, lw, lm, loading, today } = useFilteredClosedReferrals(
        referrals.filter((s) => s.status.id === 'closed')
    )

    const [period, setPeriod] = useState<
        'lw' | 'today' | 'wtd' | 'mtd' | 'lm' | 'all'
    >('wtd')

    const totalInternetUnits = (): number =>
        Object.values(internet).reduce((a, b) => a + b, 0) ?? 0
    const totalTvUnits = (): number =>
        Object.values(tv).reduce((a, b) => a + b, 0) ?? 0
    const totalWirelessUnits = (): number =>
        Object.values(wireless).reduce((a, b) => a + b, 0) ?? 0

    useEffect(() => {
        setData(
            period === 'wtd'
                ? wtd
                : period === 'mtd'
                ? mtd
                : period === 'lw'
                ? lw
                : period === 'today'
                ? today
                : period === 'lm'
                ? lm
                : wtd
        )
    }, [period])

    useEffect(() => {
        setData(wtd)
    }, [wtd.length])

    if (loading || loadingRefs) return <Loading />

    return (
        <ScrollView
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500 }}
            contentContainerStyle={{
                width: '100%',
                backgroundColor: bgColor
            }}
            showsVerticalScrollIndicator={false}
        >
            <Text center fontFamily="SFBold" fontSize={22}>
                Sales Period
            </Text>
            <MotiView
                from={{
                    opacity: 0,
                    translateY: -SIZES.height * 0.3
                }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 400 }}
                exit={{
                    opacity: 0,
                    translateY: -SIZES.height * 0.3
                }}
                style={[
                    { backgroundColor: bgColor, marginVertical: SIZES.base }
                ]}
            >
                <View
                    style={{
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}
                >
                    <Row
                        style={{
                            justifyContent: 'space-evenly',
                            alignItems: 'center'
                        }}
                    >
                        <Selector
                            title="WTD"
                            onPress={() => {
                                setPeriod('wtd')
                                setData(wtd)
                            }}
                            selected={period === 'wtd'}
                        />
                        <Selector
                            title="Last Week"
                            onPress={() => {
                                setPeriod('lw')
                                setData(lw)
                            }}
                            selected={period === 'lw'}
                        />

                        <Selector
                            title="MTD"
                            onPress={() => {
                                setPeriod('mtd')
                                setData(mtd)
                            }}
                            selected={period === 'mtd'}
                        />
                        <Selector
                            title="Last Month"
                            onPress={() => {
                                setPeriod('lm')
                                setData(lm)
                            }}
                            selected={period === 'lm'}
                        />
                    </Row>
                </View>
            </MotiView>

            <View style={[styles.section, { backgroundColor: bgColor }]}>
                <Text center fontFamily="SFBold">
                    Internet ({totalInternetUnits()})
                </Text>
                <Divider small />
                <ScrollView
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: scrollXInternet
                                    }
                                }
                            }
                        ],
                        { useNativeDriver: false }
                    )}
                    pagingEnabled
                    decelerationRate={0}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={32}
                    snapToAlignment="center"
                    horizontal
                    scrollEnabled
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: SIZES.base
                    }}
                    style={{ width: SIZES.width }}
                >
                    <View
                        style={{
                            width: SIZES.width
                        }}
                    >
                        <Row
                            style={{
                                justifyContent: 'space-evenly',
                                alignItems: 'center'
                            }}
                        >
                            {Object.entries(internet).map((i, index) => {
                                return (
                                    <PercentageIndicator
                                        value={
                                            (i[1] / totalInternetUnits()) * 100
                                        }
                                        key={index}
                                        title={INTERNETnames[i[0]]}
                                        size="medium"
                                        percentage={() => {
                                            const v =
                                                (i[1] / totalInternetUnits()) *
                                                100
                                            return v.toFixed(1) + '%'
                                        }}
                                    />
                                    // <CircularProgressBar
                                    //     radius={40}
                                    //     key={index}
                                    //     currentValue={
                                    //         // (i[1] / totalInternetUnits()) * 100
                                    //         i[1]
                                    //     }
                                    //     maxValue={totalInternetUnits()}
                                    // />
                                )
                            })}
                        </Row>
                    </View>
                    <View
                        style={{
                            width: SIZES.width,
                            backgroundColor: bgColor
                        }}
                    >
                        <Row
                            style={{
                                justifyContent: 'space-evenly',
                                alignItems: 'center'
                            }}
                        >
                            {Object.entries(internet).map((i, index) => {
                                return (
                                    <View key={index}>
                                        <Text
                                            center
                                            fontFamily="SFBold"
                                            fontSize={16}
                                        >
                                            {INTERNETnames[i[0]]}
                                        </Text>
                                        <Text
                                            center
                                            fontFamily="SFBold"
                                            fontSize={18}
                                        >
                                            {i[1]}
                                        </Text>
                                    </View>
                                )
                            })}
                        </Row>
                    </View>
                </ScrollView>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 4
                    }}
                >
                    <Paginator
                        data={[{ id: '1' }, { id: '2' }]}
                        scrollX={scrollXInternet}
                    />
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: bgColor }]}>
                <Text center fontFamily="SFBold">
                    TV / Video ({totalTvUnits()})
                </Text>
                <ScrollView
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { x: scrollXTv }
                                }
                            }
                        ],
                        { useNativeDriver: false }
                    )}
                    pagingEnabled
                    decelerationRate={0}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={32}
                    // snapToAlignment="center"
                    horizontal
                    scrollEnabled
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    style={{
                        width: SIZES.width
                    }}
                >
                    <View style={{ width: SIZES.width }}>
                        <Row
                            style={{
                                justifyContent: 'space-evenly',
                                alignItems: 'center'
                            }}
                        >
                            {Object.entries(tv)?.map((obj, i) => (
                                <PercentageIndicator
                                    key={i}
                                    title={TVnames[obj[0]]}
                                    value={+((obj[1] / totalTvUnits()) * 100)}
                                    size="medium"
                                    percentage={() => {
                                        const v =
                                            (+obj[1] / totalTvUnits()) * 100
                                        return v.toFixed(1) + '%'
                                    }}
                                />
                            ))}
                        </Row>
                    </View>
                    <View
                        style={{
                            width: SIZES.width,
                            backgroundColor: bgColor
                        }}
                    >
                        <Row
                            style={{
                                justifyContent: 'space-evenly',
                                alignItems: 'center'
                            }}
                        >
                            {Object.entries(tv).map((i, index) => {
                                return (
                                    <View key={index}>
                                        <Text center fontFamily="SFBold">
                                            {TVnames[i[0]]}
                                        </Text>
                                        <Text
                                            center
                                            fontSize={18}
                                            fontFamily="SFBold"
                                        >
                                            {i[1]}
                                        </Text>
                                    </View>
                                )
                            })}
                        </Row>
                    </View>
                </ScrollView>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 4
                    }}
                >
                    <Paginator
                        data={[{ id: '1' }, { id: '2' }]}
                        scrollX={scrollXTv}
                    />
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: bgColor }]}>
                <Text center fontFamily="SFBold">
                    Wireless Sales ({totalWirelessUnits()})
                </Text>
                <Divider small />
                <ScrollView
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: scrollXWireless
                                    }
                                }
                            }
                        ],
                        { useNativeDriver: false }
                    )}
                    pagingEnabled
                    decelerationRate={0}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={32}
                    snapToAlignment="center"
                    horizontal
                    scrollEnabled
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    style={{ width: SIZES.width }}
                >
                    <View style={{ width: SIZES.width }}>
                        <Row
                            style={{
                                justifyContent: 'space-evenly',
                                alignItems: 'center'
                            }}
                        >
                            {Object.entries(wireless)?.map((obj, i) => (
                                <PercentageIndicator
                                    key={i}
                                    title={`Goal ${weeklyWirelessGoal}`}
                                    value={
                                        (totalWirelessUnits() /
                                            weeklyWirelessGoal) *
                                        100
                                    }
                                    size="medium"
                                    percentage={() => {
                                        const v =
                                            (totalWirelessUnits() /
                                                weeklyWirelessGoal) *
                                            100
                                        return v.toFixed(1) + '%'
                                    }}
                                />
                            ))}
                        </Row>
                    </View>
                    <View
                        style={{
                            width: SIZES.width,
                            backgroundColor: accentColor
                        }}
                    >
                        <Row
                            style={{
                                justifyContent: 'space-evenly',
                                alignItems: 'center'
                            }}
                        >
                            {Object.entries(wireless).map((i, index) => {
                                return (
                                    <View key={index}>
                                        <Text
                                            center
                                            fontSize={16}
                                            fontFamily="SFBold"
                                        >
                                            {WIRELESSnames[i[0]]}
                                        </Text>
                                        <Text
                                            center
                                            fontFamily="SFBold"
                                            fontSize={18}
                                        >
                                            {i[1]}
                                        </Text>
                                    </View>
                                )
                            })}
                        </Row>
                    </View>
                </ScrollView>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 4
                    }}
                >
                    <Paginator
                        data={[{ id: '1' }, { id: '2' }]}
                        scrollX={scrollXWireless}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default Metrics

const Selector = ({
    title,
    onPress,
    selected
}: {
    title: string
    selected: boolean
    onPress: () => void
}) => {
    const accentColor = useThemeColor('accent')
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.pick,
                {
                    backgroundColor: selected ? 'grey' : accentColor
                }
            ]}
        >
            <Text
                fontFamily={selected ? 'SFBold' : 'SFRegular'}
                color={'white'}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    click: {
        paddingVertical: 6,
        paddingHorizontal: 14
    },
    up: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    section: {
        borderRadius: SIZES.radius,
        marginVertical: SIZES.base,
        paddingVertical: SIZES.base,
        width: SIZES.width
    },

    pick: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6
    }
})
