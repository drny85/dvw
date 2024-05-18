import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Text from './Text'
import View from './View'
import { SIZES } from '@/constants/Sizes'
import useThemeColor from '../hooks/useThemeColor'

import Row from './Row'
import { FontAwesome } from '@expo/vector-icons'
import Styles from '@/constants/Styles'

type Props = {
    comment: string
    setVisible: (visible: boolean) => void
}

const CommentsOrNotes = ({ comment, setVisible }: Props) => {
    const backgroundColor = useThemeColor('background')
    const textColor = useThemeColor('text')
    return (
        <View style={[Styles.boxShadow, styles.container, { backgroundColor }]}>
            <Row style={{ justifyContent: 'space-between' }}>
                <Text>Comments Or Notes</Text>
                <TouchableOpacity
                    onPress={() => {
                        setVisible(true)
                    }}
                >
                    <Row style={{ gap: SIZES.base }}>
                        <Text style={{ marginLeft: SIZES.base }}>Edit</Text>
                        <FontAwesome name="edit" size={22} color={textColor} />
                    </Row>
                </TouchableOpacity>
            </Row>
            <View style={styles.comment}>
                <Text>{comment || ''}</Text>
            </View>
        </View>
    )
}

export default CommentsOrNotes

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        gap: SIZES.base
    },
    comment: {
        borderRadius: SIZES.base,
        borderColor: 'grey',
        borderWidth: 0.5,
        padding: SIZES.base
    }
})
