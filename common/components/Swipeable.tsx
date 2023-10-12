import React, { FC } from 'react'
import { Entypo } from '@expo/vector-icons'
import { ViewStyle, Animated, TouchableOpacity, StyleProp } from 'react-native'
import { SIZES } from '@/constants/Sizes'
import { Swipeable } from 'react-native-gesture-handler'

interface Props {
    style?: StyleProp<ViewStyle>
    onLeftIconPress?: () => void
    rigthStyle?: ViewStyle
    children?: React.ReactNode
    rigthIconName?: React.ComponentProps<typeof Entypo>['name']
    onSwipeableClose: () => void
    onSwipeableWillOpen: () => void
    onRightIconPress?: (value: any) => void
    onReplyPress?: () => void
    deleteIconColor?: string
    ref: any
    isReplying?: boolean
}
const SwipeableItem: FC<Props> = React.forwardRef(
    (
        {
            style,
            onSwipeableWillOpen,
            children,
            rigthStyle,
            onSwipeableClose,
            onRightIconPress,
            onReplyPress,
            rigthIconName,
            deleteIconColor,
            isReplying
        },
        ref
    ) => {
        const renderRightActions = (_: any, dragX: any) => {
            const scale = dragX.interpolate({
                inputRange: [-30, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp'
            })

            const opacity = dragX.interpolate({
                inputRange: [-SIZES.width * 0.2, -30, 0],
                outputRange: [1, 0.5, 0]
            })

            return (
                <Animated.View
                    style={[
                        rigthStyle,
                        {
                            transform: [{ scale }],
                            opacity,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: SIZES.base
                        }
                    ]}
                >
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: SIZES.width * 0.25
                        }}
                    >
                        <Entypo
                            name={rigthIconName}
                            size={24}
                            color={
                                deleteIconColor ? deleteIconColor : '#8f0e0ef4'
                            }
                        />
                    </TouchableOpacity>
                    {isReplying && (
                        <TouchableOpacity
                            onPress={onReplyPress}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Entypo name="reply" size={24} color={'blue'} />
                        </TouchableOpacity>
                    )}
                </Animated.View>
            )
        }
        return (
            <Swipeable
                overshootRight={false}
                ref={ref as any}
                containerStyle={[style, { width: '100%' }]}
                onSwipeableWillOpen={onSwipeableWillOpen}
                renderRightActions={renderRightActions}
                onSwipeableClose={onSwipeableClose}
            >
                {children}
            </Swipeable>
        )
    }
)

export default SwipeableItem
