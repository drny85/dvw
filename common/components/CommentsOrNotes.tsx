import { SIZES } from '@/constants/Sizes'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import useThemeColor from '../hooks/useThemeColor'
import Text from './Text'
import View from './View'

import Styles from '@/constants/Styles'
import { FontAwesome } from '@expo/vector-icons'
import Row from './Row'
import { ReferralComment } from '@/types'

type Props = {
    comments: ReferralComment[]
    onOpen: () => void
    // setVisible: (visible: boolean) => void
}

const CommentsOrNotes = ({ comments, onOpen }: Props) => {
    const backgroundColor = useThemeColor('background')
    const textColor = useThemeColor('text')

    return (
        <View style={[Styles.boxShadow, styles.container, { backgroundColor }]}>
            <Row style={{ justifyContent: 'space-between' }}>
                <Text>Comments Or Notes</Text>
                <TouchableOpacity onPress={onOpen}>
                    <Row style={{ gap: SIZES.base }}>
                        <Text style={{ marginLeft: SIZES.base }}>Edit</Text>
                        <FontAwesome name="edit" size={22} color={textColor} />
                    </Row>
                </TouchableOpacity>
            </Row>
            <TouchableOpacity style={styles.comment} onPress={onOpen}>
                {comments?.map((comment, index) => (
                    <View key={index}>
                        <Text color="grey">{comment.message}</Text>
                        <Text color="grey" fontSize={11}>{`${
                            getMonthDayTime(comment.timestamp).month
                        }/${getMonthDayTime(comment.timestamp).day} at ${
                            getMonthDayTime(comment.timestamp).time
                        }`}</Text>
                        <Text color="grey" fontSize={11}>
                            ---
                        </Text>
                    </View>
                ))}
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
        padding: SIZES.base,
        gap: SIZES.base
    }
})

function getMonthDayTime(dateString: string) {
    const date = new Date(dateString)

    const month = date.toLocaleString('en-US', { month: '2-digit' })
    const day = date.getDate()
    const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })

    return {
        month,
        day,
        time
    }
}
