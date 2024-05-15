import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Canvas, Path, Skia, Text, useFont } from '@shopify/react-native-skia'
import { SharedValue, useDerivedValue } from 'react-native-reanimated'

import useThemeColor from '../hooks/useThemeColor'

type Props = {
    strokeWidth: number
    radius: number
    percentage: SharedValue<number>
    end: SharedValue<number>
}

const ScoreCircle = ({ radius, strokeWidth, percentage, end }: Props) => {
    const innerRadius = radius - strokeWidth / 2
    const ascent = useThemeColor('accent')
    const secondary = useThemeColor('secondary')
    const font = useFont(
        require('../../assets/fonts/sf-pro-text-regular.ttf'),
        20
    )

    if (!font) {
        return null
    }
    const path = Skia.Path.Make()
    path.addCircle(radius, radius, innerRadius)

    const targetText = useDerivedValue(
        () => `${Math.round(percentage.value)}%`,
        []
    )

    const fontSize = font?.measureText('00%')

    const textX = useDerivedValue(() => {
        const _fontSize = font?.measureText(targetText.value)
        return radius - _fontSize.width / 2
    }, [])

    return (
        <View style={{ width: radius * 2, height: radius * 2 }}>
            <Canvas style={styles.container}>
                <Path
                    path={path}
                    strokeWidth={strokeWidth}
                    color={secondary}
                    style="stroke"
                    strokeJoin="round"
                    strokeCap="round"
                    start={0}
                    end={1}
                />
                <Path
                    path={path}
                    strokeWidth={strokeWidth}
                    color={ascent}
                    style="stroke"
                    strokeJoin="round"
                    strokeCap="round"
                    start={0}
                    end={end}
                />
                <Text
                    x={textX}
                    y={radius + fontSize.height / 2}
                    text={targetText}
                    font={font}
                    color={ascent}
                />
            </Canvas>
        </View>
    )
}

export default ScoreCircle

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
