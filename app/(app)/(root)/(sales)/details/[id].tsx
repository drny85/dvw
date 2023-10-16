import { StyleSheet } from 'react-native'
import React from 'react'
import Screen from '@/common/components/Screen'
import { router, useLocalSearchParams } from 'expo-router'
import Text from '@/common/components/Text'
import Header from '@/common/components/Header'

const ReferralDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    return (
        <Screen>
            <Header title="Details" onPressBack={router.back} />
            <Text>{id}</Text>
        </Screen>
    )
}

export default ReferralDetails

const styles = StyleSheet.create({})
