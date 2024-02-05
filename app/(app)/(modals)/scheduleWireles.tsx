import Loading from '@/common/components/Loading'
import Scheduler from '@/common/components/Scheduler'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { useReferral } from '@/common/hooks/referrals/useReferral'
import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'
import React from 'react'

const scheduleWireles = () => {
    const id = useAppSelector((s) => s.sales.id)

    const { referral, loading } = useReferral(id!)
    if (loading) return <Loading />
    return (
        <Screen>
            {/* <Scheduler referral={referral!} hide={true} /> */}
            <Text center fontFamily="QSBold" fontSize={18}>
                {' '}
                Schedule Wireless Call
            </Text>
            <View style={{ padding: SIZES.padding }}>
                <Text>
                    Based on your conversation with{' '}
                    {referral?.name.split(' ')[0]}, please schedule this
                    reminder for yourself
                </Text>
                <View style={{ marginTop: SIZES.padding }}>
                    <Scheduler referral={referral!} hide={true} />
                </View>
            </View>
        </Screen>
    )
}

export default scheduleWireles
