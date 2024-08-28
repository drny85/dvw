import React, { ReactNode } from 'react'
import { Switch, StyleSheet, ViewStyle, DimensionValue } from 'react-native'
import useThemeColor from '../hooks/useThemeColor'
import View from './View'
import Text from './Text'

interface SwitcherProps {
    title: string | ReactNode
    value: boolean
    onValueChange: () => void
    subtitle?: string
    containerStyle?: ViewStyle
    width?: DimensionValue
}

const Switcher: React.FC<SwitcherProps> = ({
    title,
    value,
    onValueChange,
    subtitle,
    containerStyle,
    width
}) => {
    const trackColor = useThemeColor('button')
    const thumbColor = useThemeColor('success')
    const bgColor = useThemeColor('background')

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={{ width: width ? width : '75%' }}>
                {typeof title === 'string' ? (
                    <Text style={styles.title}>{title}</Text>
                ) : (
                    title
                )}
                {subtitle && (
                    <Text fontFamily="SFLight" color="grey" fontSize={14}>
                        {subtitle}
                    </Text>
                )}
            </View>
            <View>
                <Switch
                    trackColor={{ false: thumbColor, true: trackColor }}
                    thumbColor={value ? thumbColor : 'grey'}
                    ios_backgroundColor={bgColor}
                    onChange={onValueChange}
                    value={value}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    title: {
        fontSize: 16
    }
})

export default Switcher
