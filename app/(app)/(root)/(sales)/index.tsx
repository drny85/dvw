import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
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
import * as Progress from 'react-native-progress'

import React, { useEffect, useState } from 'react'
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

const GOAL = 66

const getMonthlyGoal = (range: SalesRange): number => {
    if (range === 'mtd') return GOAL
    if (range === 'ytd') return GOAL * 12
    if (range === 'wtd') return GOAL / 4
    if (range === 'all') return GOAL * 7
    if (range === 'today') return GOAL / 28
    return 0
}

const Sales = () => {
    const { loading, feeds } = useFeeds()
    const [data, setData] = useState<SaleData[]>([])
    const range = useAppSelector((s) => s.sales.range)
    const [expand, setExpand] = useState<boolean>(false)
    const [saleId, setSaleId] = useState<string>()
    const sales = salesData(data)
    const backgroundColor = useThemeColor('accent')
    const iconColor = useThemeColor('text')
    const totalSales = data.reduce((a, b) => a + b.numberOfLines, 0)

    const goalPercentage = Math.round(
        (totalSales / getMonthlyGoal(range)) * 100
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
            <Header title="Sales" />
            <SalesHeader />

            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: SIZES.base
                }}
            >
                <Text fontFamily="SFBold">Monthly Goal {GOAL}</Text>
                <Row style={{ gap: SIZES.base }}>
                    <Progress.Bar
                        // color={"red"}
                        animated
                        unfilledColor="white"
                        progress={goalPercentage / 100}
                        color={backgroundColor}
                        borderWidth={3}
                        height={10}
                        borderRadius={SIZES.radius}
                        width={SIZES.width * 0.7}
                        borderColor={iconColor}
                    />
                    <Text>{goalPercentage}%</Text>
                </Row>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: SIZES.base,
                    gap: SIZES.padding
                }}
                data={sales}
                keyExtractor={(item) => item.id!}
                renderItem={renderSales}
            />
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
        <View style={[styles.row, Styles.boxShadow, { backgroundColor }]}>
            <Row style={{ justifyContent: 'space-between' }}>
                <Row style={{ justifyContent: 'space-between', width: '70%' }}>
                    <Text capitalize>{item.user.name}</Text>
                    <Text capitalize>
                        {item.numberOfLines}{' '}
                        {item.numberOfLines === 1 ? 'line' : 'lines'}
                    </Text>
                </Row>
                <TouchableOpacity
                    onPress={() => {
                        setSaleId(item.user.id)
                        setExpand(!expand)
                    }}
                >
                    <FontAwesome
                        name={
                            expand && saleId === item.user.id
                                ? 'chevron-down'
                                : 'chevron-right'
                        }
                        size={20}
                        color={iconColor}
                    />
                </TouchableOpacity>
            </Row>
            <AnimatePresence>
                {expand && saleId === item.user.id && (
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                                    <Text>
                                        {s.numberOfLines}{' '}
                                        {s.numberOfLines === 1
                                            ? 'line'
                                            : 'lines'}
                                    </Text>
                                    <Text>
                                        {s.saleType === 'direct'
                                            ? s.numberOfLines === 1
                                                ? 'Direct Sale'
                                                : 'Direct Sales'
                                            : 'Click to Call'}
                                    </Text>
                                    <Text>
                                        {moment(s.createdAt).format(
                                            'MMM DD, YYYY'
                                        )}
                                    </Text>
                                </Row>
                            ))}
                    </MotiView>
                )}
            </AnimatePresence>
        </View>
    )
}
