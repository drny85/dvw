import { View, Text, Switch } from 'react-native'
import React from 'react'
import { SIZES } from '@/constants/Sizes'
import Row from './Row'
import useThemeColor from '../hooks/useThemeColor'
import useAppDispatch from '../hooks/useAppDispatch'
import useAppSelector from '../hooks/useAppSelector'
import {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet,
    toggleIsWelcomeQualified
} from '@/features/wireless/wirelessSlide'

const DiscountButtons = () => {
    const trackColor = useThemeColor('button')
    const thumbColor = useThemeColor('success')
    const bgColor = useThemeColor('background')
    const dispatch = useAppDispatch()
    const isWelcome = useAppSelector((s) => s.wireless.isWelcome)
    const { expressFirstResponder, expressAutoPay, expressHasFios } =
        useAppSelector((s) => s.wireless)
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                padding: 6,
                borderRadius: SIZES.base,
                width: '100%'
            }}
        >
            <Row style={{ gap: 6 }}>
                <Text>Auto Pay</Text>
                <Switch
                    trackColor={{ false: thumbColor, true: trackColor }}
                    thumbColor={expressAutoPay ? thumbColor : 'grey'}
                    ios_backgroundColor={bgColor}
                    onChange={() => {
                        dispatch(
                            setExpressAutoPay(expressAutoPay === 10 ? 0 : 10)
                        )
                    }}
                    value={expressAutoPay === 10}
                />
            </Row>

            <Row style={{ gap: 6 }}>
                <Text>M+H</Text>
                <Switch
                    trackColor={{ false: thumbColor, true: trackColor }}
                    thumbColor={expressHasFios ? thumbColor : 'grey'}
                    ios_backgroundColor={bgColor}
                    onChange={() => {
                        if (expressHasFios) {
                            dispatch(setExpressInternet())
                        }

                        dispatch(setExpressHasFios(!expressHasFios))
                    }}
                    value={expressHasFios}
                />
            </Row>
            <Row style={{ gap: 6 }}>
                <Text>LGPO</Text>
                <Switch
                    trackColor={{ false: thumbColor, true: trackColor }}
                    thumbColor={isWelcome ? thumbColor : 'grey'}
                    ios_backgroundColor={bgColor}
                    onChange={() => {
                        if (expressFirstResponder) {
                            dispatch(setExpressFirstResponder(false))
                        }
                        dispatch(toggleIsWelcomeQualified())
                    }}
                    value={isWelcome}
                />
            </Row>
        </View>
    )
}

export default DiscountButtons
