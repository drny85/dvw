import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import ChatList from '@/common/components/chats/ChatList'
import { useChats } from '@/common/hooks/chats/useChats'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { Chat } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native'

const Chats = () => {
    const iconColor = useThemeColor('text')
    const user = useAppSelector((s) => s.auth.user)
    const { chats, loading } = useChats()
    const [opened, setOpened] = useState<string | null>(null)
    let rowRefs = new Map()
    const onDelete = async (id: string) => {
        console.log('onDelete', id)
        // dispatch(deleteChat(id));
    }

    const renderChats: ListRenderItem<Chat> = ({ item }) => {
        return (
            <ChatList
                iconColor={iconColor}
                setOpened={setOpened}
                item={item}
                rowRefs={rowRefs}
                onDelete={onDelete}
            />
        )
    }

    if (loading) return <Loading />

    return (
        <Screen>
            <Header
                title="Chats"
                hasRightIcon
                rightIcon={
                    <TouchableOpacity
                        style={{ paddingRight: SIZES.padding }}
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
                }
            />
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
