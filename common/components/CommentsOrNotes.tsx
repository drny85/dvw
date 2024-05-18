import { SIZES } from '@/constants/Sizes'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import useThemeColor from '../hooks/useThemeColor'
import Text from './Text'
import View from './View'

import Styles from '@/constants/Styles'
import { FontAwesome } from '@expo/vector-icons'
import Row from './Row'

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
            <TouchableOpacity
                style={styles.comment}
                onPress={() => {
                    setVisible(true)
                }}
            >
                <Text>{comment || ''}</Text>
            </TouchableOpacity>
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
