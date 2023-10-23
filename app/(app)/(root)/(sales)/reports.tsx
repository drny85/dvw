import React from 'react'
import Screen from '@/common/components/Screen'
import Header from '@/common/components/Header'
import { router } from 'expo-router'
import Metrics from '@/common/components/referrals/Metrics'

const reports = () => {
    return (
        <Screen>
            <Header title="Earnings WTD" onPressBack={router.back} />
            <Metrics />
        </Screen>
    )
}

export default reports
