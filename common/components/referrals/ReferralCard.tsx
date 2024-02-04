import { StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Styles from '@/constants/Styles'
import { router } from 'expo-router'
import Text from '../Text'
import View from '../View'
import moment from 'moment'
import { Referral } from '@/types'
import { SIZES } from '@/constants/Sizes'
import Row from '../Row'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { setReferralId } from '@/features/referrals/referralsSlide'

type Props = {
    item: Referral
    bgColor: string
}

const ReferralCard = ({ item, bgColor }: Props) => {
    const dispatch = useAppDispatch()
    return (
        <TouchableOpacity
            style={[
                Styles.boxShadow,
                styles.card,
                ,
                { backgroundColor: bgColor }
            ]}
            onPress={() => {
                dispatch(setReferralId(item.id!))
                router.push(`/(app)/(modals)/${item.id}`)
            }}
        >
            <Text
                style={{ marginBottom: SIZES.base }}
                center
                fontFamily="SFBold"
            >
                {item.name}
            </Text>
            <View style={{ gap: SIZES.base }}>
                <Text fontFamily="QSLight">
                    {item.address.slice(0, item.address.length - 5)}
                </Text>
                <Text fontFamily="QSLight">Apt / Unit or FLR: {item.apt}</Text>
                <Row style={{ justifyContent: 'space-between' }}>
                    <Text fontFamily="QSBold">
                        Move In:{' '}
                        <Text fontFamily="QSLight">
                            {moment(item.moveIn).format('LL')}
                        </Text>
                    </Text>
                    <Text fontFamily="QSLight">
                        ({moment(item.moveIn).fromNow()})
                    </Text>
                </Row>
            </View>
            {item.status.id === 'closed' && (
                <Row
                    style={{
                        justifyContent: 'space-between',
                        marginTop: SIZES.base
                    }}
                >
                    <Text fontFamily="QSBold">
                        Closed On:{' '}
                        <Text fontFamily="QSLight">
                            {moment(item.order_date).format('lll')}
                        </Text>
                    </Text>

                    <Text fontFamily="QSLight">
                        ({moment(item.moveIn).fromNow()})
                    </Text>
                </Row>
            )}
            {item.followUpOn && (
                <Text style={{ marginTop: SIZES.base }}>
                    Follow Up On: {moment(item.followUpOn).format('lll')}
                </Text>
            )}
            <Text center style={{ marginTop: SIZES.base }}>
                Status: {item.status.name}
            </Text>
        </TouchableOpacity>
    )
}

export default ReferralCard

const styles = StyleSheet.create({
    card: {
        padding: SIZES.base,
        borderRadius: SIZES.radius
    }
})
