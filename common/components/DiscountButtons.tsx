import { View, Switch } from 'react-native'
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
import Text from './Text'
import { isDateNotInPast } from '@/utils/isNotInThePast'
import { MOBILE_PLUS_HOME_EXPIRES } from '@/constants'

const DiscountButtons = () => {
    const thumbColor = useThemeColor('accent')
    const bgColor = useThemeColor('background')
    const dispatch = useAppDispatch()
    const isWelcome = useAppSelector((s) => s.wireless.isWelcome)
    const { expressFirstResponder, expressAutoPay, expressHasFios } =
        useAppSelector((s) => s.wireless)
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 6,
                borderRadius: SIZES.base,
                width: '100%'
            }}
        >
            <Row style={{ gap: 6 }}>
                <Text>Auto Pay</Text>
                <Switch
                    trackColor={{ false: thumbColor, true: bgColor + '30' }}
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

            {isDateNotInPast(MOBILE_PLUS_HOME_EXPIRES) ? (
                <Row style={{ gap: 6 }}>
                    <Text>M+H</Text>
                    <Switch
                        trackColor={{ false: thumbColor, true: bgColor + '30' }}
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
            ) : (
                <Row style={{ gap: 6 }}>
                    <Text>
                        {SIZES.width > 500 ? 'First Responder' : 'First R'}
                    </Text>
                    <Switch
                        trackColor={{ false: thumbColor, true: bgColor + '30' }}
                        thumbColor={expressFirstResponder ? thumbColor : 'grey'}
                        ios_backgroundColor={bgColor}
                        onChange={() => {
                            if (isWelcome) {
                                dispatch(toggleIsWelcomeQualified())
                            }

                            dispatch(
                                setExpressFirstResponder(!expressFirstResponder)
                            )
                        }}
                        value={expressFirstResponder}
                    />
                </Row>
            )}
            <Row style={{ gap: 6 }}>
                <Text>NGPO</Text>
                <Switch
                    trackColor={{ false: thumbColor, true: bgColor + '30' }}
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
