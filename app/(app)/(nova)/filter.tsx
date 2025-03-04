import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import Screen from '@/common/components/Screen'
import Switcher from '@/common/components/Switcher'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { MOBILE_PLUS_HOME_EXPIRES } from '@/constants'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet,
    toggleIsWelcomeQualified
} from '@/features/wireless/wirelessSlide'
import { isDateNotInPast } from '@/utils/isNotInThePast'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const filter = () => {
    const { expressAutoPay, expressFirstResponder, expressHasFios, isWelcome } =
        useAppSelector((s) => s.wireless)

    const dispatch = useAppDispatch()
    return (
        <Screen>
            <View style={Styles.flex}>
                <Header title="Discounts" onPressBack={router.back} />

                <Switcher
                    subtitle="It must be a bank account (checking, saving) or Verizon Visa Card to be eligible for the discount & enroll in paper-free billing"
                    value={expressAutoPay === 10}
                    title="Auto Pay"
                    onValueChange={() => {
                        dispatch(
                            setExpressAutoPay(expressAutoPay === 10 ? 0 : 10)
                        )
                    }}
                />

                <Switcher
                    value={isWelcome}
                    title="National Growth Pricing Offer"
                    onValueChange={() => {
                        if (expressFirstResponder) {
                            dispatch(setExpressFirstResponder(false))
                        }
                        dispatch(toggleIsWelcomeQualified())
                    }}
                />
                <Switcher
                    value={expressFirstResponder}
                    title="First Responder"
                    onValueChange={() => {
                        if (isWelcome) {
                            dispatch(toggleIsWelcomeQualified())
                        }
                        dispatch(
                            setExpressFirstResponder(!expressFirstResponder)
                        )
                    }}
                />
                {isDateNotInPast(MOBILE_PLUS_HOME_EXPIRES) && (
                    <Switcher
                        value={expressHasFios}
                        title="Mobile + Home 3.0"
                        onValueChange={() => {
                            if (expressHasFios) {
                                dispatch(setExpressInternet())
                            }

                            dispatch(setExpressHasFios(!expressHasFios))
                        }}
                    />
                )}

                {/* <AnimatePresence>
                    {expressHasFios && (
                        <MotiView
                            key="internet"
                            from={{
                                opacity: 0,
                                translateY: -20
                            }}
                            exit={{
                                opacity: 0,
                                translateY: -20
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0
                            }}
                        >
                            <View style={{ marginVertical: SIZES.base }}>
                                <Text center fontFamily="SFBold">
                                    Internet Options
                                </Text>
                            </View>
                            <Divider />
                            <Switcher
                                value={expressInternet === 'one_gig'}
                                title="1 GIG Internet"
                                onValueChange={() => {
                                    dispatch(
                                        setExpressInternet(
                                            expressInternet === 'one_gig'
                                                ? '300'
                                                : 'one_gig'
                                        )
                                    )
                                }}
                            />
                            <Switcher
                                value={expressInternet === 'two_gig'}
                                title="2 GIG Internet"
                                onValueChange={() => {
                                    dispatch(
                                        setExpressInternet(
                                            expressInternet === 'two_gig'
                                                ? '300'
                                                : 'two_gig'
                                        )
                                    )
                                }}
                            />
                        </MotiView>
                    )}
                </AnimatePresence> */}
            </View>
            <View
                style={{
                    padding: SIZES.padding,
                    marginTop: SIZES.padding,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        //router.back()
                        router.push('/(app)/(nova)/nova')
                    }}
                >
                    <Text fontSize={18} fontFamily="SFHeavy">
                        Nova Credit Countries List
                    </Text>
                </TouchableOpacity>
            </View>
        </Screen>
    )
}

export default filter
