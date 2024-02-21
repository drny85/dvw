import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import FeedsView from '@/common/components/feed/FeedsView'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { setReferralId } from '@/features/referrals/referralsSlide'
import { Referral } from '@/types'
import { router } from 'expo-router'
import moment from 'moment'
import React from 'react'
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native'

const FollowUps = () => {
    const user = useAppSelector((s) => s.auth.user)
    const { referrals, loading } = useReferrals(user?.id!)

    const bg = useThemeColor('accent')
    const dispatch = useAppDispatch()
    const data = referrals
        ?.filter(
            (r) =>
                r.followUpOn !== null && moment(r.followUpOn).isAfter(moment())
        )
        .sort((a, b) => moment(a.followUpOn).diff(moment(b.followUpOn)))

    // if (data.length === 0 && )
    //     return (
    //         <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
    //             <Text fontSize={20}>No Follow Ups</Text>
    //         </Screen>
    //     )

    const renderFollowUps: ListRenderItem<Referral> = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch(setReferralId(item.id!))
                    router.push(`/(app)/(modals)/${item.id}`)
                }}
                style={[
                    Styles.boxShadow,
                    {
                        backgroundColor: bg,
                        borderRadius: SIZES.radius * 0.5,
                        padding: SIZES.base,
                        gap: SIZES.base,
                        justifyContent: 'center'
                    }
                ]}
            >
                <Text
                    color="white"
                    center
                    fontFamily="QSBold"
                    fontSize={22}
                    capitalize
                >
                    {item.followUpType}
                </Text>
                <Row
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text color="white">
                        {' '}
                        {index + 1} - {item.name}
                    </Text>

                    <Text color="white" fontSize={14} fontFamily="SFLight">
                        {moment(item.followUpOn).fromNow()}
                    </Text>
                </Row>
                <Text color="white" center fontFamily="QSBold" fontSize={12}>
                    {moment(item.followUpOn).format('lll')}s
                </Text>
            </TouchableOpacity>
        )
    }

    if (loading) return <Loading />
    return (
        <Screen>
            <Text center style={{ marginTop: SIZES.padding }}>
                Upcoming Follow Ups ({data.length})
            </Text>
            <FlatList
                contentContainerStyle={{
                    padding: SIZES.base,
                    gap: SIZES.padding
                }}
                data={data}
                keyExtractor={(item) => item.id!}
                renderItem={renderFollowUps}
                ListFooterComponent={<FeedsView referrals={referrals} />}
            />
        </Screen>
    )
}

export default FollowUps
