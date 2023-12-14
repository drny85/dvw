import Divider from '@/common/components/Divider'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import ChatList from '@/common/components/chats/ChatList'
import { useChats } from '@/common/hooks/chats/useChats'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { deleteChat } from '@/features/chats/chatsActions'
import { Chat } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native'

const Chats = () => {
    const iconColor = useThemeColor('text')
    const dispatch = useAppDispatch()
    const user = useAppSelector((s) => s.auth.user)

    const { chats, loading } = useChats()
    const [opened, setOpened] = useState<string | null>(null)
    const [showDelete, setShowDelete] = useState<boolean>(false)
    let rowRefs = new Map()
    const onDelete = async (id: string) => {
        try {
            dispatch(deleteChat(id))
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
                setOpened={setOpened}
                item={item}
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                rowRefs={rowRefs}
                onDelete={onDelete}
            />
        )
    }

    if (loading) return <Loading />

    return (
        <Screen>
            <Row
                style={{
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.padding,
                    paddingBottom: SIZES.base
                }}
            >
                {chats.length > 0 ? (
                    <TouchableOpacity
                        onPress={() => setShowDelete((prev) => !prev)}
                    >
                        <FontAwesome
                            name="trash-o"
                            size={24}
                            color={iconColor}
                        />
                    </TouchableOpacity>
                ) : (
                    <Text />
                )}
                <Text fontFamily="SFBold" fontSize={24}>
                    Chats
                </Text>
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
                >
                    <FontAwesome name="edit" size={24} color={iconColor} />
                </TouchableOpacity>
            </Row>
            {chats.length === 0 && (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1
                    }}
                >
                    <Text fontSize={24} fontFamily="SFBold">
                        No Chats
                    </Text>
                </View>
            )}
            {chats.length > 0 && (
                <FlatList
                    data={chats}
                    renderItem={renderChats}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <Divider small />}
                />
            )}
        </Screen>
    )
}

export default Chats
