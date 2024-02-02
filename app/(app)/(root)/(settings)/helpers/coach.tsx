import Screen from '@/common/components/Screen'
import React from 'react'
import { StyleSheet } from 'react-native'

import PersonList from '@/common/components/referrals/PersonList'
import { useHelpers } from '@/common/hooks/referrals/useHelpers'
import Header from '@/common/components/Header'
import { router } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Loading from '@/common/components/Loading'

const Coach = () => {
    const { helpers, loading } = useHelpers()
    const color = useThemeColor('text')
    if (loading) return <Loading />
    return (
        <Screen>
            <Header
                title="My Coach"
                onPressBack={router.back}
                hasRightIcon
                rightIcon={
                    <TouchableOpacity
                        onPress={() =>
                            router.push('/(app)/(root)/(settings)/coach')
                        }
                        style={{ padding: SIZES.padding }}
                    >
                        <FontAwesome name="plus" size={24} color={color} />
                    </TouchableOpacity>
                }
            />
            <PersonList
                data={helpers.filter((helper) => helper.type === 'coach')}
            />
        </Screen>
    )
}

export default Coach

const styles = StyleSheet.create({})
