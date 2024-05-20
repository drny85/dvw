import { TouchableOpacity } from 'react-native'
import React from 'react'
import Row from '../Row'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import Text from '../Text'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'

type Props = {
    index: number
}

const ReferralHeader = ({ index }: Props) => {
    const textColor = useThemeColor('text')
    return (
        <Row
            style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: SIZES.padding,
                marginVertical: SIZES.base
            }}
        >
            {index === 0 ? (
                <TouchableOpacity
                    onPress={() => {
                        router.back()
                    }}
                >
                    <FontAwesome
                        name="chevron-left"
                        size={26}
                        color={textColor}
                    />
                </TouchableOpacity>
            ) : (
                <Text />
            )}
            <Text center fontFamily="SFBold" fontSize={18}>
                {index === 0
                    ? 'Main Info'
                    : index === 2
                    ? "Customer's Info"
                    : 'Referral Info'}
            </Text>
            {index !== 0 ? (
                <TouchableOpacity onPress={router.back}>
                    <FontAwesome name="close" size={26} color={textColor} />
                </TouchableOpacity>
            ) : (
                <Text />
            )}
        </Row>
    )
}

export default ReferralHeader
