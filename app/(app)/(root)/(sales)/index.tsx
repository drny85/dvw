import Referrals from '@/common/components/referrals/Referrals'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'
import React from 'react'

const ReferralsScreen = () => {
    useStatusBarColor('light')
    return <Referrals />
}

export default ReferralsScreen
