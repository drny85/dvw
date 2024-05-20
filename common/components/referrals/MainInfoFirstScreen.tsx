import { StyleSheet } from 'react-native'
import React from 'react'
import { ORDER_TYPE } from '@/types'
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated'
import { SIZES } from '@/constants/Sizes'
import ButtonRadio from '../RadioButton'
import Row from '@/common/components/Row'
import View from '@/common/components/View'
import Text from '@/common/components/Text'
import Styles from '@/constants/Styles'

type Props = {
    bgColor: string
    isReferral: boolean
    setIsReferral: React.Dispatch<React.SetStateAction<boolean>>
    orderType: string
    setOrderType: React.Dispatch<React.SetStateAction<ORDER_TYPE>>
}

const MainInfoFirstScreen = ({
    bgColor,
    isReferral,
    orderType,
    setOrderType,
    setIsReferral
}: Props) => {
    return (
        <Animated.View
            entering={SlideInLeft.duration(600)}
            exiting={SlideOutRight.duration(600)}
            style={{ flex: 1, gap: SIZES.padding * 1.5 }}
        >
            <View
                style={[
                    Styles.boxShadow,
                    { ...styles.row, backgroundColor: bgColor }
                ]}
            >
                <Text fontFamily="SFBold">Is This a Referral?</Text>
                <Row
                    style={{
                        justifyContent: 'space-around',
                        width: '80%',
                        marginTop: SIZES.base
                    }}
                >
                    <ButtonRadio
                        selected={isReferral}
                        title="Yes"
                        onPress={() => {
                            setIsReferral(true)
                        }}
                    />
                    <ButtonRadio
                        selected={!isReferral}
                        title="No"
                        onPress={() => {
                            setIsReferral(false)
                        }}
                    />
                </Row>
            </View>
            <View
                style={[
                    Styles.boxShadow,
                    { ...styles.row, backgroundColor: bgColor }
                ]}
            >
                <Text fontFamily="SFBold">Order Type</Text>
                <Row
                    style={{
                        justifyContent: 'space-around',
                        width: '80%',
                        marginTop: SIZES.base
                    }}
                >
                    <ButtonRadio
                        selected={orderType === 'new'}
                        title="New"
                        onPress={() => {
                            setOrderType('new')
                        }}
                    />
                    <ButtonRadio
                        selected={orderType === 'move'}
                        title="Move"
                        onPress={() => {
                            setOrderType('move')
                        }}
                    />
                    <ButtonRadio
                        selected={orderType === 'acp'}
                        title="ACP"
                        onPress={() => {
                            setOrderType('acp')
                        }}
                    />
                </Row>
            </View>

            <Text fontSize={20} fontFamily="QSLight">{`This customer is ${
                isReferral ? 'a Referral' : 'not a Referral'
            } and is ${
                orderType === 'new'
                    ? 'new customer'
                    : orderType === 'move'
                    ? 'a moving customer'
                    : 'ACP customer'
            } `}</Text>
        </Animated.View>
    )
}

export default MainInfoFirstScreen

const styles = StyleSheet.create({
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
        borderRadius: SIZES.radius
    }
})
