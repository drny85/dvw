import { FlatList, TouchableOpacity } from 'react-native'
import { Referral } from '@/types'
import {
    GooglePlacesAutocomplete,
    GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete'
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated'
import { SIZES } from '@/constants/Sizes'
import View from '../View'
import Text from '../Text'
import useThemeColor from '@/common/hooks/useThemeColor'
import { AnimatePresence, MotiView } from 'moti'
import TextInput from '../TextInput'
import Row from '../Row'
import Styles from '@/constants/Styles'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_KEY as string

type Props = {
    googleRef: React.RefObject<GooglePlacesAutocompleteRef>

    setAddress: React.Dispatch<React.SetStateAction<string>>
    address: string
    referral: Referral
    setReferral: React.Dispatch<React.SetStateAction<Referral>>
    setShowMoveIn: React.Dispatch<React.SetStateAction<boolean>>
    editing: boolean
    setShowReferees: React.Dispatch<React.SetStateAction<boolean>>
    isReferral: boolean
    moveIn: string | null
}

const ReferralInfoSecondScreen = ({
    googleRef,
    address,

    editing,
    isReferral,
    moveIn,
    referral,
    setAddress,
    setReferral,
    setShowMoveIn,
    setShowReferees
}: Props) => {
    const placeholderTextColor = useThemeColor('placeholder')
    const textColor = useThemeColor('text')
    const bgColor = useThemeColor('background')
    return (
        <Animated.View
            entering={SlideInLeft.duration(600)}
            exiting={SlideOutRight.duration(500)}
            style={{
                flex: 1,

                padding: SIZES.base,
                gap: SIZES.padding
            }}
        >
            <View>
                <Text
                    fontFamily="SFBold"
                    style={{
                        margin: SIZES.base
                    }}
                >
                    Customer's Address
                </Text>
                <FlatList
                    data={[]}
                    horizontal
                    renderItem={() => <></>}
                    contentContainerStyle={{ width: '100%' }}
                    ListHeaderComponentStyle={{ width: '100%' }}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        <GooglePlacesAutocomplete
                            ref={googleRef}
                            nearbyPlacesAPI="GooglePlacesSearch"
                            keyboardShouldPersistTaps="handled"
                            placeholder="Type Customer's Address"
                            fetchDetails={true}
                            minLength={2}
                            styles={{
                                container: {
                                    flex: 0,
                                    paddingHorizontal: 4,
                                    width: '100%'
                                },
                                textInput: {
                                    borderRadius: SIZES.radius * 2,
                                    backgroundColor: bgColor,
                                    borderWidth: 0.5,
                                    paddingVertical: SIZES.base * 1.5,
                                    borderColor: placeholderTextColor,
                                    color: textColor
                                },
                                textInputContainer: {
                                    backgroundColor: bgColor
                                },
                                row: {
                                    backgroundColor: bgColor
                                },
                                description: {
                                    color: textColor
                                }
                            }}
                            textInputProps={{
                                placeholderTextColor: placeholderTextColor
                            }}
                            query={{
                                key: GOOGLE_KEY,
                                language: 'en', // language of the results
                                components: 'country:us'
                            }}
                            enablePoweredByContainer={false}
                            debounce={500}
                            onPress={(data, details) => {
                                if (details?.formatted_address) {
                                    setAddress(details?.formatted_address)
                                    setReferral({
                                        ...referral,
                                        address: details?.formatted_address!
                                    })
                                }
                            }}
                        />
                    }
                />
                {editing && (
                    <Text color="grey" style={{ marginLeft: SIZES.padding }}>
                        {address}
                    </Text>
                )}
            </View>
            <AnimatePresence>
                {address.length > 0 && (
                    <MotiView
                        style={{ gap: SIZES.padding }}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -20 }}
                    >
                        <View>
                            <Text
                                fontFamily="SFBold"
                                style={{
                                    margin: SIZES.base
                                }}
                            >
                                Apt, Suite, Flr
                            </Text>
                            <TextInput
                                placeholder="Apt, Suite, FLR"
                                value={referral.apt!}
                                onChangeText={(text) =>
                                    setReferral({
                                        ...referral,
                                        apt: text.toUpperCase()
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
                                Property's Name
                            </Text>
                            <TextInput
                                placeholder="Ex, The Avalon"
                                value={referral.propertyName}
                                autoCapitalize="words"
                                onChangeText={(text) =>
                                    setReferral({
                                        ...referral!,
                                        propertyName: text
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
                                Moving Date
                            </Text>
                            <Row
                                style={{
                                    width: '100%',
                                    ...Styles.boxShadow,
                                    backgroundColor: placeholderTextColor,
                                    padding: SIZES.base * 1.5,
                                    borderRadius: SIZES.radius * 2
                                }}
                            >
                                <FontAwesome
                                    name="calendar"
                                    color={'white'}
                                    size={24}
                                    style={{
                                        marginHorizontal: SIZES.base
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowMoveIn(true)}
                                >
                                    <Text color="white" fontFamily="SFBold">
                                        {moveIn
                                            ? moment(moveIn).format(
                                                  'dddd Do, MMM YYYY'
                                              )
                                            : 'Pick a Moving Date'}
                                    </Text>
                                </TouchableOpacity>
                            </Row>
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
                                        Referred By
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setShowReferees(true)}
                                    >
                                        <Row
                                            style={{
                                                width: '100%',
                                                ...Styles.boxShadow,
                                                backgroundColor:
                                                    placeholderTextColor,
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
                                                <Text
                                                    fontFamily="SFBold"
                                                    color="white"
                                                >
                                                    {referral.referee
                                                        ? referral.referee.name
                                                        : 'Pick a Referred By'}
                                                </Text>
                                            </View>
                                        </Row>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </MotiView>
                )}
            </AnimatePresence>
        </Animated.View>
    )
}

export default ReferralInfoSecondScreen
