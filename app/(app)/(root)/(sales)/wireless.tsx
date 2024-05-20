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
import { SaleData } from '@/types'
import {
    formatedData,
    generateFeedsBasedOnRange,
    salesData
} from '@/utils/getSales'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'

import ProgressCircle from '@/common/components/referrals/ProgressCircle'
import {
    WIRELESS_CLICK_TO_CALL,
    WIRELESS_DIRECT,
    WIRELESS_MONTHLY_GOAL
} from '@/constants'
import React, { useEffect, useMemo, useState } from 'react'
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { calculateSalesGoals } from '@/utils/calculateGoals'
import { StatusBar } from 'expo-status-bar'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'

const OPTIONS = ['Week', 'Month', 'Year']

const Sales = () => {
    const { loading, feeds } = useFeeds()
    const user = useAppSelector((s) => s.auth.user)
    const [data, setData] = useState<SaleData[]>([])
    const range = useAppSelector((s) => s.sales.range)
    const [expand, setExpand] = useState<boolean>(false)
    const [saleId, setSaleId] = useState<string>()

    const sales = salesData(data)
    const backgroundColor = useThemeColor('accent')
    const iconColor = useThemeColor('text')

    const xData: SaleData[] = useMemo(() => {
        const s = generateFeedsBasedOnRange(
            'ytd',
            feeds.filter((s) => s.feedType === 'feed')
        )
        const listData = formatedData(s)
        return listData
    }, [feeds])

    const totalEarned: number = useMemo(() => {
        const s = generateFeedsBasedOnRange(
            'mtd',
            feeds.filter((s) => s.feedType === 'feed')
        )
        const listData = formatedData(s)
        return listData.reduce((acc, curr) => {
            const c =
                curr.saleType === 'direct'
                    ? WIRELESS_DIRECT * curr.numberOfLines
                    : WIRELESS_CLICK_TO_CALL * curr.numberOfLines
            return acc + c
        }, 0)
    }, [feeds])

    const goals = useMemo(() => {
        if (!user) return 0
        return calculateSalesGoals(user?.id, WIRELESS_MONTHLY_GOAL, xData)
    }, [data, user])

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

    useStatusBarColor('light')

    if (loading) return <Loading />

    return (
        <Screen>
            <StatusBar style="light" />
            <View style={{ flex: 1, marginTop: SIZES.padding }}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: SIZES.base,
                        marginBottom: SIZES.base
                    }}
                >
                    <Text fontFamily="OWRegelar" fontSize={18}>
                        Earning this month{' '}
                        <Text fontFamily="SFBold" fontSize={20}>
                            ${totalEarned}{' '}
                        </Text>
                    </Text>
                    <Text fontFamily="SFBold" fontSize={24}>
                        Monthly Goal {WIRELESS_MONTHLY_GOAL}
                    </Text>
                    <Row style={{ gap: SIZES.padding }}>
                        {Object.values(goals).map((r, index) => (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                key={index}
                            >
                                <ProgressCircle
                                    percentage={r.percentage}
                                    textColor={iconColor}
                                    color={backgroundColor}
                                    duration={600}
                                    max={100}
                                    strokeWidth={10}
                                />
                                <Text fontFamily="SFBold" fontSize={12}>
                                    {OPTIONS[index]} (
                                    {r.units.toFixed(index === 0 ? 1 : 0)})
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

// Example usage
