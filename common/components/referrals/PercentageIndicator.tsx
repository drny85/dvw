import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import React from 'react'
import { View } from 'react-native'

import ProgressCircle from './ProgressCircle'

interface Props {
    percentage: () => string
    value: number
    title: string
    size?: 'small' | 'medium' | 'large'
}
const PercentageIndicator = ({ value, size }: Props) => {
    const textColor = useThemeColor('text')
    const accentColor = useThemeColor('accent')
    const radiusWith = () =>
        SIZES.isSmallDevice ? SIZES.width : SIZES.width * 0.5
    const radius = () =>
        size === 'small'
            ? radiusWith() / 7
            : size === 'medium'
            ? radiusWith() / 5
            : size === 'large'
            ? radiusWith() / 3
            : radiusWith() / 5

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ProgressCircle
                percentage={value}
                radius={radius()}
                duration={600}
                strokeWidth={10}
                max={100}
                color={accentColor}
                textColor={textColor}
            />
        </View>
    )
}

export default PercentageIndicator
