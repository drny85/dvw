import React from 'react'
import Screen from '@/common/components/Screen'
import Header from '@/common/components/Header'
import { router } from 'expo-router'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useThemeColor from '@/common/hooks/useThemeColor'
import { ScrollView } from 'react-native'

const SwitcherOffer = () => {
    const bgColor = useThemeColor('background')
    return (
        <Screen>
            <Header title="Switcher Offer" onPressBack={() => router.back()} />
            <View style={{ padding: 4, gap: 6, marginBottom: 6 }}>
                <Text fontFamily="QSBold">Effective Period</Text>
                <Text>11/07/24 - 12/18/24</Text>
            </View>
            <ScrollView
                contentContainerStyle={{ padding: 10 }}
                showsVerticalScrollIndicator={false}
            >
                <Text fontFamily="OWElight" fontSize={18}>
                    Customers can get a $200 Verizon Gift Card wehn porting-in
                    and perchansing an eligible smartphone on device payment
                    with select unlimited plans
                </Text>

                <View style={{ gap: 10 }}>
                    <View
                        style={{
                            padding: 8,
                            shadowOffset: { width: 3, height: 3 },
                            backgroundColor: bgColor,
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
                            shadowColor: 'rbga(0,0,0,0.1)'
                        }}
                    >
                        <Text fontFamily="SFBold">Unlimited Ultimate</Text>
                        <Text>$200</Text>
                    </View>
                    <View
                        style={{
                            padding: 10,
                            borderRadius: 8,
                            shadowOffset: { width: 3, height: 3 },
                            backgroundColor: bgColor,
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
                            shadowColor: 'rbga(0,0,0,0.1)'
                        }}
                    >
                        <Text fontFamily="SFBold">Unlimited Plus</Text>
                        <Text>$200</Text>
                    </View>
                    <View
                        style={{
                            padding: 10,
                            borderRadius: 8,
                            shadowOffset: { width: 3, height: 3 },
                            backgroundColor: bgColor,
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
                            shadowColor: 'rbga(0,0,0,0.1)'
                        }}
                    >
                        <Text fontFamily="SFBold">Unlimited Welcome</Text>
                        <Text>$100</Text>
                    </View>
                    <View>
                        <Text fontFamily="SFBold" fontSize={18}>
                            Eligibility
                        </Text>
                        <Text>
                            1) Smartphone purchase price of at least{' '}
                            <Text fontFamily="QSBold">$799.99</Text>
                        </Text>
                        <Text>
                            2) New Account or Add a Line,{' '}
                            <Text fontFamily="SFLight">
                                Porting-In Required
                            </Text>
                        </Text>
                        <Text>
                            3) Device Payment (36 Months) or Retail Pricing
                        </Text>
                    </View>
                    <View>
                        <Text fontFamily="SFBold" fontSize={18}>
                            Rebate Process
                        </Text>
                        <Text>
                            Customers must submit for redemption width 60 days
                            of activation.
                        </Text>
                        <Text>New Account or Add a Line</Text>
                        <Text>
                            Device Payment (36 Months) or Retail Pricing
                        </Text>
                    </View>
                    <View>
                        <Text fontFamily="SFBold" fontSize={18}>
                            How Reddem The Offer
                        </Text>
                        <Text>Online or My Verizon App</Text>
                        <View style={{ padding: 10 }}>
                            <Text fontFamily="QSBold">Online</Text>
                            <Text>
                                Go to verizon website and sign into your
                                wireless account, click on the "My Orders" them
                                Rebates, review information and click Submit
                            </Text>
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text fontFamily="QSBold">My Verizon App</Text>
                            <Text>
                                Open My Verizon App on your device, click on the
                                "Account" them Orders, then Rebates, review
                                information and click Submit
                            </Text>
                        </View>
                        <Text fontFamily="SFLight" fontSize={12}>
                            The customer receives the Verizon Gift Card via
                            email within 8 weeks of submission
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    )
}

export default SwitcherOffer
