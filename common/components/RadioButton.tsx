import { MotiView } from 'moti'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import useThemeColor from '../hooks/useThemeColor'
import Row from './Row'
import Text from './Text'
import { SIZES } from '@/constants/Sizes'

interface Props {
    selected: boolean
    title: string
    onPress: () => void
}
const ButtonRadio = ({ selected, title, onPress }: Props) => {
    const accent = useThemeColor('accent')
    const textColor = useThemeColor('text')
    const btnColor = useThemeColor('secondary')
    return (
        <TouchableOpacity style={{ marginVertical: 10 }} onPress={onPress}>
            <Row style={{ alignItems: 'center' }}>
                <Text fontFamily={selected ? 'SFBold' : 'SFRegular'}>
                    {title}
                </Text>
                <MotiView style={[styles.outer, { backgroundColor: accent }]}>
                    <MotiView
                        from={{
                            backgroundColor: textColor,
                            opacity: 0,
                            scale: 0
                        }}
                        animate={{
                            backgroundColor: selected ? textColor : accent,
                            opacity: 1,
                            scale: selected ? [1, 1.2, 1] : 1
                        }}
                        transition={{ type: 'timing', duration: 600 }}
                        style={[styles.inner]}
                    ></MotiView>
                </MotiView>
            </Row>
        </TouchableOpacity>
    )
}

export default ButtonRadio

const styles = StyleSheet.create({
    outer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SIZES.base
    },
    inner: {
        width: 20,
        height: 20,
        borderRadius: 10
    }
})
