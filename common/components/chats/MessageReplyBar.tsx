import useThemeColor from '@/common/hooks/useThemeColor'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Text from '../Text'
import View from '../View'
import { Msg } from './GiftedChatScreen'
import { SIZES } from '@/constants/Sizes'

type ReplyMessageBarProps = {
    clearReply: () => void
    message: Msg | null
}

const ReplyMessageBar = ({ clearReply, message }: ReplyMessageBarProps) => {
    const accent = useThemeColor('accent')
    return (
        <View>
            <Text
                style={{ marginLeft: SIZES.padding, marginTop: SIZES.base }}
                fontFamily="QSBold"
                fontSize={12}
                color="grey"
            >
                To {message?.user.name}
            </Text>
            <View style={styles.container}>
                <View
                    style={[
                        styles.replyImageContainer,
                        { borderRightColor: accent }
                    ]}
                />

                <View style={[styles.messageContainer]}>
                    <Text fontFamily="QSLight" color="grey">
                        {message && message?.text!.length > 50
                            ? message?.text.substring(0, 50) + '...'
                            : message?.text}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.crossButton}
                    onPress={clearReply}
                >
                    <FontAwesome
                        name="close"
                        size={24}
                        color={accent}
                        style={{ marginRight: 6 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ReplyMessageBar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',

        height: 60
    },
    replyImage: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    replyImageContainer: {
        paddingLeft: 8,
        paddingRight: 6,
        borderRightWidth: 2,

        marginRight: 6,
        height: '100%',
        justifyContent: 'center'
    },

    crossButton: {
        padding: 6
    },

    messageContainer: {
        flex: 1
    }
})
