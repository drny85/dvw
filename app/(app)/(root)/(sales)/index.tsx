import React from 'react'
import Referrals from '@/common/components/referrals/Referrals'
import { StatusBar } from 'expo-status-bar'

const ReferralsScreen = () => {
    return (
        <>
            <StatusBar style="light" />
            <Referrals />
        </>
    )
}

export default ReferralsScreen
