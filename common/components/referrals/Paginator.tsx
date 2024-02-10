import React, { FC } from 'react'
import { useWindowDimensions, View, Animated, ViewStyle } from 'react-native'

import { data } from '@/types'

interface Props {
    data: typeof data
    scrollX: Animated.Value
    bgColor?: ViewStyle['backgroundColor']
}
const Paginator: FC<Props> = ({ data, scrollX, bgColor }) => {
    const { width } = useWindowDimensions()
    return (
        <View style={{ flexDirection: 'row', height: 20 }}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 14, 10],
                    extrapolate: 'clamp'
                })
                const bg = scrollX.interpolate({
                    outputRange: ['grey', '#dedede', 'grey'],
                    inputRange,
                    extrapolate: 'clamp'
                })

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp'
                })

                return (
                    <Animated.View
                        key={i.toString()}
                        style={{
                            height: 10,
                            width: dotWidth,
                            borderRadius: 5,
                            marginHorizontal: 8,
                            backgroundColor: bg,
                            opacity
                        }}
                    />
                )
            })}
        </View>
    )
}

export default Paginator
