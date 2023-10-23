import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Row from '../Row'
import Text from '../Text'
import { SalesRange } from '@/types'
import { SIZES } from '@/constants/Sizes'
import useAppSelector from '@/common/hooks/useAppSelector'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { setRange } from '@/features/sales/salesSlide'
import useThemeColor from '@/common/hooks/useThemeColor'

const SalesHeader = () => {
    const salesRanges: SalesRange[] = ['today', 'wtd', 'mtd', 'ytd']
    const selected = useAppSelector((s) => s.sales.range)
    const textColor = useThemeColor('text')
    const dispatch = useAppDispatch()
    const onPressRange = (range: SalesRange) => {
        dispatch(setRange(range))
    }

    return (
        <Row
            style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: SIZES.base
            }}
        >
            {salesRanges.map((range) => (
                <TouchableOpacity
                    key={range}
                    onPress={() => onPressRange(range)}
                    style={{
                        borderColor: range === selected ? textColor : undefined,
                        borderBottomWidth: range === selected ? 2 : 0
                    }}
                >
                    <Text
                        fontFamily={range === selected ? 'SFBold' : 'SFLight'}
                        fontSize={16}
                        uppercase
                        color={'text'}
                    >
                        {range}
                    </Text>
                </TouchableOpacity>
            ))}
        </Row>
    )
}

export default SalesHeader

const styles = StyleSheet.create({})
