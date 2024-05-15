import Header from '@/common/components/Header'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import { SIZES } from '@/constants/Sizes'
import { novaCountries } from '@/novaCountries'
import { router } from 'expo-router'
import React from 'react'
import { FlatList } from 'react-native'

const Nova = () => {
    return (
        <Screen>
            <Header title="Nova Countries" onPressBack={() => router.back()} />
            <FlatList
                contentContainerStyle={{
                    gap: SIZES.padding,
                    padding: SIZES.padding
                }}
                data={novaCountries}
                renderItem={({ item }) => <Text>{item.name}</Text>}
            />
        </Screen>
    )
}

export default Nova
