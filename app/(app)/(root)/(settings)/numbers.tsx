import Header from '@/common/components/Header'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { CONTACT_NUMBERS } from '@/utils/contactsData'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import Communications from 'react-native-communications'

const UsefulNumbers = () => {
    const onPressCall = async (number: string) => {
        try {
            Communications.phonecall(number, true)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Screen>
            <Header title="Useful Numbers" onPressBack={router.back} />
            <ScrollView
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.padding
                }}
            >
                {CONTACT_NUMBERS.map((c) => (
                    <CallLine
                        key={c.name}
                        title={c.name}
                        number={c.number}
                        onPress={() =>
                            onPressCall(c.number.replace(/[^0-9]/g, ''))
                        }
                    />
                ))}
            </ScrollView>
        </Screen>
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
