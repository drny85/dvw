declare module 'react-native-swipeable' {
    import * as React from 'react'
    import { GestureResponderEvent, ViewStyle } from 'react-native'

    interface SwipeableProps {
        leftContent?: React.ReactNode
        rightContent?: React.ReactNode
        onLeftActionRelease?: () => void
        onRightActionRelease?: () => void
        onLeftButtonsOpenRelease?: () => void
        onRightButtonsOpenRelease?: () => void
        onSwipeStart?: () => void
        onSwipeComplete?: () => void
        onFullSwipeLeft?: () => void
        onFullSwipeRight?: () => void
        onSwipeFail?: () => void
        leftActionActivationDistance?: number
        rightActionActivationDistance?: number
        leftButtonsActivationDistance?: number
        rightButtonsActivationDistance?: number
        leftButtonWidth?: number
        rightButtonWidth?: number
        leftActionReleaseAnimationFn?: (
            gestureState: GestureResponderEvent
        ) => void
        rightActionReleaseAnimationFn?: (
            gestureState: GestureResponderEvent
        ) => void
        onSwipeLeft?: () => void
        onSwipeRight?: () => void
        leftButtonContent?: React.ReactNode
        rightButtonContent?: React.ReactNode
        leftButtonsOpenRelease?: boolean
        rightButtonsOpenRelease?: boolean
        style?: ViewStyle
        children?: React.ReactNode
    }

    class Swipeable extends React.Component<SwipeableProps> {}

    export default Swipeable
}
