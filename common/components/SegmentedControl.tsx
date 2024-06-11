import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated'
import View from './View'
import Text from './Text'
import useThemeColor from '../hooks/useThemeColor'
import { TradeInDeviceType } from '@/types'

const { width } = Dimensions.get('window')

interface SegmentedControlProps {
    values: string[]
    selectedIndex: number
    onChange: (value: string | TradeInDeviceType, index: number) => void
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
    values,
    onChange,
    selectedIndex
}) => {
    const backgroundColor = useThemeColor('accent')
    const bgColor = useThemeColor('primary')
    const [currentIndex, setCurrentIndex] = useState(selectedIndex)
    const translateX = useSharedValue(
        currentIndex * ((width * 0.8) / values.length)
    )

    useEffect(() => {
        setCurrentIndex(selectedIndex)
        translateX.value = withTiming(
            selectedIndex * ((width * 0.8) / values.length)
        )
    }, [selectedIndex])

    const handlePress = (index: number) => {
        setCurrentIndex(index)
        translateX.value = withTiming(index * ((width * 0.8) / values.length))
        onChange(values[index], index)
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }]
        }
    })

    return (
        <View style={styles.container}>
            <View
                style={[styles.controlContainer, { backgroundColor: bgColor }]}
            >
                <Animated.View
                    style={[styles.slider, { backgroundColor }, animatedStyle]}
                />
                {values.map((value, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.controlItem}
                        onPress={() => handlePress(index)}
                    >
                        <Text
                            fontSize={18}
                            color={currentIndex === index ? 'white' : 'text'}
                            fontFamily={
                                currentIndex === index ? 'SFBold' : 'SFRegular'
                            }
                        >
                            {value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        alignSelf: 'center'
    },
    controlContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        width: '100%'
    },
    slider: {
        position: 'absolute',
        width: width / 3, // Adjust this based on the number of segments
        height: '100%',

        borderRadius: 10
    },
    controlItem: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SegmentedControl
