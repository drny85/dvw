import { SIZES } from '@/constants/Sizes'
import React from 'react'
import { Image, ImageSourcePropType, StyleSheet } from 'react-native'
import View from '../View'

type Props = {
    image: ImageSourcePropType
}
const PlanCard = ({ image }: Props) => {
    return (
        <View style={[styles.container]}>
            <Image style={styles.image} resizeMode="stretch" source={image} />
        </View>
    )
}

export default PlanCard

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radius * 2,
        overflow: 'hidden',
        width: '100%',
        height: SIZES.height * 0.5
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: SIZES.radius,
        overflow: 'hidden'
    }
})
