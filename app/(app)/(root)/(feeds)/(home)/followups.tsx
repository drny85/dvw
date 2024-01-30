import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
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
    const referrals = useAppSelector((s) => s.referrals.referrals)
    const bg = useThemeColor('accent')
    const dispatch = useAppDispatch()
    const data = referrals.filter(
        (r) => r.followUpOn !== null && moment(r.followUpOn).isAfter(moment())
    )

    if (data.length === 0)
        return (
            <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text fontSize={20}>No Follow Ups</Text>
            </Screen>
        )

    const renderFollowUps: ListRenderItem<Referral> = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch(setReferralId(item.id!))
                    router.push('/(app)/(modals)/referralDetail')
                }}
                style={[
                    Styles.boxShadow,
                    {
                        backgroundColor: bg,
                        borderRadius: SIZES.radius * 0.5,
                        padding: SIZES.padding,
                        gap: SIZES.base,
                        justifyContent: 'center'
                    }
                ]}
            >
                <Row
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text>
                        {' '}
                        {index + 1} - {item.name}
                    </Text>

                    <Text fontSize={14} fontFamily="SFLight">
                        {moment(item.followUpOn).fromNow()}
                    </Text>
                </Row>
                <Text center fontFamily="QSLight" fontSize={12}>
                    {moment(item.followUpOn).format('lll')}s
                </Text>
            </TouchableOpacity>
        )
    }
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
            />
        </Screen>
    )
}

export default FollowUps
