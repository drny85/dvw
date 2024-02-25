import { useFilteredClosedReferrals } from '@/common/hooks/referrals/useFilteredClosedReferrals'
import { useHelpers } from '@/common/hooks/referrals/useHelpers'
import { usePayout } from '@/common/hooks/referrals/usePayout'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { Referral, TIERS } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Loading from '../Loading'
import Row from '../Row'
import Screen from '../Screen'
import Text from '../Text'
import View from '../View'
import ReferralsMiniCard from './ReferralsMiniCard'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import {
    setEditingReferral,
    setReferralId,
    setReferralState
} from '@/features/referrals/referralsSlide'

const Referrals = () => {
    const bgColor = useThemeColor('secondary')
    const { loading, helpers } = useHelpers()
    const accent = useThemeColor('accent')
    const dispatch = useAppDispatch()
    const user = useAppSelector((s) => s.auth.user)

    const name = user?.name.split(' ')[0] ?? ''
    const [animateInternetAmount, setAnimateInternetAmount] = useState(0)
    const managers = helpers.filter((helper) => helper.type === 'ce')
    const referees = helpers.filter((helper) => helper.type === 'referee')
    const coaches = helpers.filter((helper) => helper.type === 'coach')
    const candAdd =
        managers.length === 0 || referees.length === 0 || coaches.length === 0
    const show =
        coaches.length > 0 && managers.length > 0 && referees.length > 0
    const { wtd, loading: ld } = useFilteredClosedReferrals(user?.id!)
    const { internetAmount, tvAmount, homeAmount } = usePayout(wtd)

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateInternetAmount(internetAmount + tvAmount + homeAmount)
        }, 800)

        return () => {
            clearTimeout(timer)
        }
    }, [internetAmount, tvAmount, homeAmount, user])

    if (loading || ld || !user) return <Loading />

    return (
        <Screen>
            {candAdd && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: SIZES.padding
                    }}
                >
                    {referees.length === 0 && (
                        <Text fontFamily="SFBold">
                            You need at least a Referee / LA
                        </Text>
                    )}
                    {managers.length === 0 && (
                        <Text fontFamily="SFBold">You need at least a CE</Text>
                    )}

                    {coaches.length === 0 && (
                        <Text fontFamily="SFBold">
                            You need at least a Coach
                        </Text>
                    )}
                    <TouchableOpacity
                        style={[
                            Styles.boxShadow,
                            styles.btn,
                            { backgroundColor: bgColor }
                        ]}
                        onPress={() => {
                            router.push('/(app)/(root)/(settings)')
                        }}
                    >
                        <Text color="white" fontFamily="SFBold">
                            Go to Settings
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {show && (
                <ScrollView
                    contentContainerStyle={{
                        padding: SIZES.base,
                        gap: SIZES.padding
                    }}
                >
                    <View>
                        <Text center fontFamily="SFBold" fontSize={18}>
                            Referrals By Status
                        </Text>
                        <Row
                            style={{
                                justifyContent: 'space-around',
                                marginTop: SIZES.base
                            }}
                        >
                            <ReferralsMiniCard type="new" subtitle="New" />
                            <ReferralsMiniCard
                                type="in-progress"
                                subtitle="Pending"
                            />
                            <ReferralsMiniCard type="all" subtitle="All" />
                        </Row>
                    </View>
                    <View>
                        <Text center fontFamily="SFBold" fontSize={18}>
                            Closed Referrals
                        </Text>
                        <Row
                            style={{
                                justifyContent: 'space-around',
                                marginTop: SIZES.base
                            }}
                        >
                            <ReferralsMiniCard
                                type="closed-today"
                                subtitle="Today"
                            />
                            <ReferralsMiniCard
                                type="closed-wtd"
                                subtitle="WTD"
                            />
                            <ReferralsMiniCard
                                type="closed-mtd"
                                subtitle="Closed"
                            />
                        </Row>
                    </View>
                    <View>
                        <Text center fontFamily="SFBold" fontSize={18}>
                            Moving In
                        </Text>
                        <Row
                            style={{
                                justifyContent: 'space-around',
                                marginTop: SIZES.base
                            }}
                        >
                            <ReferralsMiniCard
                                type="moving-today"
                                subtitle="Today"
                            />
                            <ReferralsMiniCard
                                type="moving-in-one-week"
                                subtitle="A Week"
                            />
                            <ReferralsMiniCard
                                type="moving-in-one-month"
                                subtitle="A Month"
                            />
                        </Row>
                    </View>
                    <View>
                        <Text center fontFamily="SFBold" fontSize={18}>
                            Installations
                        </Text>
                        <Row
                            style={{
                                justifyContent: 'space-around',
                                marginTop: SIZES.base
                            }}
                        >
                            <ReferralsMiniCard
                                type="installation-yesterday"
                                subtitle="Yesterday"
                            />
                            <ReferralsMiniCard
                                type="installation-today"
                                subtitle="Today"
                            />
                            <ReferralsMiniCard
                                type="installation-last-week"
                                subtitle="Last Week"
                            />
                        </Row>
                    </View>
                    {wtd.length > 0 && (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%'
                            }}
                        >
                            <Text center fontFamily="SFBold" fontSize={18}>
                                Earnings WTD
                            </Text>
                            {renderPayoutInfo(
                                animateInternetAmount,
                                wtd,
                                accent,
                                name
                            )}
                        </View>
                    )}
                </ScrollView>
            )}
            {show && (
                <TouchableOpacity
                    style={[
                        styles.floatingButton,
                        { backgroundColor: bgColor }
                    ]}
                    onPress={() => {
                        dispatch(setEditingReferral(false))
                        dispatch(setReferralId(null))
                        dispatch(setReferralState(null))
                        router.push('/(app)/(modals)/referral')
                    }}
                >
                    <FontAwesome name="plus" size={30} color={'white'} />
                </TouchableOpacity>
            )}
        </Screen>
    )
}

export default Referrals

const renderPayoutInfo = (
    amount: number,
    refs: Referral[],
    accent: string,
    name: string
) => {
    return (
        <View
            style={[
                styles.square,
                {
                    backgroundColor: accent,
                    marginTop: SIZES.padding * 1.2,
                    alignSelf: 'center',
                    width: '98%',
                    padding: SIZES.padding * 1.2
                }
            ]}
        >
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text color="white" fontFamily="SFLight" fontSize={18}>
                    {refs.length <= TIERS.tier.tier1 &&
                        `Hey ${name}, let see how we can get you to Tier 2`}
                </Text>
                <Text color="white" fontFamily="QSRegular">
                    {refs.length >= TIERS.tier.tier2 &&
                        refs.length < TIERS.tier.tier3 &&
                        `Great ${name}, you are in Tier 2 now`}
                </Text>
                <Text color="white" fontFamily="QSRegular">
                    {refs.length >= TIERS.tier.tier3 &&
                        `Excellent ${name}, you are in Tier 3 now, why stop?`}
                </Text>
                <Text color="white" fontFamily="QSBold" fontSize={18}>
                    Earned so far!
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Text color="white" fontSize={26} fontFamily="SFBold">
                        ${amount}
                    </Text>
                    {/* <AnimatedNumbers
                        fontStyle={{
                            color: textColor,
                            fontSize: SIZES.width > 375 ? 34 : 26,
                            fontFamily: 'montserrat-bold'
                        }}
                        animateToNumber={amount}
                    /> */}
                </View>
                <View
                    style={{
                        backgroundColor: accent,
                        paddingHorizontal: SIZES.padding,
                        paddingVertical: SIZES.padding * 0.4,
                        borderRadius: SIZES.radius,
                        marginTop: 8
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'grey',
                            paddingHorizontal: SIZES.padding,
                            paddingVertical: SIZES.base,
                            borderRadius: SIZES.radius
                        }}
                        onPress={() => {
                            router.push('/(app)/(modals)/reports')
                        }}
                    >
                        <Text color="white" fontSize={18} fontFamily="SFBold">
                            See Reports
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: SIZES.padding,
        right: SIZES.padding,

        height: 50,
        width: 50,
        borderRadius: 25,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        borderRadius: SIZES.radius * 3,
        padding: SIZES.padding,
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 400,
        marginTop: SIZES.padding
    },
    square: {
        paddingVertical: SIZES.padding * 0.2,
        borderRadius: SIZES.radius,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: SIZES.width * 0.32
    }
})
