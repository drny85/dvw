import { Message } from '@/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    BubbleProps,
    GiftedChat,
    IMessage,
    InputToolbar,
    InputToolbarProps,
    MessageProps,
    Send,
    SendProps
} from 'react-native-gifted-chat'
import useAppSelector from '../../hooks/useAppSelector'

import { useMessages } from '@/common/hooks/chats/useMessages'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useColorScheme from '@/common/hooks/useColorScheme'
import { SIZES } from '@/constants/Sizes'
import { sendMessage } from '@/features/chats/chatsActions'
import { analyzeTextForToxicity } from '@/utils/moderateMessage'
import { Alert, StyleSheet, ScrollView } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import Loading from '../Loading'
import Text from '../Text'
import View from '../View'
import ReplyMessageBar from './MessageReplyBar'
import ChatMessageBox from './MessageRow'
import { Ionicons } from '@expo/vector-icons'
import useThemeColor from '@/common/hooks/useThemeColor'
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated'

export type Msg = Message & IMessage

// type Props = {
//     messages: Msg[]
//     onSend: (messages: Msg[]) => void
// }
const GiftedChatScreen = ({ chatId }: { chatId: string }) => {
    const user = useAppSelector((s) => s.auth.user)
    const theme = useColorScheme()
    const [replyMessage, setReplyMessage] = useState<Msg | null>(null)
    const swipeableRowRef = useRef<Swipeable | null>(null)
    const dispatch = useAppDispatch()
    const sendIconColor = useThemeColor('accent')
    // const [messages, setMessages] = useState<Msg[]>([])
    const { messages, loading } = useMessages(chatId)

    const clearReplyMessage = () => setReplyMessage(null)

    const onSend = useCallback(
        async (messages: Msg[] = []) => {
            if (replyMessage) {
                messages[0].replyMessage = replyMessage
            }
            try {
                const res = await analyzeTextForToxicity(messages[0].text)

                if (res) {
                    Alert.alert('Message might not be appropriate')
                    return
                }
                const newMessage: Msg = messages[0]
                newMessage.chatId = chatId

                dispatch(sendMessage(newMessage))
                setReplyMessage(null)
            } catch (error) {
                console.log('Error sending message', error)
            }
            // setMessages((previousMessages) => {
            //     return GiftedChat.append(previousMessages, messages)
            // })
        },
        [replyMessage]
    )

    const renderCustomInputToolbar = (props: InputToolbarProps<any>) => (
        <InputToolbar
            {...props}
            containerStyle={styles.inputContainer}
            accessoryStyle={styles.replyBarContainer}
        />
    )

    const renderAccessory = () =>
        replyMessage && (
            <ReplyMessageBar
                message={replyMessage}
                clearReply={clearReplyMessage}
            />
        )

    const updateRowRef = useCallback(
        (ref: any) => {
            if (
                ref &&
                replyMessage &&
                ref.props.children.props.currentMessage?._id ===
                    replyMessage._id
            ) {
                swipeableRowRef.current = ref
            }
        },
        [replyMessage]
    )

    const renderMessageBox = (props: MessageProps<any>) => (
        <Animated.View
            entering={props.position === 'left' ? FadeInLeft : FadeInRight}
        >
            <ChatMessageBox
                {...props}
                containerStyle={{
                    right: {
                        marginVertical: SIZES.base
                    },
                    left: {
                        marginVertical: SIZES.base
                    }
                }}
                setReplyOnSwipeOpen={setReplyMessage}
                onDeleteSwipe={() => {}}
                onDeletePress={(id) => console.log(id)}
                updateRowRef={updateRowRef}
            />
        </Animated.View>
    )

    const renderSend = (props: SendProps<any>) => {
        return (
            <Send {...props}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: SIZES.base
                    }}
                >
                    <Ionicons name="send" size={26} color={sendIconColor} />
                </View>
            </Send>
        )
    }

    const renderReplyMessageView = (props: BubbleProps<Msg>) =>
        props.currentMessage &&
        props.currentMessage.replyMessage && (
            <View style={styles.replyMessageContainer}>
                <Text
                    color={theme === 'light' ? 'black' : 'text'}
                    fontFamily="QSLight"
                >
                    {props.currentMessage.replyMessage.text}
                </Text>
                <View style={styles.replyMessageDivider} />
            </View>
        )

    useEffect(() => {
        if (replyMessage && swipeableRowRef.current) {
            swipeableRowRef.current.close()
            swipeableRowRef.current = null
        }
    }, [replyMessage])

    if (loading) return <Loading />

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages: Msg[]) => onSend(messages)}
            user={{
                _id: user?.id!,
                name: user?.name,
                avatar: user?.image || ''
            }}
            textInputProps={styles.composer}
            isKeyboardInternallyHandled={false}
            renderInputToolbar={renderCustomInputToolbar}
            renderAccessory={renderAccessory}
            renderSend={renderSend}
            messagesContainerStyle={styles.messagesContainer}
            renderMessage={renderMessageBox}
            renderCustomView={renderReplyMessageView}
        />
    )
}

export default GiftedChatScreen
const styles = StyleSheet.create({
    inputContainer: {
        position: 'relative',
        flexDirection: 'column-reverse',
        borderRadius: SIZES.radius * 2,
        marginHorizontal: SIZES.base
    },
    composer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    replyBarContainer: {
        height: 'auto'
    },
    messagesContainer: {
        flex: 1
    },
    replyMessageContainer: {
        padding: 8,
        paddingBottom: 0
    },
    replyMessageDivider: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        paddingTop: 6
    }
})
