import React from 'react'
import Screen from '@/common/components/Screen'
import Header from '@/common/components/Header'
import { router } from 'expo-router'
import Metrics from '@/common/components/referrals/Metrics'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'

const Reports = () => {
    useStatusBarColor('dark')
    return (
        <Screen>
            <Header
                title="Earnings WTD"
                onPressBack={() => {
                    router.canGoBack()
                        ? router.back()
                        : router.replace('/(app)/(root)/(sales)')
                }}
            />
            <Metrics />
        </Screen>
    )
}

export default Reports
