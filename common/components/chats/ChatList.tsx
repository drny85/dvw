import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'
import { Chat } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import moment from 'moment'
import { TouchableOpacity } from 'react-native'
import Row from '../Row'
import Text from '../Text'
import View from '../View'
import { AnimatePresence, MotiView } from 'moti'
import { useMessages } from '@/common/hooks/chats/useMessages'
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated'

type Props = {
    setOpened: React.Dispatch<React.SetStateAction<string | null>>
    item: Chat
    rowRefs: Map<any, any>
    onDelete: (id: string) => Promise<void>
    iconColor: string
    showDelete: boolean
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatList = ({
    setOpened,
    item,
    rowRefs,
    onDelete,
    iconColor,
    showDelete,
    setShowDelete
}: Props) => {
    const user = useAppSelector((s) => s.auth.user)
    const show = showDelete && user?.id === item.user.id
    const { loading, messages } = useMessages(item.id!)
    const lastMessage = messages.at(-1)
    if (loading) return null

    return (
        <Animated.View
            entering={FadeInLeft.duration(300)}
            exiting={FadeOutLeft.duration(300)}
        >
            <Row>
                <AnimatePresence>
                    {show && (
                        <MotiView
                            animate={{ translateX: SIZES.width * 0.1 }}
                            exit={{ translateX: -SIZES.width * 0.1 }}
                        >
                            <TouchableOpacity
                                onPress={() => onDelete(item.id!)}
                            >
                                <FontAwesome
                                    name="trash"
                                    size={20}
                                    color={'red'}
                                />
                            </TouchableOpacity>
                        </MotiView>
                    )}
                </AnimatePresence>
                <MotiView
                    animate={{ translateX: show ? SIZES.width * 0.15 : 0 }}
                    transition={{ type: 'spring' }}
                    exit={{ translateX: 0 }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            if (
                                user &&
                                user.acceptedEULA &&
                                user.acceptedEULA === true
                            ) {
                                router.push(`/(app)/(root)/(chats)/${item.id}`)
                            } else {
                                console.log('EULA not accepted')
                                router.push('/eula')
                            }
                        }}
                    >
                        <Row
                            style={{
                                justifyContent: 'space-between',
                                padding: SIZES.padding
                            }}
                        >
                            <View style={{ width: '90%' }}>
                                <Text fontFamily="SFBold" fontSize={20}>
                                    {item.name}
                                </Text>
                                {lastMessage && (
                                    <View style={{ padding: SIZES.base }}>
                                        <Text fontFamily="QSBold" fontSize={14}>
                                            {lastMessage?.sender.name}
                                        </Text>
                                        <Text
                                            fontSize={14}
                                            fontFamily="QSLight"
                                        >
                                            {lastMessage?.body.slice(0, 80)}{' '}
                                            {lastMessage?.body.length > 80 && (
                                                <Text>...</Text>
                                            )}
                                        </Text>
                                    </View>
                                )}
                                <Row
                                    style={{
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text fontSize={10} color="grey">
                                        created by:{' '}
                                        <Text
                                            color="grey"
                                            fontSize={12}
                                            capitalize
                                        >
                                            {item.user.name}
                                        </Text>
                                    </Text>
                                    <Text
                                        fontFamily="QSLight"
                                        fontSize={12}
                                        color="grey"
                                    >
                                        {moment(item.createdAt).fromNow()}
                                    </Text>
                                </Row>
                            </View>
                            <FontAwesome
                                name="chevron-right"
                                size={20}
                                color={iconColor}
                            />
                        </Row>
                    </TouchableOpacity>
                </MotiView>
            </Row>
        </Animated.View>
    )
}

export default ChatList
