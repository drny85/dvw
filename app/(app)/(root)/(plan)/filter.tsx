import React from 'react'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import Styles from '@/constants/Styles'
import Header from '@/common/components/Header'
import { router } from 'expo-router'
import Switcher from '@/common/components/Switcher'
import useAppSelector from '@/common/hooks/useAppSelector'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet
} from '@/features/wireless/wirelessSlide'
import { MotiView, AnimatePresence } from 'moti'
import Divider from '@/common/components/Divider'
import { SIZES } from '@/constants/Sizes'
import { TouchableOpacity } from 'react-native-gesture-handler'

const filter = () => {
    const {
        expressAutoPay,
        expressFirstResponder,
        expressHasFios,
        expressInternet
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
                        if (expressHasFios && !expressFirstResponder) return
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
                        if (expressFirstResponder) {
                            dispatch(setExpressFirstResponder(false))
                        }

                        dispatch(setExpressHasFios(!expressHasFios))
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
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: SIZES.padding * 2
                    }}
                >
                    <TouchableOpacity
                        onPress={() =>
                            router.push('/(app)/(root)/(plan)/myquotes')
                        }
                    >
                        <Text fontFamily="SFBold">View Saved Quotes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    )
}

export default filter
