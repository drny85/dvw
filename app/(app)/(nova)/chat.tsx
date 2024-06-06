import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import GiftedChatScreen from '@/common/components/chats/GiftedChatScreen'
import { useChat } from '@/common/hooks/chats/useChat'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useLayoutEffect } from 'react'
import { KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'

const Chat = () => {
    const { chatId } = useLocalSearchParams<{ chatId: string }>()
    const navigation = useNavigation()
    const { chat, loading } = useChat(chatId)
    const bgColor = useThemeColor('accent')
    const textColor = useThemeColor('text')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text
                    fontFamily="QSBold"
                    color="white"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    fontSize={22}
                >
                    {chat?.name}
                </Text>
            ),

            headerStyle: {
                backgroundColor: bgColor
            },
            headerBackTitleStyle: {
                color: textColor
            },

            headerLeft:
                Platform.OS === 'ios'
                    ? () => {
                          return (
                              <TouchableOpacity
                                  onPress={() => router.back()}
                                  style={{ padding: SIZES.base }}
                              >
                                  <FontAwesome
                                      name="chevron-left"
                                      size={24}
                                      color={'#ffffff'}
                                  />
                              </TouchableOpacity>
                          )
                      }
                    : undefined
        })
    }, [navigation, chat?.name, bgColor])

    useStatusBarColor('light')

    if (loading) return <Loading />

    // const { topic, createdAt, messages }
    return (
        <Screen>
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1 }}
                keyboardVerticalOffset={100}
            >
                <GiftedChatScreen chatId={chatId} />
            </KeyboardAvoidingView>
        </Screen>
    )
}

export default Chat
