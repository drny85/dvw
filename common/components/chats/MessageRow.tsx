import useThemeColor from '@/common/hooks/useThemeColor'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'
import { IMessage, Message, MessageProps } from 'react-native-gifted-chat'
import { isSameDay, isSameUser } from 'react-native-gifted-chat/lib/utils'
import { Msg } from './GiftedChatScreen'

type ChatMessageBoxProps = {
    setReplyOnSwipeOpen: (message: Msg | null) => void
    updateRowRef: (ref: any) => void
    onDeleteSwipe: () => void
    onDeletePress: (messsageId: string | number) => void
} & MessageProps<IMessage>

const ChatMessageBox = ({
    setReplyOnSwipeOpen,
    updateRowRef,
    onDeleteSwipe,
    onDeletePress,
    ...props
}: ChatMessageBoxProps) => {
    const isNextMyMessage =
        props.currentMessage &&
        props.nextMessage &&
        isSameUser(props.currentMessage, props.nextMessage) &&
        isSameDay(props.currentMessage, props.nextMessage)
    const textColor = useThemeColor('text')
    const warningColor = useThemeColor('warning')

    const renderLeftAction = (
        progressAnimatedValue: Animated.AnimatedInterpolation<any>
    ) => {
        const size = progressAnimatedValue.interpolate({
            inputRange: [0, 1, 100],
            outputRange: [0, 1, 1]
        })
        const trans = progressAnimatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 12, 20]
        })

        return (
            <Animated.View
                style={[
                    styles.container,
                    { transform: [{ scale: size }, { translateX: trans }] },
                    isNextMyMessage
                        ? styles.defaultBottomOffset
                        : styles.bottomOffsetNext,
                    props.position === 'right' && styles.leftOffsetValue
                ]}
            >
                <View style={styles.replyImageWrapper}>
                    <MaterialCommunityIcons
                        name="reply-circle"
                        size={24}
                        color={textColor}
                    />
                </View>
            </Animated.View>
        )
    }
    const renderRightAction = (
        progressAnimatedValue: Animated.AnimatedInterpolation<any>
    ) => {
        const size = progressAnimatedValue.interpolate({
            inputRange: [0, 1, 120],
            outputRange: [0, 1, 1]
        })
        const trans = progressAnimatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, -10, -20]
        })

        return (
            <Animated.View
                style={[
                    styles.container,
                    { transform: [{ scale: size }, { translateX: trans }] }
                ]}
            >
                <View
                    style={[
                        styles.replyImageWrapper,
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10
                        }
                    ]}
                >
                    <TouchableOpacity
                        onPress={() =>
                            onDeletePress(props.currentMessage?._id!)
                        }
                    >
                        <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={24}
                            color={warningColor}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }

    const onSwipeOpenAction = () => {
        if (props.currentMessage) {
            setReplyOnSwipeOpen({ ...(props.currentMessage as Msg) })
        }
    }

    return (
        <GestureHandlerRootView>
            <Swipeable
                ref={updateRowRef}
                friction={2}
                rightThreshold={40}
                leftThreshold={40}
                renderRightActions={renderRightAction}
                renderLeftActions={renderLeftAction}
                onSwipeableOpen={(d) => {
                    if (d === 'right' && props.currentMessage) {
                        onDeleteSwipe()
                    } else if (d === 'left') {
                        onSwipeOpenAction()
                    }
                }}
            >
                <Message {...props} />
            </Swipeable>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 40
    },
    replyImageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    replyImage: {
        width: 20,
        height: 20
    },
    defaultBottomOffset: {
        marginBottom: 2
    },
    bottomOffsetNext: {
        marginBottom: 10
    },
    leftOffsetValue: {
        marginLeft: 16
    }
})

export default ChatMessageBox
