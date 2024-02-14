import Divider from '@/common/components/Divider'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import SalesHeader from '@/common/components/sales/SalesHeader'
import { useFeeds } from '@/common/hooks/feeds/useFeeds'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { SaleData, SalesRange } from '@/types'
import {
    formatedData,
    generateFeedsBasedOnRange,
    salesData
} from '@/utils/getSales'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'

import ProgressCircle from '@/common/components/referrals/ProgressCircle'
import Referrals from '@/common/components/referrals/Referrals'
import { WIRELESS_MONTHLY_GOAL } from '@/constants'
import React, { useEffect, useState } from 'react'
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

const getMonthlyGoal = (range: SalesRange): number => {
    if (range === 'mtd') return WIRELESS_MONTHLY_GOAL
    if (range === 'ytd') return WIRELESS_MONTHLY_GOAL * 12
    if (range === 'wtd') return WIRELESS_MONTHLY_GOAL / 4
    if (range === 'all') return WIRELESS_MONTHLY_GOAL * 7
    if (range === 'today') return WIRELESS_MONTHLY_GOAL / 30
    return 0
}

const Sales = () => {
    const { loading, feeds } = useFeeds()
    const [view, setView] = useState<'sales' | 'referrals'>('referrals')
    const [data, setData] = useState<SaleData[]>([])
    const range = useAppSelector((s) => s.sales.range)
    const [expand, setExpand] = useState<boolean>(false)
    const [saleId, setSaleId] = useState<string>()

    const sales = salesData(data)
    const backgroundColor = useThemeColor('accent')
    const borderColor = useThemeColor('secondary')
    const iconColor = useThemeColor('text')
    const totalSales = data.reduce((a, b) => a + b.numberOfLines, 0)

    const goalPercentage = (r: SalesRange) =>
        Math.round((totalSales / getMonthlyGoal(r)) * 100)

    const today = data.filter((d) =>
        moment(d.createdAt).startOf('day').isSame(moment().startOf('day'))
    )

    const todayGoal = Math.round(
        (today.reduce((a, b) => a + b.numberOfLines, 0) /
            (WIRELESS_MONTHLY_GOAL / 30)) *
            100
    )

    const renderSales: ListRenderItem<SaleData> = ({ item }) => {
        return SaleDataLine(
            backgroundColor,
            item,
            setSaleId,
            setExpand,
            expand,
            saleId,
            iconColor,
            data
        )
    }

    useEffect(() => {
        if (!feeds.length) return
        const sales = generateFeedsBasedOnRange(
            range,
            feeds.filter((s) => s.feedType === 'feed')
        )

        const listData = formatedData(sales)
        setData(listData)
    }, [feeds.length, range])

    if (loading) return <Loading />

    return (
        <Screen>
            <View style={{ flex: 1, marginTop: SIZES.padding }}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: SIZES.base,
                        marginBottom: SIZES.base
                    }}
                >
                    <Text fontFamily="SFBold">
                        Monthly Goal {WIRELESS_MONTHLY_GOAL}
                    </Text>
                    <Row style={{ gap: SIZES.padding }}>
                        {['today', 'wtd', 'mtd'].map((r) => (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                key={r}
                            >
                                <ProgressCircle
                                    percentage={
                                        r === 'today'
                                            ? todayGoal
                                            : goalPercentage(r as SalesRange)
                                    }
                                    textColor={iconColor}
                                    color={backgroundColor}
                                    duration={600}
                                    max={100}
                                    strokeWidth={8}
                                />
                                <Text fontFamily="SFBold" fontSize={12}>
                                    {r === 'wtd'
                                        ? 'Weekly'
                                        : r === 'mtd'
                                        ? 'Monthly'
                                        : r === 'today'
                                        ? 'Daily'
                                        : ''}
                                    (
                                    {r === 'today'
                                        ? (WIRELESS_MONTHLY_GOAL / 30).toFixed(
                                              1
                                          )
                                        : Math.ceil(
                                              getMonthlyGoal(r as SalesRange)
                                          ).toFixed(1)}
                                    )
                                </Text>
                            </View>
                        ))}
                    </Row>
                </View>
                <Divider small />
                <SalesHeader />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        sales.length > 0 ? (
                            <Text center fontFamily="SFBold">
                                By EM
                            </Text>
                        ) : null
                    }
                    contentContainerStyle={{
                        padding: SIZES.base,
                        gap: SIZES.padding
                    }}
                    data={sales}
                    keyExtractor={(item) => item.id!}
                    renderItem={renderSales}
                />
            </View>
        </Screen>
    )
}

export default Sales

const styles = StyleSheet.create({
    row: {
        padding: SIZES.padding,
        borderRadius: SIZES.radius
    }
})
function SaleDataLine(
    backgroundColor: string,
    item: SaleData,
    setSaleId: React.Dispatch<React.SetStateAction<string | undefined>>,
    setExpand: React.Dispatch<React.SetStateAction<boolean>>,
    expand: boolean,
    saleId: string | undefined,
    iconColor: string,
    data: SaleData[]
): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null {
    return (
        <MotiView style={[styles.row, Styles.boxShadow, { backgroundColor }]}>
            <TouchableOpacity
                onPress={() => {
                    setSaleId(item.user.id)
                    setExpand(!expand)
                }}
            >
                <Row style={{ justifyContent: 'space-between' }}>
                    <Row
                        style={{
                            justifyContent: 'space-between',
                            width: '70%'
                        }}
                    >
                        <Text
                            color="white"
                            capitalize
                            fontFamily={
                                expand && saleId === item.user.id
                                    ? 'SFBold'
                                    : 'SFRegular'
                            }
                            fontSize={
                                expand && saleId === item.user.id ? 20 : 16
                            }
                        >
                            {item.user.name}
                        </Text>
                        <Text color="white" capitalize>
                            {item.numberOfLines}{' '}
                            {item.numberOfLines === 1 ? 'line' : 'lines'}
                        </Text>
                    </Row>

                    <FontAwesome
                        name={
                            expand && saleId === item.user.id
                                ? 'chevron-down'
                                : 'chevron-right'
                        }
                        size={20}
                        color={'#ffffff'}
                    />
                </Row>
            </TouchableOpacity>
            <AnimatePresence>
                {expand && saleId === item.user.id && (
                    <MotiView
                        from={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: 'timing', duration: 400 }}
                    >
                        <Divider />
                        {data
                            .filter((s) => s.user.id === item.user.id)
                            .map((s) => (
                                <Row
                                    key={s.id}
                                    style={{
                                        justifyContent: 'space-between',
                                        margin: SIZES.base
                                    }}
                                >
                                    <Text color="white">
                                        {s.numberOfLines}{' '}
                                        {s.numberOfLines === 1
                                            ? 'line'
                                            : 'lines'}
                                    </Text>
                                    <Text color="white">
                                        {s.saleType === 'direct'
                                            ? s.numberOfLines === 1
                                                ? 'Direct Sale'
                                                : 'Direct Sales'
                                            : 'Click to Call'}
                                    </Text>
                                    <Text color="white">
                                        {moment(s.createdAt).format(
                                            'MMM DD, YYYY'
                                        )}
                                    </Text>
                                </Row>
                            ))}
                    </MotiView>
                )}
            </AnimatePresence>
        </MotiView>
    )
}
