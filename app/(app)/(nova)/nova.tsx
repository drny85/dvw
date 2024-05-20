import Header from '@/common/components/Header'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import { SIZES } from '@/constants/Sizes'
import { novaCountries } from '@/novaCountries'
import { router } from 'expo-router'
import React from 'react'
import { FlatList } from 'react-native'
import Animated, { SlideInDown, SlideInRight } from 'react-native-reanimated'

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
                ListFooterComponent={
                    <Animated.View
                        entering={SlideInDown.delay(1300).duration(800)}
                    >
                        <Text fontSize={18} fontFamily="OWElight">
                            Note: Customer might enter 123-45-6789 as SSN
                        </Text>
                    </Animated.View>
                }
                renderItem={({ item, index }) => (
                    <Animated.View entering={SlideInRight.delay(index * 100)}>
                        <Text fontSize={18} fontFamily="QSBold">
                            {index + 1}) {item.name}
                        </Text>
                    </Animated.View>
                )}
            />
        </Screen>
    )
}

export default Nova
