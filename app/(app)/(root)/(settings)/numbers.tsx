import Row from '@/common/components/Row'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { CONTACT_NUMBERS } from '@/utils/contactsData'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { Alert, ScrollView, TouchableOpacity } from 'react-native'
import Communications from 'react-native-communications'
import * as Clipboard from 'expo-clipboard'

const UsefulNumbers = () => {
    const onPressCall = async (number: string) => {
        try {
            Communications.phonecall(number, true)
        } catch (error) {
            console.log(error)
        }
    }
    const bgColor = useThemeColor('background')

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.padding
                }}
            >
                {CONTACT_NUMBERS.sort((a, b) => (a.name > b.name ? 1 : -1)).map(
                    (c) => (
                        <TouchableOpacity
                            key={c.name}
                            onLongPress={async () => {
                                await Clipboard.setStringAsync(c.number)
                                Alert.alert('Copied to clipboard')
                            }}
                        >
                            <CallLine
                                title={c.name}
                                number={c.number}
                                onPress={() =>
                                    onPressCall(c.number.replace(/[^0-9]/g, ''))
                                }
                            />
                        </TouchableOpacity>
                    )
                )}
            </ScrollView>
        </View>
    )
}

export default UsefulNumbers

type Props = {
    onPress: () => void
    title: string
    number: string
}
const CallLine = ({ onPress, title, number }: Props) => {
    const iconColor = useThemeColor('text')
    return (
        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
                <Text fontFamily="SFBold">{title}</Text>
                <Text fontFamily="SFRegular" fontSize={13}>
                    {number}
                </Text>
            </View>
            <TouchableOpacity style={{ padding: SIZES.base }} onPress={onPress}>
                <FontAwesome name="phone" size={24} color={iconColor} />
            </TouchableOpacity>
        </Row>
    )
}
