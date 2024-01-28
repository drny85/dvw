import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import PersonList from '@/common/components/referrals/PersonList'
import { useHelpers } from '@/common/hooks/referrals/useHelpers'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const Referees = () => {
    const { loading, helpers } = useHelpers()
    const color = useThemeColor('text')
    if (loading) return <Loading />
    return (
        <Screen>
            <Header
                title="Referees / LA"
                onPressBack={router.back}
                hasRightIcon
                rightIcon={
                    <TouchableOpacity
                        onPress={() =>
                            router.push('/(app)/(root)/(settings)/referee')
                        }
                        style={{ marginRight: SIZES.padding }}
                    >
                        <FontAwesome name="plus" size={24} color={color} />
                    </TouchableOpacity>
                }
            />
            <PersonList
                data={helpers
                    .filter((h) => h.type === 'referee')
                    .sort((a, b) => (a.name > b.name ? 1 : -1))}
            />
        </Screen>
    )
}

export default Referees
