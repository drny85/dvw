import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import { useReferral } from '@/common/hooks/referrals/useReferral'
import useAppSelector from '@/common/hooks/useAppSelector'
import React from 'react'

const scheduleWireles = () => {
    const id = useAppSelector((s) => s.sales.id)

    const { referral, loading } = useReferral(id!)
    if (loading) return <Loading />
    return (
        <Screen>
            {/* <Scheduler referral={referral!} hide={true} /> */}
            <Text>Schedule {referral?.name}</Text>
        </Screen>
    )
}

export default scheduleWireles
