import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { Line } from '@/types'

import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { setLinesData, toogleShake } from '@/features/wireless/wirelessSlide'
import { FontAwesome } from '@expo/vector-icons'
import { MotiView } from 'moti'
import { useEffect } from 'react'
import { Animated, StyleSheet, Switch, TouchableOpacity } from 'react-native'
import Text from '../Text'
import View from '../View'
import LinesMenu from './Menu'
import { calculatePrice } from '@/helpers'

type Props = {
    index: number
    line: Line
    onBYOD: (id: string) => void
    onDelete: (id: string) => void
    onPerksPress: (id: string) => void
    onTradeInPress: (id: string) => void
}
const LineItem = ({ line, onBYOD, onDelete, onTradeInPress, index }: Props) => {
    const {
        lines,
        expressAutoPay,
        expressInternet,
        expressHasFios,
        expressFirstResponder
    } = useAppSelector((s) => s.wireless)
    const shake = useAppSelector((s) => s.wireless.shake)
    const dispatch = useAppDispatch()
    const warning = useThemeColor('warning')
    const thumbColor = useThemeColor('accent')
    const bgColor = useThemeColor('background')
    const animation = new Animated.Value(0)
    const shakeDelete = () => {
        Animated.sequence([
            Animated.timing(animation, {
                toValue: 6,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(animation, {
                toValue: -6,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(animation, {
                toValue: 6,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(animation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            })
        ]).start(() => {
            dispatch(toogleShake(false))
        })
    }

    useEffect(() => {
        if (shake) shakeDelete()
    }, [shake])

    useEffect(() => {
        const newLines = lines.map((line) => {
            return {
                ...line,
                price: calculatePrice(
                    line,
                    lines,
                    expressAutoPay,
                    expressInternet,
                    expressHasFios
                )
            }
        })

        dispatch(setLinesData(newLines))
    }, [
        lines.length,
        line.name,
        expressAutoPay,
        expressFirstResponder,
        expressInternet,
        expressHasFios
    ])

    return (
        <>
            <MotiView
                style={[
                    styles.container,
                    Styles.boxShadow,
                    { backgroundColor: bgColor }
                ]}
                from={{
                    opacity: 0,
                    scale: 0.9
                }}
                animate={{
                    opacity: 1,
                    scale: 1
                }}
                transition={{
                    type: 'timing',
                    duration: 300
                }}
                exit={{ opacity: 0, scale: 0 }}
            >
                <View
                    style={{
                        width: '26%'
                    }}
                >
                    <LinesMenu line={line} index={index} />
                </View>

                <View style={styles.lineName}>
                    <Text
                        fontSize={14}
                        fontFamily={line.byod ? 'SFBold' : 'SFRegular'}
                    >
                        BYOD
                    </Text>
                    <Switch
                        value={line.byod}
                        trackColor={{ false: thumbColor, true: bgColor + '40' }}
                        thumbColor={line.byod ? thumbColor : 'grey'}
                        ios_backgroundColor={bgColor}
                        onChange={() => onBYOD(line.id)}
                    />
                </View>
                <View style={styles.lineName}>
                    <TouchableOpacity onPress={() => onTradeInPress(line.id)}>
                        <Text
                            fontSize={12}
                            fontFamily={line.tradeIn ? 'SFHeavy' : 'SFRegular'}
                        >
                            TRADE-IN
                        </Text>
                    </TouchableOpacity>
                    {/* <Switch
                        value={line.byod}
                        trackColor={{ false: thumbColor, true: '#8d99ae' }}
                        thumbColor={line.byod ? thumbColor : 'grey'}
                        ios_backgroundColor={bgColor}
                        onChange={() => onBYOD(line.id)}
                    /> */}
                </View>
                <View style={styles.lineName}>
                    <Text fontSize={16} fontFamily="SFBold">
                        ${line.price}
                    </Text>
                </View>
                {/* <TouchableOpacity onPress={() => onPerksPress(line.id)}>
                    <Text fontSize={14}>
                        {' '}
                        {totalPerksCount([], line) > 0
                            ? `Perks ${totalPerksCount([], line)}`
                            : 'Perks'}
                    </Text>
                </TouchableOpacity> */}
                <Animated.View
                    style={{ transform: [{ translateX: animation }] }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            onDelete(line.id)
                            //shake()
                        }}
                    >
                        <FontAwesome name="trash-o" size={26} color={warning} />
                    </TouchableOpacity>
                </Animated.View>
            </MotiView>
        </>
    )
}

export default LineItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        padding: SIZES.base,
        borderRadius: SIZES.radius * 0.5
    },
    lineName: {
        flexDirection: 'row',
        gap: SIZES.base,
        alignItems: 'center'
    }
})
