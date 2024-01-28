import {
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'
import React from 'react'
import { MotiView, ScrollView } from 'moti'
import Text from '../Text'
import { SIZES } from '@/constants/Sizes'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import Loading from '../Loading'
import moment from 'moment'
import Row from '../Row'
import View from '../View'
import useThemeColor from '@/common/hooks/useThemeColor'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { setReferralId } from '@/features/referrals/referralsSlide'

const FeedsView = () => {
    const dispatch = useAppDispatch()
    const background = useThemeColor('background')
    const textColor = useThemeColor('text')
    const errorColor = useThemeColor('error')
    const { loading, referrals } = useReferrals()

    const movedYesterday = referrals.filter(
        (r) =>
            r.status.id === 'closed' &&
            r.due_date !== null &&
            moment(r.due_date)
                .startOf('day')
                .isSame(moment().subtract(1, 'day').startOf('day'))
    )
    const todayOrders = referrals.filter(
        (r) =>
            r.status.id === 'closed' &&
            moment(r.order_date).startOf('day').isSame(moment().startOf('day'))
    )
    const nonVerizonWirelessCustomer = movedYesterday.filter(
        (r) => !r.isVerizonWirelessCustomer
    )

    const movingTomorrow = referrals.filter(
        (r) =>
            (r.status.id === 'in_progress' || r.status.id === 'new') &&
            moment(r.moveIn).isBetween(
                moment().add(1, 'day').startOf('day'),
                moment().add(1, 'day').endOf('day')
            )
    )

    const todayFollowups = referrals.filter(
        (r) =>
            r.followUpOn !== null &&
            moment(r.followUpOn).startOf('day').isSame(moment().startOf('day'))
    )

    if (loading) return <Loading />
    return (
        <ScrollView
            contentContainerStyle={{ padding: SIZES.base, gap: SIZES.padding }}
        >
            {todayOrders.length > 0 && (
                <MotiView
                    style={{
                        padding: SIZES.base,
                        shadowOffset: { height: 3, width: 3 },
                        elevation: 5,
                        shadowOpacity: 0.5,
                        shadowColor: 'rgba(0,0,0,0.6)',
                        backgroundColor: background,
                        borderRadius: SIZES.radius
                    }}
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                >
                    <Text center fontFamily="QSBold" fontSize={18}>
                        You have placed {todayOrders.length} order
                        {todayOrders.length > 1 ? 's' : ''} today.
                    </Text>
                    <View style={{ padding: SIZES.base, gap: SIZES.base }}>
                        {todayOrders.map((r, index) => (
                            <Text key={r.id} fontFamily="QSLight">
                                {' '}
                                {index + 1} - An order for {r.name} placed{' '}
                                {moment(r.order_date).calendar()}
                            </Text>
                        ))}
                    </View>
                </MotiView>
            )}
            {todayFollowups.length > 0 && (
                <TouchableWithoutFeedback
                    onPress={() =>
                        router.push('/(app)/(root)/(feeds)/(home)/followups')
                    }
                >
                    <MotiView
                        style={{
                            padding: SIZES.base,
                            shadowOffset: { height: 3, width: 3 },
                            elevation: 5,
                            shadowOpacity: 0.5,
                            shadowColor: 'rgba(0,0,0,0.6)',
                            backgroundColor: background,
                            borderRadius: SIZES.radius
                        }}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                    >
                        <>
                            <View style={{ gap: SIZES.base }}>
                                <Text fontFamily="QSBold" fontSize={18}>
                                    You have these customers to follow up with
                                    today.
                                </Text>
                            </View>
                            <View
                                style={{ padding: SIZES.base, gap: SIZES.base }}
                            >
                                {todayFollowups.map((r) => (
                                    <Row
                                        key={r.id}
                                        style={{
                                            justifyContent: 'space-between',
                                            borderBottomWidth: 0.5,
                                            borderBottomColor: 'grey',
                                            paddingVertical: SIZES.base
                                        }}
                                    >
                                        <Text>{r.name}</Text>
                                    </Row>
                                ))}
                            </View>
                        </>
                    </MotiView>
                </TouchableWithoutFeedback>
            )}

            {movedYesterday.length > 0 && (
                <MotiView
                    style={{
                        padding: SIZES.base,
                        shadowOffset: { height: 3, width: 3 },
                        elevation: 5,
                        shadowOpacity: 0.5,
                        shadowColor: 'rgba(0,0,0,0.6)',
                        backgroundColor: background,
                        borderRadius: SIZES.radius
                    }}
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                >
                    <View style={{ gap: SIZES.base }}>
                        <Text fontFamily="QSBold" fontSize={18}>
                            There {movedYesterday.length === 1 ? 'is' : 'are'}{' '}
                            {movedYesterday.length} customer
                            {movedYesterday.length === 1 ? '' : 's'} who{' '}
                            {movedYesterday.length === 1 ? 'was ' : 'were '}
                            supposed to be installed yesterday. Give them a call
                            and check how the installation was.
                        </Text>
                        <Text fontFamily="QSLight">
                            Note: ({nonVerizonWirelessCustomer.length}) Non
                            Verizon Wireless customers
                        </Text>
                    </View>
                    <View style={{ padding: SIZES.base, gap: SIZES.base }}>
                        {movedYesterday.map((r) => (
                            <TouchableOpacity
                                key={r.id}
                                onPress={() => {
                                    dispatch(setReferralId(r.id!))
                                    router.push(
                                        '/(app)/(modals)/referralDetail'
                                    )
                                }}
                            >
                                <Row
                                    style={{
                                        justifyContent: 'space-between',
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: 'grey',
                                        paddingVertical: SIZES.base
                                    }}
                                >
                                    <Text>{r.name}</Text>
                                    <FontAwesome
                                        name={
                                            r.isVerizonWirelessCustomer
                                                ? 'check'
                                                : 'window-close'
                                        }
                                        color={
                                            r.isVerizonWirelessCustomer
                                                ? errorColor
                                                : textColor
                                        }
                                        size={20}
                                    />
                                </Row>
                            </TouchableOpacity>
                        ))}
                    </View>
                </MotiView>
            )}
            {movingTomorrow.length > 0 && (
                <MotiView
                    style={{
                        padding: SIZES.base,
                        shadowOffset: { height: 3, width: 3 },
                        elevation: 5,
                        shadowOpacity: 0.5,
                        shadowColor: 'rgba(0,0,0,0.6)',
                        backgroundColor: background,
                        borderRadius: SIZES.radius
                    }}
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                >
                    <Text fontFamily="QSBold" fontSize={18} center>
                        There {movingTomorrow.length === 1 ? 'is' : 'are'}{' '}
                        {movingTomorrow.length} customer
                        {movingTomorrow.length === 1 ? '' : 's'} who are moving
                        tomorrow.
                    </Text>

                    <View
                        style={{
                            padding: SIZES.base,
                            gap: SIZES.base,
                            marginTop: SIZES.base
                        }}
                    >
                        {movedYesterday.map((r) => (
                            <TouchableOpacity
                                key={r.id}
                                onPress={() => {
                                    dispatch(setReferralId(r.id!))
                                    router.push(
                                        '/(app)/(modals)/referralDetail'
                                    )
                                }}
                            >
                                <Row
                                    style={{
                                        justifyContent: 'space-between',
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: 'grey',
                                        paddingVertical: SIZES.base
                                    }}
                                >
                                    <Text>{r.name}</Text>
                                    <FontAwesome
                                        name={'chevron-right'}
                                        color={textColor}
                                        size={20}
                                    />
                                </Row>
                            </TouchableOpacity>
                        ))}
                    </View>
                </MotiView>
            )}
        </ScrollView>
    )
}

export default FeedsView

const styles = StyleSheet.create({})
