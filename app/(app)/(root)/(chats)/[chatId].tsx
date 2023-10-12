import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import SwipeableItem from '@/common/components/Swipeable'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import MessageRow from '@/common/components/chats/MessageRow'
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

    const handleSendMessage = async () => {
        try {
            const newMessage: Message = {
                body: message,
                createdAt: new Date().toISOString(),
                chatId: chatId,
                isReply: isReply,
                reply: isReply && replyMessage ? replyMessage : null,
                sender: user!,
                type: 'text',
                storagePath: null
            }
            dispatch(sendMessage(newMessage))
            setMessage('')
            if (isReply && replyMessage) {
                await closeRow(replyMessage?.id!)
                setIsReply(false)
            }
        } catch (error) {
            console.log('Error sending message', error)
        }
    }

    const closeRow = async (id: string) => {
        if (!id) return
        await rowRefs.get(id).close(true)
        rowRefs.delete(id)
        setOpened(null)
        setReplyMessage(null)
        setIsReply(false)
    }

    const onDeleteMessage = async (id: string) => {
        try {
            if (!id) return
            console.log('deleted message', id)
            dispatch(deleteMessage(id))
            await rowRefs.get(id).close(true)
            rowRefs.delete(id)
            setOpened(null)
            flatListRef.current?.scrollToEnd({ animated: true })
        } catch (error) {
            console.log('Error deleting message', error)
        }
    }
    const renderMessages: ListRenderItem<Message> = ({ item }) => {
        return (
            <MotiView
                from={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'timing', duration: 300 }}
            >
                <SwipeableItem
                    onRightIconPress={() => {
                        onDeleteMessage(item.id!)
                    }}
                    onReplyPress={() => {
                        setIsReply(true)
                        setOpened(null)
                        rowRefs.delete(item.id)
                        setReplyMessage(item)
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
                    <MessageRow item={item} />
                </SwipeableItem>
            </MotiView>
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
                keyboardVerticalOffset={80}
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
                    <>
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            scrollEnabled
                            keyExtractor={(items) => items.id!}
                            renderItem={renderMessages}
                            keyboardDismissMode="on-drag"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                padding: SIZES.base,
                                marginBottom: 20,
                                gap: SIZES.padding * 3
                            }}
                            onContentSizeChange={(w, h) => {
                                console.log('content size change', w, h)
                                flatListRef.current?.scrollToEnd({
                                    animated: true
                                })
                            }}
                        />

                        <View>
                            <AnimatePresence>
                                {isReply && replyMessage && (
                                    <MotiView
                                        from={{ opacity: 0, translateX: -200 }}
                                        exit={{ opacity: 0, translateX: -200 }}
                                        animate={{ opacity: 1, translateX: 0 }}
                                        transition={{
                                            type: 'timing',
                                            duration: 300
                                        }}
                                        style={{
                                            padding: 10,
                                            backgroundColor: '#59965e',
                                            borderRadius: SIZES.radius,
                                            alignSelf: 'flex-start',
                                            position: 'absolute',
                                            bottom: 54,
                                            width: '80%'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                position: 'absolute',
                                                top: -25,
                                                left: 6,
                                                opacity: 0.6
                                            }}
                                        >
                                            reply to{' '}
                                            {
                                                replyMessage?.sender.name.split(
                                                    ' '
                                                )[0]
                                            }
                                        </Text>
                                        <Text color="white">
                                            {replyMessage?.body}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                await closeRow(replyMessage.id!)
                                            }}
                                            style={{
                                                position: 'absolute',
                                                right: -10,
                                                top: -10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 20,
                                                height: 20,
                                                borderRadius: 10,

                                                backgroundColor: iconColor
                                            }}
                                        >
                                            <FontAwesome
                                                name="close"
                                                size={16}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                    </MotiView>
                                )}
                            </AnimatePresence>

                            <Row
                                style={{
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    gap: SIZES.padding,
                                    height: 52,
                                    bottom: 0,
                                    marginTop: 10,
                                    paddingHorizontal: SIZES.base
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{
                                            borderWidth: 0,
                                            backgroundColor: 'lightgrey',
                                            color: '#212121'
                                        }}
                                        placeholder="Type a message"
                                        multiline={true}
                                        value={message}
                                        onSubmitEditing={handleSendMessage}
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
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Screen>
    )
}

export default Chat

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
