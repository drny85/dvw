import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import SwipeableItem from '@/common/components/Swipeable'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import { useChat } from '@/common/hooks/chats/useChat'
import { useMessages } from '@/common/hooks/chats/useMessages'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { deleteMessage, sendMessage } from '@/features/chats/chatsActions'
import { Message } from '@/types'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'
import React, { useRef, useState } from 'react'
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    ListRenderItem,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'

const Chat = () => {
    const flatListRef = useRef<FlatList>(null)
    const { chatId } = useLocalSearchParams<{ chatId: string }>()
    const [opened, setOpened] = useState<string | null>(null)
    let rowRefs = new Map()
    const disabled = useAppSelector((s) => s.chats.loading)
    const user = useAppSelector((s) => s.auth.user)
    const { chat, loading } = useChat(chatId)
    const { loading: loadingMessages, messages } = useMessages(chatId)
    const [message, setMessage] = useState('')
    const [replyMessage, setReplyMessage] = useState<Message | null>(null)
    const [isReply, setIsReply] = useState(false)
    const iconColor = useThemeColor('text')
    const dispatch = useAppDispatch()
    const senderColor = useThemeColor('secondary')
    const receiverColor = useThemeColor('primary')

    const handleSendMessage = () => {
        try {
            const newMessage: Message = {
                body: message,
                createdAt: new Date().toISOString(),
                chatId: chatId,
                isReply: false,
                reply: isReply && replyMessage ? replyMessage : null,
                sender: user!,
                type: 'text',
                storagePath: null
            }
            dispatch(sendMessage(newMessage))
            setMessage('')
        } catch (error) {
            console.log('Error sending message', error)
        }
    }

    const onDeleteMessage = async (id: string) => {
        try {
            if (!id || !isReply) return
            console.log('deleted message', id)
            dispatch(deleteMessage(id))
            await rowRefs.get(id).close(true)
            rowRefs.delete(id)
            setOpened(null)
        } catch (error) {
            console.log('Error deleting message', error)
        }
    }
    const renderMessages: ListRenderItem<Message> = ({ item }) => {
        return (
            <SwipeableItem
                onSwipeableOpen={() => {}}
                onRightIconPress={() => {
                    onDeleteMessage(item.id!)
                }}
                onReplyPress={() => {
                    setIsReply(true)
                    setOpened(null)
                    rowRefs.delete(item.id)
                    //setReplyMessage(item)
                }}
                onSwipeableClose={() => {
                    setReplyMessage(null)
                    setIsReply(false)
                    setOpened(null)
                }}
                isReplying={item.sender.id !== user?.id}
                rigthIconName={
                    item.sender.id === user?.id ? 'trash' : undefined
                }
                ref={(ref: any) => {
                    if (ref && !rowRefs.get(item.id)) {
                        rowRefs.set(item.id, ref)
                    }
                }}
                onSwipeableWillOpen={() => {
                    setOpened(item.id!)
                    ;[...rowRefs.entries()].forEach(([key, ref]) => {
                        if (key !== item.id && ref) ref.close()
                    })
                }}
            >
                <MotiView
                    from={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing' }}
                >
                    <View
                        style={[
                            styles.message,
                            {
                                backgroundColor:
                                    item.sender.id === user?.id
                                        ? senderColor
                                        : receiverColor,
                                alignSelf:
                                    item.sender.id === user?.id
                                        ? 'flex-end'
                                        : 'flex-start'
                            }
                        ]}
                    >
                        <View style={styles.sender}>
                            <Text capitalize color="grey" fontSize={12}>
                                {item.sender.name}
                            </Text>
                        </View>
                        <Text>{item.body}</Text>
                        <View style={styles.timestamp}>
                            <Text capitalize color="grey" fontSize={10}>
                                {moment(item.createdAt).format('lll')}
                            </Text>
                        </View>
                    </View>
                </MotiView>
            </SwipeableItem>
        )
    }

    if (loading || loadingMessages) return <Loading />

    // const { topic, createdAt, messages }
    return (
        <Screen>
            <Header title={chat?.name} onPressBack={router.back} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={60}
                contentContainerStyle={{ flex: 1, marginBottom: 20 }}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss()
                        if (opened) {
                            setIsReply(false)
                            setReplyMessage(null)
                            setOpened(null)

                            rowRefs.get(opened)?.close()
                        }
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            paddingHorizontal: SIZES.base
                        }}
                    >
                        <View>
                            <FlatList
                                data={messages}
                                keyExtractor={(items) =>
                                    items.id! + items.createdAt
                                }
                                renderItem={renderMessages}
                                showsVerticalScrollIndicator={false}
                                keyboardDismissMode="on-drag"
                                contentContainerStyle={{
                                    padding: SIZES.padding,
                                    marginTop: SIZES.padding,
                                    gap: SIZES.padding * 3
                                }}
                                onContentSizeChange={() => {
                                    flatListRef.current?.scrollToEnd({
                                        animated: true
                                    })
                                }}
                            />
                        </View>
                        <View>
                            <AnimatePresence>
                                {isReply && replyMessage && (
                                    <MotiView
                                        style={{
                                            position: 'absolute',
                                            top: -SIZES.padding * 2,

                                            width: '100%',
                                            paddingHorizontal: SIZES.padding
                                        }}
                                        from={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'timing' }}
                                    >
                                        <Row
                                            style={{
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Text>
                                                reply to {replyMessage.body}
                                            </Text>
                                            <FontAwesome
                                                onPress={() => {
                                                    rowRefs.delete(
                                                        replyMessage.id
                                                    )
                                                    setIsReply(false)
                                                    setReplyMessage(null)
                                                    setOpened(null)
                                                }}
                                                name="close"
                                                size={20}
                                                color={iconColor}
                                            />
                                        </Row>
                                    </MotiView>
                                )}
                                <MotiView></MotiView>
                            </AnimatePresence>
                            <Row
                                style={{
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    gap: SIZES.padding
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        placeholder="Type a message"
                                        multiline={true}
                                        value={message}
                                        onChangeText={setMessage}
                                    />
                                </View>
                                <TouchableOpacity
                                    disabled={disabled || message.length < 2}
                                    onPress={handleSendMessage}
                                >
                                    <Ionicons
                                        name="ios-send"
                                        size={30}
                                        color={
                                            disabled || message.length < 2
                                                ? 'grey'
                                                : iconColor
                                        }
                                    />
                                </TouchableOpacity>
                            </Row>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Screen>
    )
}

export default Chat

const styles = StyleSheet.create({
    message: {
        borderRadius: SIZES.radius,
        width: SIZES.width * 0.7,
        padding: SIZES.base
    },
    sender: {
        position: 'absolute',
        top: -SIZES.padding * 1.5,
        left: SIZES.base
    },
    timestamp: {
        position: 'absolute',
        bottom: -SIZES.padding,
        right: SIZES.base
    }
})
