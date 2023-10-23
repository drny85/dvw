import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { ReferralsFilterType } from '@/types'
import { getResults } from '@/utils/getReferralsFilterData'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Text from '../Text'
import { router } from 'expo-router'

type Props = {
    type: ReferralsFilterType
    subtitle: string
}
const ReferralsMiniCard = ({ subtitle, type }: Props) => {
    const bg = useThemeColor('background')
    const shadow = useThemeColor('secondary')
    const { loading, referrals } = useReferrals()
    if (loading) null

    return (
        <TouchableOpacity
            disabled={getResults(referrals, type).length === 0}
            onPress={() => router.push(`/(app)/(root)/(sales)/${type}`)}
            style={[
                Styles.boxShadow,
                styles.container,
                { backgroundColor: bg, shadowColor: shadow }
            ]}
        >
            <Text fontFamily="QSBold">{subtitle}</Text>
            <Text fontFamily="SFBold" fontSize={22}>
                {getResults(referrals, type).length}
            </Text>
        </TouchableOpacity>
    )
}

export default ReferralsMiniCard

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        minWidth: '30%'
    }
})
