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
import { Referral, SaleData, SalesRange, WirelessQuote } from '@/types'
import {
    formatedData,
    generateFeedsBasedOnRange,
    salesData
} from '@/utils/getSales'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'

import { useWirelessQuotes } from '@/common/hooks/wirelessQuotes/useWirelessQuotes'
import React, { useEffect, useState } from 'react'
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { router } from 'expo-router'
import Referrals from '@/common/components/referrals/Referrals'
import ProgressCircle from '@/common/components/referrals/ProgressCircle'
import ReferralCard from '@/common/components/referrals/ReferralCard'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'

const GOAL = 70

const getMonthlyGoal = (range: SalesRange): number => {
    if (range === 'mtd') return GOAL
    if (range === 'ytd') return GOAL * 12
    if (range === 'wtd') return GOAL / 4
    if (range === 'all') return GOAL * 7
    if (range === 'today') return GOAL / 30
    return 0
}

const Sales = () => {
    const { quotes, loading: loadingQoutes } = useWirelessQuotes()
    const { referrals, loading: loadingReferrals } = useReferrals()
    const { loading, feeds } = useFeeds()
    const [secondView, setSecondView] = useState<'wireless' | 'referrals'>(
        'wireless'
    )
    const [view, setView] = useState<'follow-ups' | 'sales' | 'referrals'>(
        'referrals'
    )
    const [data, setData] = useState<SaleData[]>([])
    const range = useAppSelector((s) => s.sales.range)
    const [expand, setExpand] = useState<boolean>(false)
    const [saleId, setSaleId] = useState<string>()
    const [followUps, setFollowUps] = useState<WirelessQuote[]>([])
    const [referralsFollowUps, setReferralsFollowUps] = useState<Referral[]>([])
    const sales = salesData(data)
    const backgroundColor = useThemeColor('accent')
    const borderColor = useThemeColor('secondary')
    const bgColor = useThemeColor('background')
    const iconColor = useThemeColor('text')
    const totalSales = data.reduce((a, b) => a + b.numberOfLines, 0)

    const viewQuote = () => {
        router.push('/(app)/(root)/(plan)/myquotes')
    }

    const goalPercentage = (r: SalesRange) =>
        Math.round((totalSales / getMonthlyGoal(r)) * 100)

    const today = data.filter((d) =>
        moment(d.createdAt).startOf('day').isSame(moment().startOf('day'))
    )

    const todayGoal = Math.round(
        (today.reduce((a, b) => a + b.numberOfLines, 0) / (GOAL / 30)) * 100
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

    const renderFollowUps: ListRenderItem<WirelessQuote> = ({ item }) => {
        return (
            <View
                style={[
                    Styles.boxShadow,
                    {
                        backgroundColor: backgroundColor,
                        padding: SIZES.padding,
                        borderRadius: SIZES.radius
                    }
                ]}
            >
                <Row style={{ justifyContent: 'space-between' }}>
                    <View>
                        <Text fontFamily="SFBold">{item.customerName}</Text>
                        <Text>Total Lines : {item.lines.length}</Text>
                    </View>
                    <Row
                        style={{
                            alignItems: 'center',
                            gap: SIZES.padding * 1.5
                        }}
                    >
                        <TouchableOpacity>
                            <FontAwesome
                                name="phone"
                                size={26}
                                color={iconColor}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={viewQuote}>
                            <Text fontSize={18} fontFamily="SFBold">
                                View
                            </Text>
                        </TouchableOpacity>
                    </Row>
                </Row>
            </View>
        )
    }

    const renderReferralsFollowUp: ListRenderItem<Referral> = ({ item }) => {
        return <ReferralCard item={item} bgColor={bgColor} />
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

    useEffect(() => {
        setReferralsFollowUps(
            referrals.filter(
                (r) =>
                    r.followUpOn &&
                    moment(r.followUpOn).isBetween(
                        moment().startOf('day'),
                        moment().endOf('day')
                    )
            )
        )
    }, [referrals])

    useEffect(() => {
        if (quotes.length === 0) return
        setFollowUps(
            quotes.filter(
                (q) =>
                    q.scheduledOn &&
                    q.status == 'pending' &&
                    moment(q.scheduledOn).isBetween(
                        moment().startOf('day'),
                        moment().endOf('day')
                    )
            )
        )
    }, [quotes.length])

    if (loading || loadingQoutes || loadingReferrals) return <Loading />

    return (
        <Screen>
            <Row
                style={{
                    justifyContent: 'space-around',
                    marginBottom: SIZES.padding
                }}
            >
                <TouchableOpacity
                    style={{
                        borderBottomWidth: view === 'referrals' ? 2 : 0,
                        borderBottomColor: borderColor
                    }}
                    onPress={() => setView('referrals')}
                >
                    <Text fontFamily="SFBold" fontSize={22}>
                        Referrals
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        borderBottomWidth: view === 'follow-ups' ? 2 : 0,
                        borderBottomColor: borderColor
                    }}
                    onPress={() => setView('follow-ups')}
                >
                    <Text fontFamily="SFBold" fontSize={22}>
                        Follow Ups
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        borderBottomWidth: view === 'sales' ? 2 : 0,
                        borderBottomColor: borderColor
                    }}
                    onPress={() => setView('sales')}
                >
                    <Text fontFamily="SFBold" fontSize={22}>
                        Sales
                    </Text>
                </TouchableOpacity>
            </Row>
            {view === 'referrals' && <Referrals />}
            {view === 'follow-ups' && (
                <View style={{ flex: 1 }}>
                    <Row
                        style={{
                            justifyContent: 'space-evenly',
                            marginBottom: SIZES.padding
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setSecondView('referrals')}
                            style={{
                                borderBottomColor: borderColor,
                                borderBottomWidth:
                                    secondView === 'referrals' ? 2 : 0,
                                paddingBottom: SIZES.base
                            }}
                        >
                            <Text fontFamily="SFBold" fontSize={18}>
                                Referrals
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSecondView('wireless')}
                            style={{
                                borderBottomColor: borderColor,
                                borderBottomWidth:
                                    secondView === 'wireless' ? 2 : 0,
                                paddingBottom: SIZES.base
                            }}
                        >
                            <Text fontFamily="SFBold" fontSize={18}>
                                Wireless
                            </Text>
                        </TouchableOpacity>
                    </Row>
                    {followUps.length === 0 && secondView === 'wireless' && (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1
                            }}
                        >
                            <Text fontFamily="QSBold" capitalize fontSize={20}>
                                No {secondView} Follow ups yet
                            </Text>
                        </View>
                    )}
                    {referralsFollowUps.length === 0 &&
                        secondView === 'referrals' && (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1
                                }}
                            >
                                <Text
                                    fontFamily="QSBold"
                                    capitalize
                                    fontSize={20}
                                >
                                    No {secondView} Follow ups yet
                                </Text>
                            </View>
                        )}
                    {followUps.length > 0 && secondView === 'wireless' && (
                        <View
                            style={{
                                flex: 1
                            }}
                        >
                            <Text center fontFamily="QSBold" fontSize={20}>
                                Today's Follow ups: {followUps.length}
                            </Text>
                            <FlatList
                                data={followUps}
                                contentContainerStyle={{
                                    marginHorizontal: SIZES.base,
                                    marginTop: SIZES.padding,
                                    gap: SIZES.padding
                                }}
                                renderItem={renderFollowUps}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    )}
                    {referralsFollowUps.length > 0 &&
                        secondView === 'referrals' && (
                            <View
                                style={{
                                    flex: 1
                                }}
                            >
                                <Text center fontFamily="QSBold" fontSize={20}>
                                    Today's Follow ups:{' '}
                                    {referralsFollowUps.length}
                                </Text>
                                <FlatList
                                    data={referralsFollowUps}
                                    contentContainerStyle={{
                                        marginHorizontal: SIZES.base,
                                        marginTop: SIZES.padding,
                                        gap: SIZES.padding
                                    }}
                                    renderItem={renderReferralsFollowUp}
                                    keyExtractor={(item) => item.id!}
                                />
                            </View>
                        )}
                </View>
            )}
            {view === 'sales' && (
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: SIZES.base,
                            marginBottom: SIZES.base
                        }}
                    >
                        <Text fontFamily="SFBold">Monthly Goal {GOAL}</Text>
                        <Row style={{ gap: SIZES.padding }}>
                            {['today', 'wtd', 'mtd', 'ytd'].map((r) => (
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
                                                : goalPercentage(
                                                      r as SalesRange
                                                  )
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
                                            : 'Daily'}{' '}
                                        (
                                        {r === 'today'
                                            ? (GOAL / 30).toFixed(1)
                                            : Math.ceil(
                                                  getMonthlyGoal(
                                                      r as SalesRange
                                                  )
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
            )}
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
