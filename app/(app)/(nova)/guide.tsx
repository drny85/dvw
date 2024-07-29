import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { ScrollView, TouchableOpacity } from 'react-native'
import Animated, { SlideInLeft } from 'react-native-reanimated'

import Divider from '@/common/components/Divider'
import Row from '@/common/components/Row'
import SegmentedControl from '@/common/components/SegmentedControl'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import Styles from '@/constants/Styles'

const firstSteps = [
    'Current account number(s) if you are porting in.',
    'Phone Number(s)',
    'Transfer PIN',
    'IMEI (BYOD or trading in a device'
]
const carriers = ['AT&T', 'T-Mobile', 'Other']
type Carriers = 'AT&T' | 'T-Mobile' | 'Other'

const Guide = () => {
    const text = useThemeColor('text')
    const background = useThemeColor('background')
    const [selectedIndex, setSelectedIndex] = useState<Carriers>('AT&T')

    return (
        <Screen>
            <Row
                style={{
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.padding
                }}
            >
                <TouchableOpacity style={{ padding: 6 }} onPress={router.back}>
                    <FontAwesome name="chevron-left" size={22} color={text} />
                </TouchableOpacity>
                <Text center fontFamily="SFBold" fontSize={22}>
                    VZW Sales Prep List
                </Text>
                <Text />
            </Row>
            <ScrollView
                contentContainerStyle={{
                    padding: SIZES.padding,
                    marginBottom: 30
                }}
            >
                <View style={{ gap: SIZES.base }}>
                    {firstSteps.map((step, index) => (
                        <Animated.Text
                            entering={SlideInLeft.delay(index * 200).duration(
                                600
                            )}
                            key={index}
                            style={{ fontSize: 15, color: text }}
                        >
                            {index + 1}. {step}
                        </Animated.Text>
                    ))}
                    <Animated.Text
                        style={{
                            fontStyle: 'italic',
                            color: text,
                            opacity: 0.7,
                            paddingLeft: SIZES.padding
                        }}
                    >
                        Note: You can get the IMEI by just dialing *#06#
                    </Animated.Text>
                    <View
                        style={{
                            gap: 10,
                            ...Styles.boxShadow,
                            marginVertical: 10,
                            backgroundColor: background,
                            padding: 10,
                            borderRadius: SIZES.radius
                        }}
                    >
                        <Text fontFamily="QSBold" fontSize={18} center>
                            Recommended
                        </Text>
                        <View>
                            <Text
                                fontFamily="SFLight"
                                style={{ lineHeight: 26 }}
                            >
                                Once you have the IMEI, log in to OMNI, click on
                                the Snowflake Icon{' '}
                                <FontAwesome
                                    name="snowflake-o"
                                    size={24}
                                    color={text}
                                />{' '}
                                aka "Vicky", located on the top right corner,
                                type in the message box at the bottom "IMEI",
                                space, IMEI #. EX "IMEI 3556008844444444"
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', marginTop: 10 }}>
                    <SegmentedControl
                        containerStyle={{ width: '90%' }}
                        selectedIndex={carriers.indexOf(selectedIndex)}
                        values={carriers}
                        onChange={(value) => {
                            setSelectedIndex(value as Carriers)
                        }}
                    />
                </View>
                <View>
                    {selectedIndex === 'AT&T' && (
                        <Animated.View
                            style={{
                                ...Styles.boxShadow,
                                padding: 10,
                                backgroundColor: background,
                                borderRadius: SIZES.radius
                            }}
                            entering={SlideInLeft}
                        >
                            <Text center fontFamily="SFBold" fontSize={18}>
                                If you are using the Web
                            </Text>
                            <View style={{ padding: 10, gap: 10 }}>
                                <Text>
                                    1. Sign in to https://www.att.com/log-in/
                                </Text>
                                <Text>
                                    2. Go to{' '}
                                    <Text fontFamily="SFHeavy">Profile</Text>
                                </Text>
                                <Text>
                                    3. Select{' '}
                                    <Text fontFamily="SFHeavy">
                                        Sign-in info
                                    </Text>
                                </Text>
                                <Text>
                                    4. Scroll to{' '}
                                    <Text fontFamily="SFHeavy">
                                        My linked accounts
                                    </Text>
                                </Text>
                            </View>
                            <Divider
                                small
                                containerStyle={{ paddingVertical: 6 }}
                            />
                            <Text
                                center
                                fontFamily="SFBold"
                                fontSize={18}
                                style={{ marginTop: 6 }}
                            >
                                If you are using My AT&T App
                            </Text>
                            <View style={{ padding: 10, gap: 10 }}>
                                <Text>1. Sign into the App</Text>
                                <Text>
                                    2. Go to your profile and select{' '}
                                    <Text fontFamily="SFHeavy">
                                        People & Permissions
                                    </Text>
                                </Text>
                                <Text>3. Select Wireless</Text>
                                <Text>
                                    4. Scroll to Transder phone number and
                                    select Request a new PIN{' '}
                                    <Text fontFamily="SFHeavy">
                                        My linked accounts
                                    </Text>
                                </Text>
                            </View>
                            <Text center fontFamily="SFLight">
                                Your Transfer PIN shoud display on the screen
                            </Text>
                            <View style={{ marginTop: SIZES.padding * 1.5 }}>
                                <Text>
                                    The quickest way to get yout AT&T transfer
                                    PIN is by dialing *7678 in your AT&T phone
                                </Text>
                            </View>
                        </Animated.View>
                    )}
                </View>
                <View>
                    {selectedIndex === 'T-Mobile' && (
                        <Animated.View
                            style={{
                                ...Styles.boxShadow,
                                padding: 10,
                                backgroundColor: background,
                                borderRadius: SIZES.radius
                            }}
                            entering={SlideInLeft}
                        >
                            <Text center fontFamily="SFBold" fontSize={18}>
                                T-Mobile.com
                            </Text>
                            <View style={{ padding: 10, gap: 10 }}>
                                <Text>
                                    1. Log in to your account on
                                    https://www.t-mobile.com
                                </Text>
                                <Text>
                                    2. In the top right corner, select My
                                    Account or your name
                                </Text>
                                <Text>
                                    3. Choose Profle, then Line Settings
                                </Text>
                                <Text>
                                    4. Select Request a transfer PIN, then Click
                                    on Get a transfer PIN
                                </Text>
                            </View>
                            <Text
                                center
                                fontFamily="QSBold"
                                style={{ marginVertical: SIZES.padding }}
                            >
                                If you get an error, just try again
                            </Text>
                            <Text fontFamily="QSLight">
                                Note: You must be an authorized user in order to
                                get the transfer PIN
                            </Text>
                        </Animated.View>
                    )}
                </View>
                <View>
                    {selectedIndex === 'Other' && (
                        <Animated.View
                            style={{
                                ...Styles.boxShadow,
                                padding: 10,
                                backgroundColor: background,
                                borderRadius: SIZES.radius
                            }}
                            entering={SlideInLeft}
                        >
                            <Text center fontFamily="SFBold" fontSize={18}>
                                Other carriers
                            </Text>
                            <View style={{ padding: 10, gap: 10 }}>
                                <Text>
                                    1. Go to XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                                </Text>
                                <Text>
                                    2. Click on Sign In or Register, then select
                                    My Account
                                </Text>
                                <Text>
                                    3. Select Transfer PIN, then click on Get a
                                    transfer PIN
                                </Text>
                            </View>
                            <View>
                                <Text fontFamily="QSBold">
                                    Some carriers will provide you the transfer
                                    PIN by just sending a text message (SMS) to
                                    611611 with the word "NTP"
                                </Text>
                            </View>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>
        </Screen>
    )
}

export default Guide
