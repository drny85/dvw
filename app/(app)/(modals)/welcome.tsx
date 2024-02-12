import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { setNotFirstTime } from '@/utils/checkFirstTimeUser'
import { router } from 'expo-router'
import { MotiView, ScrollView } from 'moti'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const Welcome = () => {
    const user = useAppSelector((s) => s.auth.user)
    const btnColor = useThemeColor('accent')
    return (
        <Screen>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1

                    /*  */
                }}
            >
                <ScrollView
                    contentContainerStyle={{
                        gap: SIZES.padding * 2,
                        padding: SIZES.padding
                    }}
                >
                    <MotiView
                        from={{ translateY: -100, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ type: 'timing', duration: 700 }}
                    >
                        <Text center fontFamily="Lora" fontSize={30}>
                            Welcome {user?.name?.split(' ')[0]}
                        </Text>
                    </MotiView>
                    <MotiView
                        from={{ opacity: 0, translateY: 200 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{
                            type: 'timing',
                            duration: 700,
                            delay: 1000
                        }}
                    >
                        <Text fontFamily="OWElight" fontSize={22}>
                            Welcome aboard! We're thrilled to have you join our
                            community. At Drasco App, we're dedicated to helping
                            you effortlessly manage and stay on top of all your
                            referrals, ensuring your networking endeavors are
                            not just efficient but also rewarding.
                        </Text>
                    </MotiView>
                    <MotiView
                        from={{ opacity: 0, translateY: 200 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{
                            type: 'timing',
                            duration: 700,
                            delay: 2000
                        }}
                    >
                        <Text fontFamily="OWElight" fontSize={22}>
                            Keep track of all your referrals in one centralized
                            location. Say goodbye to scattered notes and missed
                            opportunities.
                        </Text>
                    </MotiView>
                    <MotiView
                        from={{ opacity: 0, translateY: 200 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{
                            type: 'timing',
                            duration: 700,
                            delay: 3000
                        }}
                    >
                        <Text fontFamily="OWElight" fontSize={22}>
                            Thank you for choosing Drasco App. Get ready to
                            revolutionize the way you manage referrals and
                            supercharge your networking journey!
                        </Text>
                    </MotiView>
                </ScrollView>
            </View>

            <MotiView
                style={{
                    gap: SIZES.padding,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: SIZES.padding
                }}
                from={{ opacity: 0, translateX: -200 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 1200, delay: 4500 }}
            >
                <Row
                    style={{
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center'
                    }}
                >
                    <View style={{ gap: SIZES.base }}>
                        <Text fontFamily="SFLight" fontSize={17}>
                            Warm regards,
                        </Text>
                        <Text center fontFamily="Lora" fontSize={22}>
                            Robert Melendez
                        </Text>
                    </View>

                    <MotiView
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                            loop: true,
                            delay: 500,
                            type: 'timing',
                            duration: 600
                        }}
                    >
                        <TouchableOpacity
                            onPress={async () => {
                                await setNotFirstTime()
                                router.replace('/(app)/(root)/(feeds)/(home)')
                            }}
                            style={{
                                borderRadius: SIZES.radius * 2,
                                paddingHorizontal: SIZES.padding * 1.5,
                                backgroundColor: btnColor,
                                paddingVertical: SIZES.base * 1.5
                            }}
                        >
                            <Text
                                color="white"
                                fontFamily="QSBold"
                                fontSize={18}
                            >
                                Get Started!
                            </Text>
                        </TouchableOpacity>
                    </MotiView>
                </Row>
            </MotiView>
        </Screen>
    )
}

export default Welcome
