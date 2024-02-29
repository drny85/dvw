import Divider from '@/common/components/Divider'
import Loading from '@/common/components/Loading'
import Text from '@/common/components/Text'
import ChatList from '@/common/components/chats/ChatList'
import { useChats } from '@/common/hooks/chats/useChats'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { deleteChat } from '@/features/chats/chatsActions'
import { Chat } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router, useNavigation } from 'expo-router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import {
    Alert,
    FlatList,
    ListRenderItem,
    ScrollView,
    TouchableOpacity
} from 'react-native'

const ChatScreen = () => {
    const navigation = useNavigation()
    const bgColor = useThemeColor('background')
    const color = useThemeColor('text')
    const iconColor = useThemeColor('text')
    const dispatch = useAppDispatch()
    const user = useAppSelector((s) => s.auth.user)

    const { chats, loading } = useChats()
    const [data, setData] = useState<Chat[]>([])
    const [search, setSearch] = useState<string>('')
    const [showDelete, setShowDelete] = useState<boolean>(false)
    let rowRefs = new Map()
    const onDelete = async (id: string) => {
        try {
            Alert.alert(
                'Delete Chat',
                'Are you sure that you want to delete this chat?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Yes, Delete it',
                        style: 'destructive',
                        onPress: async () => {
                            dispatch(deleteChat(id))
                        }
                    }
                ]
            )
        } catch (error) {
            console.log(error)
        } finally {
            setShowDelete(false)
        }
    }

    const renderChats: ListRenderItem<Chat> = ({ item }) => {
        return (
            <ChatList
                iconColor={iconColor}
                item={item}
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                rowRefs={rowRefs}
                onDelete={onDelete}
            />
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLargeTitle: true,
            headerBlurEffect: 'regular',
            headerTransparent: true,
            title: 'Chats',
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: bgColor
            },

            headerLargeTitleStyle: {
                color
            },
            headerLeft: () => {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            setShowDelete((p) => !p)
                        }}
                        style={{ padding: SIZES.padding }}
                    >
                        <Text>{showDelete ? 'Done' : 'Edit'}</Text>
                    </TouchableOpacity>
                )
            },
            headerRight: () => {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            if (
                                user &&
                                user.acceptedEULA &&
                                user.acceptedEULA === true
                            ) {
                                router.push('/newChat')
                            } else {
                                router.push('/eula')
                            }
                        }}
                        style={{ padding: SIZES.padding }}
                    >
                        <FontAwesome name="plus" size={24} color={color} />
                    </TouchableOpacity>
                )
            },

            headerSearchBarOptions: {
                placeholder: 'Search',
                barTintColor: 'lightgrey',
                onChangeText(e: any) {
                    setSearch(e.nativeEvent.text)
                }
            }
        })
    }, [navigation, showDelete, bgColor])

    useEffect(() => {
        if (search) {
            setData(
                chats.filter((chat) =>
                    chat.name.toLowerCase().includes(search.toLowerCase())
                )
            )
        } else {
            setData(chats)
        }
    }, [navigation, search, chats.length])

    if (loading) return <Loading />

    return (
        <ScrollView
            style={{ backgroundColor: bgColor, flex: 1 }}
            contentInsetAdjustmentBehavior="automatic"
        >
            <FlatList
                data={data}
                scrollEnabled={false}
                renderItem={renderChats}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <Divider small />}
            />
        </ScrollView>
    )
}

export default ChatScreen
