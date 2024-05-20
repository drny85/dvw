import { TouchableOpacity } from 'react-native'
import { Referral } from '@/types'
import useThemeColor from '@/common/hooks/useThemeColor'
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated'
import Styles from '@/constants/Styles'
import View from '../View'
import Text from '../Text'
import { SIZES } from '@/constants/Sizes'
import TextInput from '../TextInput'
import Row from '../Row'
import { FontAwesome } from '@expo/vector-icons'
import { formatPhone } from '@/utils/formatPhone'

type Props = {
    referral: Referral
    isReferral: boolean
    setReferral: React.Dispatch<React.SetStateAction<Referral>>
    setShowManagers: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomerInfoThirdScreen = ({
    isReferral,
    setReferral,
    setShowManagers,
    referral
}: Props) => {
    const placeholderColor = useThemeColor('placeholder')
    return (
        <Animated.View
            exiting={SlideOutLeft.duration(600)}
            entering={SlideInRight.duration(600)}
            style={Styles.flex}
        >
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Full Name
                </Text>
                <TextInput
                    placeholder="Full Name"
                    value={referral.name}
                    onChangeText={(text) =>
                        setReferral({ ...referral, name: text })
                    }
                    autoCapitalize="words"
                />
            </View>
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Cell Phone
                </Text>
                <TextInput
                    placeholder="Cell Phone"
                    value={referral.phone}
                    keyboardType="number-pad"
                    onChangeText={(text) =>
                        setReferral({
                            ...referral,
                            phone: formatPhone(text)
                        })
                    }
                />
            </View>
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Email Address
                </Text>
                <TextInput
                    placeholder="Email address"
                    value={referral.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) =>
                        setReferral({
                            ...referral,
                            email: text.toLowerCase()
                        })
                    }
                />
            </View>
            {isReferral && (
                <View>
                    <View>
                        <Text
                            fontFamily="SFBold"
                            style={{
                                margin: SIZES.base
                            }}
                        >
                            Account Manager / CE
                        </Text>
                        <Row
                            style={{
                                width: '100%',
                                ...Styles.boxShadow,
                                backgroundColor: placeholderColor,
                                padding: SIZES.base * 1.5,
                                borderRadius: SIZES.radius * 2
                            }}
                        >
                            <FontAwesome
                                name="user-o"
                                color={'white'}
                                size={24}
                                style={{
                                    marginHorizontal: SIZES.base
                                }}
                            />
                            <View
                                style={{
                                    borderRadius: SIZES.radius,
                                    overflow: 'hidden',
                                    marginLeft: SIZES.padding
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowManagers(true)
                                    }}
                                >
                                    <Text fontFamily="SFBold" color="white">
                                        {referral.manager
                                            ? referral.manager.name
                                            : ' Pick a Manager or CE'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Row>
                    </View>
                </View>
            )}
        </Animated.View>
    )
}

export default CustomerInfoThirdScreen
