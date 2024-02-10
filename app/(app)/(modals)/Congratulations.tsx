import Screen from '@/common/components/Screen'
import Styles from '@/constants/Styles'
import { router } from 'expo-router'
import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import Row from '@/common/components/Row'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'
import { setSaleQuoteReferral } from '@/features/sales/salesSlide'
import { MotiView } from 'moti'

const Congratulations = () => {
    const { saleQuote } = useAppSelector((s) => s.sales)

    const dispatch = useAppDispatch()
    const navigateBack = () => {
        dispatch(setSaleQuoteReferral(null))

        router.push('/(app)/(root)/(sales)')
    }

    const goToPlan = () => {
        console.log('Go to plan 2')

        router.push('/(app)/(modals)/scheduleWireles')
        // router.push('/(app)/(root)/(plan)')
        // router.back()
    }
    return (
        <Screen style={Styles.flex}>
            <View
                style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: SIZES.padding * 2,
                    left: 0,
                    right: 0
                }}
            >
                <Text center style={{ fontSize: 28, fontFamily: 'SFBold' }}>
                    Congratulations!
                </Text>
            </View>
            <AnimatedLottieView
                source={require('@/assets/animations/email-light.json')}
                autoPlay
                style={[Styles.flex, { marginBottom: 80 }]}
                resizeMode="contain"
            />
            <MotiView
                from={{ opacity: 0, translateY: 500 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500 }}
                style={styles.bottomView}
            >
                <Text fontFamily="QSLight" fontSize={18}>
                    Please do not forget to send the Closed Sale Spark Email
                </Text>
                {!saleQuote?.isVerizonWirelessCustomer && (
                    <View style={{ padding: SIZES.base, gap: SIZES.padding }}>
                        <Text fontFamily="QSLight" fontSize={18}>
                            Wait! ... This customer does not have Verizon
                            Wireless
                        </Text>
                        <Text>
                            Would you like to schedule a follow up based on your
                            conversation?
                        </Text>
                        <Row
                            style={{
                                justifyContent: 'space-evenly',
                                alignItems: 'center'
                            }}
                        >
                            <TouchableOpacity onPress={navigateBack}>
                                <Text
                                    fontFamily="QSBold"
                                    fontSize={18}
                                    color="grey"
                                >
                                    No
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={goToPlan}>
                                <Text fontSize={20} fontFamily="SFBold">
                                    Yes
                                </Text>
                            </TouchableOpacity>
                        </Row>
                    </View>
                )}
                {saleQuote?.isVerizonWirelessCustomer && (
                    <TouchableOpacity
                        style={{ marginVertical: SIZES.base }}
                        onPress={navigateBack}
                    >
                        <Text fontFamily="SFBold" fontSize={20}>
                            Got it!
                        </Text>
                    </TouchableOpacity>
                )}
            </MotiView>
        </Screen>
    )
}

export default Congratulations

const styles = StyleSheet.create({
    bottomView: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,

        gap: SIZES.padding,
        padding: SIZES.padding
    }
})
