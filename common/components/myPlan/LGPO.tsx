import { TouchableOpacity } from 'react-native'

import { MotiView } from 'moti'
import { SIZES } from '@/constants/Sizes'
import { setShowInfo } from '@/features/wireless/wirelessSlide'
import { WELCOME_OFFER_EXPIRATION_DATE } from '@/constants'
import View from '../View'
import Text from '../Text'
import { FontAwesome } from '@expo/vector-icons'
import useAppDispatch from '@/common/hooks/useAppDispatch'

const LGPO = () => {
    const dispatch = useAppDispatch()
    return (
        <MotiView
            style={{
                position: 'absolute',
                left: 10,
                right: 10,
                borderRadius: SIZES.radius,
                top: 20,
                bottom: 20,
                zIndex: 200,
                padding: SIZES.padding,

                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'timing' }}
        >
            <Text
                style={{ marginRight: 20 }}
                center
                fontFamily="SFBold"
                fontSize={18}
            >
                Local Growth Pricing Offer
            </Text>

            <View style={{ padding: 10, gap: 10 }}>
                <Text>1 Line on Welcome Unlimited, $10 off</Text>
                <Text>2 Lines on Welcome Unlimited, $15 off</Text>
                <Text>3 Lines on Welcome Unlimited, $20 off</Text>
                <View style={{ padding: 10 }}>
                    <Text center fontFamily="QSLight">
                        Offer set to end on {WELCOME_OFFER_EXPIRATION_DATE}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => {
                    dispatch(setShowInfo(false))
                }}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    height: 28,
                    width: 28,
                    borderRadius: 14,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'grey'
                }}
            >
                <FontAwesome name="close" size={22} color={'#ffffff'} />
            </TouchableOpacity>
        </MotiView>
    )
}

export default LGPO
