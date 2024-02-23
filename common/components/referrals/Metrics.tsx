import { useFilteredClosedReferrals } from '@/common/hooks/referrals/useFilteredClosedReferrals'
import { usePayout } from '@/common/hooks/referrals/usePayout'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { INTERNETnames, Referral, SalesRange, TVnames } from '@/types'
import { calculateDRR } from '@/utils/calculateDRR'
import { MotiView, ScrollView } from 'moti'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import Divider from '../Divider'
import Loading from '../Loading'
import Row from '../Row'
import Text from '../Text'
import Paginator from './Paginator'
import PercentageIndicator from './PercentageIndicator'

const Metrics = () => {
    // const { weeklyWirelessGoal } = useAppSelector((state) => state.settings)
    const user = useAppSelector((s) => s.auth.user)
    const bgColor = useThemeColor('background')
    const scrollXInternet = useRef(new Animated.Value(0)).current
    const scrollXTv = useRef(new Animated.Value(0)).current
    const { referrals, loading: loadingRefs } = useReferrals(user?.id!)
    const [drr, setDRR] = useState(0)
    const [data, setData] = useState<Referral[]>([])
    const { internet, tv } = usePayout(data)

    const { wtd, mtd, lw, lm, loading, today, twb } =
        useFilteredClosedReferrals(
            user?.id!,
            referrals.filter((s) => s.status.id === 'closed')
        )

    const [period, setPeriod] = useState<SalesRange>('wtd')

    const totalInternetUnits = (): number =>
        Object.values(internet).reduce((a, b) => a + b, 0) ?? 0
    const totalTvUnits = (): number =>
        Object.values(tv).reduce((a, b) => a + b, 0) ?? 0

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
                : period === 'twb'
                ? twb
                : wtd
        )
    }, [period])

    useEffect(() => {
        setData(wtd)
    }, [wtd.length])

    useEffect(() => {
        const d = calculateDRR(
            Object.values(internet).reduce((c, v) => c + v, 0) +
                Object.values(tv).reduce((c, v) => c + v, 0),
            period
        )
        setDRR(d)
    }, [internet, tv])

    if (loading || loadingRefs || !user) return <Loading />

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
                            title="LW"
                            onPress={() => {
                                setPeriod('lw')
                                setData(lw)
                            }}
                            selected={period === 'lw'}
                        />
                        <Selector
                            title="TWB"
                            onPress={() => {
                                setPeriod('twb')
                                setData(twb)
                            }}
                            selected={period === 'twb'}
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
                            title="LM"
                            onPress={() => {
                                setPeriod('lm')
                                setData(lm)
                            }}
                            selected={period === 'lm'}
                        />
                    </Row>
                </View>
            </MotiView>

            <View
                style={[
                    styles.section,
                    { backgroundColor: bgColor, marginTop: SIZES.padding }
                ]}
            >
                <Text center fontFamily="SFBold" fontSize={20}>
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
                            {Object.entries(internet)
                                .sort((a, b) => (a < b ? 1 : -1))
                                .map((i, index) => {
                                    return (
                                        <PercentageIndicator
                                            value={
                                                (i[1] / totalInternetUnits()) *
                                                100
                                            }
                                            key={index}
                                            title={INTERNETnames[i[0]]}
                                            size="medium"
                                            percentage={() => {
                                                const v =
                                                    (i[1] /
                                                        totalInternetUnits()) *
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
                            {Object.entries(internet)
                                .sort((a, b) => (a < b ? 1 : -1))
                                .map((i, index) => {
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
                <Text center fontFamily="SFBold" fontSize={20}>
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
            <View style={{ gap: SIZES.padding }}>
                <Text center fontFamily="SFBold">
                    <Text uppercase fontFamily="QSBold">
                        {period === 'lw'
                            ? 'Last Week'
                            : period === 'lm'
                            ? 'Last Month'
                            : period === 'twb'
                            ? 'The Week Before LW'
                            : period}
                    </Text>
                    , Daily Run Rate <Text> (DRR)</Text>
                </Text>
                <Text
                    center
                    color={
                        drr < 2
                            ? 'error'
                            : drr >= 2 && drr < 3
                            ? 'warning'
                            : 'success'
                    }
                    fontFamily="SFHeavy"
                    fontSize={30}
                >
                    {drr}
                </Text>
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
                    backgroundColor: !selected ? 'grey' : accentColor
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
