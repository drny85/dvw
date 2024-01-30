import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import ProgressCircle from '@/common/components/referrals/ProgressCircle'
import { useHelper } from '@/common/hooks/referrals/useHelper'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { Referral } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import moment from 'moment'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

const HelperInfo = () => {
    const { helperId } = useLocalSearchParams<{ helperId: string }>()
    const trash = useThemeColor('warning')
    const edit = useThemeColor('accent')

    const { loading, helper } = useHelper(helperId)
    const { referrals, loading: lg } = useReferrals()
    const data = referrals.filter((f) => f.referee?.id === helperId)
    const lastReferral = data
        .filter((r) => r.status.id === 'closed')
        .sort(
            (a, b) =>
                new Date(b.order_date!).getTime() -
                new Date(a.order_date!).getTime()
        )[0]
    if (loading || lg) return <Loading />
    return (
        <Screen>
            <Header
                title="Details"
                onPressBack={() => router.back()}
                rightIcon={
                    <Row
                        style={{
                            alignItems: 'center',
                            gap: SIZES.padding * 1.5,
                            marginRight: SIZES.padding
                        }}
                    >
                        <TouchableOpacity>
                            <FontAwesome name="trash" color={trash} size={28} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome name="pencil" color={edit} size={28} />
                        </TouchableOpacity>
                    </Row>
                }
                hasRightIcon
            />
            <View style={styles.container}>
                <Text center fontFamily="SFBold" fontSize={20}>
                    {helper?.name}
                </Text>
                <View style={{ padding: SIZES.padding, gap: SIZES.base }}>
                    <Text>Phone: {helper?.phone}</Text>
                    <Text>Email: {helper?.email}</Text>
                </View>
                <View style={{ marginVertical: SIZES.padding }}>
                    <Text center fontFamily="SFBold" fontSize={18}>
                        Referee's Constribution
                    </Text>
                </View>

                <HelperMetric data={data} allData={referrals} />
                <Divider small height={SIZES.padding * 2} />
                <View
                    style={{
                        marginVertical: SIZES.padding,
                        gap: SIZES.padding
                    }}
                >
                    <Text center fontFamily="QSBold">
                        Last Referral Closed
                    </Text>
                    {lastReferral ? (
                        <Text center fontFamily="QSLight">
                            {moment(lastReferral.order_date).format('ll')}
                        </Text>
                    ) : (
                        <Text center>Non Referral closed</Text>
                    )}
                </View>
            </View>
        </Screen>
    )
}

export default HelperInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.padding
    }
})

const HelperMetric = ({
    data,
    allData
}: {
    data: Referral[]
    allData: Referral[]
}) => {
    const accent = useThemeColor('accent')
    const text = useThemeColor('text')

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly'
            }}
        >
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ProgressCircle
                    percentage={
                        (data.filter((r) => r.status.id === 'closed').length /
                            data.length) *
                        100
                    }
                    radius={40}
                    duration={600}
                    strokeWidth={10}
                    max={100}
                    color={accent}
                    textColor={text}
                />

                <Text center>Closed</Text>
            </View>

            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ProgressCircle
                    percentage={
                        (data.filter(
                            (r) =>
                                r.status.id === 'new' ||
                                r.status.id === 'in_progress'
                        ).length /
                            data.length) *
                        100
                    }
                    radius={40}
                    duration={600}
                    strokeWidth={10}
                    max={100}
                    color={accent}
                    textColor={text}
                />

                <Text center>Pending</Text>
            </View>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ProgressCircle
                    percentage={(data.length / allData.length) * 100}
                    radius={40}
                    duration={600}
                    strokeWidth={10}
                    max={100}
                    color={accent}
                    textColor={text}
                />

                <Text center>Overall</Text>
            </View>
        </View>
    )
}
