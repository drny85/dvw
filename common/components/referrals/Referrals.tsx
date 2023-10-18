import { useHelpers } from '@/common/hooks/referrals/useHelpers'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Loading from '../Loading'
import Row from '../Row'
import Screen from '../Screen'
import Text from '../Text'
import View from '../View'
import ReferralsMiniCard from './ReferralsMiniCard'

const Referrals = () => {
    const bgColor = useThemeColor('secondary')
    const { loading, helpers } = useHelpers()
    const managers = helpers.filter((helper) => helper.type === 'ce')
    const referees = helpers.filter((helper) => helper.type === 'referee')
    const coaches = helpers.filter((helper) => helper.type === 'coach')
    const candAdd =
        managers.length === 0 || referees.length === 0 || coaches.length === 0
    const show =
        coaches.length > 0 && managers.length > 0 && referees.length > 0

    if (loading) return <Loading />

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
                    <View>
                        <Text center fontFamily="SFBold" fontSize={18}>
                            Earnings
                        </Text>
                    </View>
                </ScrollView>
            )}
            {show && (
                <TouchableOpacity
                    style={[
                        styles.floatingButton,
                        { backgroundColor: bgColor }
                    ]}
                    onPress={() => {
                        router.push('/referrals')
                    }}
                >
                    <FontAwesome name="plus" size={30} color={'white'} />
                </TouchableOpacity>
            )}
        </Screen>
    )
}

export default Referrals

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
    }
})
