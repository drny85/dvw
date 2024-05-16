import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import Screen from '@/common/components/Screen'
import Switcher from '@/common/components/Switcher'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet,
    toggleIsWelcomeQualified
} from '@/features/wireless/wirelessSlide'
import { router } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const filter = () => {
    const {
        expressAutoPay,
        expressFirstResponder,
        expressHasFios,
        expressInternet,
        isWelcome
    } = useAppSelector((s) => s.wireless)

    const dispatch = useAppDispatch()
    return (
        <Screen>
            <View style={Styles.flex}>
                <Header title="Selection" onPressBack={router.back} />
                <Switcher
                    value={expressAutoPay === 10}
                    title="Auto Pay"
                    onValueChange={() => {
                        dispatch(
                            setExpressAutoPay(expressAutoPay === 10 ? 0 : 10)
                        )
                    }}
                />
                <Switcher
                    value={expressFirstResponder}
                    title="First Responder"
                    onValueChange={() => {
                        dispatch(
                            setExpressFirstResponder(!expressFirstResponder)
                        )
                    }}
                />
                <Switcher
                    value={expressHasFios}
                    title="Mobile + Home Discount"
                    onValueChange={() => {
                        if (expressHasFios) {
                            dispatch(setExpressInternet())
                        }

                        dispatch(setExpressHasFios(!expressHasFios))
                    }}
                />
                <Switcher
                    value={isWelcome}
                    title="Welcome Unlimited Offer"
                    onValueChange={() => {
                        dispatch(toggleIsWelcomeQualified())
                    }}
                />
                <AnimatePresence>
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
                </AnimatePresence>
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
                        <Text fontFamily="QSBold">
                            Nova Credit Countries List
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    )
}

export default filter
