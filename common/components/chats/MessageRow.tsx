import { Image, StyleSheet } from 'react-native'
import React from 'react'
import Row from '../Row'
import { Message } from '@/types'
import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'
import useThemeColor from '@/common/hooks/useThemeColor'
import View from '../View'
import Text from '../Text'
import moment from 'moment'

type Props = {
    item: Message
}

const MessageRow = ({ item }: Props) => {
    const user = useAppSelector((s) => s.auth.user)
    const receiverColor = useThemeColor('grey')
    const bgColor = useThemeColor('background')
    return (
        <Row
            style={{
                alignSelf:
                    item.sender.id === user?.id ? 'flex-end' : 'flex-start'
            }}
        >
            <Image
                source={
                    item.sender.image
                        ? { uri: item.sender.image }
                        : require('@/assets/images/profile.jpg')
                }
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    resizeMode: 'cover',
                    marginRight: SIZES.base
                }}
            />
            <View
                style={[
                    styles.message,
                    {
                        backgroundColor:
                            item.sender.id === user?.id
                                ? '#0077b6'
                                : receiverColor
                    }
                ]}
            >
                <View style={[styles.senderName]}>
                    <Text
                        style={{ opacity: 0.6 }}
                        fontFamily="SFBold"
                        fontSize={12}
                    >
                        {item.sender.id === user?.id ? 'Me' : item.sender.name}
                    </Text>
                </View>
                {item.isReply && (
                    <View>
                        <Text fontFamily="QSBold" fontSize={12} color="white">
                            {item.sender.name}
                        </Text>
                        <View
                            style={{
                                padding: SIZES.base,
                                borderWidth: 1,
                                marginVertical: SIZES.base,
                                borderColor: 'grey',
                                backgroundColor: bgColor,
                                borderRadius: SIZES.radius
                            }}
                        >
                            <Text fontSize={16} color={'text'}>
                                {item.reply?.body}
                            </Text>
                        </View>

                        <Text fontSize={16} color={'white'}>
                            {item.body}
                        </Text>
                    </View>
                )}

                <Text fontSize={16} color={'white'}>
                    {item.body}
                </Text>

                <View style={styles.timestamp}>
                    <Text fontSize={10} color="white">
                        {moment(item.createdAt).format('lll')}
                    </Text>
                </View>
            </View>
        </Row>
    )
}

export default MessageRow

const styles = StyleSheet.create({
    message: {
        borderRadius: SIZES.radius,
        width: SIZES.width * 0.6,
        padding: SIZES.base
    },

    timestamp: {
        //position: 'absolute',

        alignSelf: 'flex-end',
        marginTop: SIZES.base
    },
    senderName: {
        position: 'absolute',
        top: -20,
        left: 6
    }
})
