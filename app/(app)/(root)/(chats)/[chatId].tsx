import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import GiftedChatScreen from '@/common/components/chats/GiftedChatScreen'
import { useChat } from '@/common/hooks/chats/useChat'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { deleteMessage } from '@/features/chats/chatsActions'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useLayoutEffect } from 'react'
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

const Chat = () => {
    const { chatId } = useLocalSearchParams<{ chatId: string }>()
    const navigation = useNavigation()
    const { chat, loading } = useChat(chatId)
    const bgColor = useThemeColor('background')
    const iconColor = useThemeColor('text')
    const dispatch = useAppDispatch()
    const onDeleteMessage = async (id: string) => {
        try {
            if (!id) return
            console.log('deleted message', id)
            dispatch(deleteMessage(id))
            // await rowRefs.get(id).close(true)
            // rowRefs.delete(id)
            // setOpened(null)
            // flatListRef.current?.scrollToEnd({ animated: true })
        } catch (error) {
            console.log('Error deleting message', error)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text fontFamily="QSBold" fontSize={22}>
                    {chat?.name}
                </Text>
            ),
            headerStyle: {
                backgroundColor: bgColor
            },
            headerLeft: () => {
                return (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ padding: SIZES.base }}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={24}
                            color={iconColor}
                        />
                    </TouchableOpacity>
                )
            }
        })
    }, [navigation, chat?.name, bgColor])

    if (loading) return <Loading />

    // const { topic, createdAt, messages }
    return (
        <Screen>
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1 }}
                keyboardVerticalOffset={110}
            >
                <GiftedChatScreen
                    chatId={chatId}
                    // messages={[...messagees]}
                    // onSend={(messages) => {
                    //     const { _id, text, createdAt } = messages[0]
                    //     setMessages((prev) => [messages[0], ...prev])
                    //     //handleSendMessage(text, _id, createdAt)
                    // }}
                />
            </KeyboardAvoidingView>

            {/* <Header title={chat?.name} onPressBack={router.back} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={60}
                contentContainerStyle={{ flex: 1, marginBottom: 10 }}
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
                                    marginVertical: 10,
                                    paddingHorizontal: SIZES.padding
                                }}
                            >
                                <View
                                    style={{
                                        width: '90%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <TextInput
                                        style={{
                                            borderWidth: 0,
                                            backgroundColor: 'lightgrey',
                                            color: '#212121',
                                            width: '100%',
                                            borderRadius: SIZES.radius * 2,
                                            minHeight: 45,
                                            paddingVertical: 8,
                                            alignItems: 'center'
                                        }}
                                        textAlign={
                                            message.length > 0
                                                ? 'left'
                                                : 'center'
                                        }
                                        placeholder="Type a message"
                                        isMultiline={true}
                                        value={message}
                                        onSubmitEditing={() =>
                                            handleSendMessage(message)
                                        }
                                        onChangeText={setMessage}
                                    />
                                </View>
                                <TouchableOpacity
                                    disabled={disabled || message.length < 2}
                                    onPress={() => handleSendMessage(message)}
                                >
                                    <Ionicons
                                        name="send"
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
            </KeyboardAvoidingView> */}
        </Screen>
    )
}

export default Chat
