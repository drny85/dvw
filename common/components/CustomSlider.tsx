// CustomSlider.tsx
import React, { useEffect } from 'react'
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring
} from 'react-native-reanimated'
import {
    Gesture,
    GestureDetector,
    PanGestureHandler
} from 'react-native-gesture-handler'

const { width } = Dimensions.get('window')
const SLIDER_WIDTH = width - 40
const THUMB_SIZE = 30

interface CustomSliderProps {
    min: number
    max: number
    initialValue: number
    onChange: (value: number) => void
}

const CustomSlider: React.FC<CustomSliderProps> = ({
    min,
    max,
    initialValue,
    onChange
}) => {
    const translateX = useSharedValue(
        ((initialValue - min) / (max - min)) * SLIDER_WIDTH
    )

    useEffect(() => {
        const value = Math.round(
            (translateX.value / SLIDER_WIDTH) * (max - min) + min
        )
        onChange(value)
    }, [translateX.value])

    // const gestureHandler = useAnimatedGestureHandler({
    //     onStart: (_, ctx: any) => {
    //         ctx.startX = translateX.value
    //     },
    //     onActive: (event, ctx) => {
    //         translateX.value = withSpring(
    //             Math.min(
    //                 Math.max(ctx.startX + event.translationX, 0),
    //                 SLIDER_WIDTH
    //             )
    //         )
    //     }
    // })

    const pan = Gesture.Pan()
        .onBegin(() => {
            translateX.value = withSpring(translateX.value)
        })
        .onUpdate((event) => {
            translateX.value = withSpring(
                Math.min(Math.max(event.translationX, 0), SLIDER_WIDTH)
            )
        })

    const animatedThumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }]
        }
    })

    const animatedFillStyle = useAnimatedStyle(() => {
        return {
            width: translateX.value + THUMB_SIZE / 2
        }
    })

    return (
        <View style={styles.container}>
            <View style={styles.track}>
                <Animated.View style={[styles.fill, animatedFillStyle]} />
                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.thumb, animatedThumbStyle]} />
                </GestureDetector>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: SLIDER_WIDTH,
        height: THUMB_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    track: {
        width: '100%',
        height: 10,
        borderRadius: 5,
        backgroundColor: '#d3d3d3',
        position: 'relative'
    },
    fill: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1FB28A',
        position: 'absolute',
        left: 0
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: '#1FB28A',
        position: 'absolute',
        top: -THUMB_SIZE / 2 + 5
    }
})

export default CustomSlider
