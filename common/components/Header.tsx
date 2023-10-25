import React from 'react'
import { Ionicon } from './Icon'
import Text from './Text'
import View from './View'
import { StyleProp, ViewProps } from 'react-native'

type HeaderProps = {
    title?: string
    onPressBack?: () => void
    hasRightIcon?: boolean
    rightIcon?: React.ReactNode
    contentContainerStyle?: any
    titleFontSize?: number

    white?: boolean
}
const Header = ({
    title,
    onPressBack,
    rightIcon,
    titleFontSize,
    hasRightIcon = false,
    contentContainerStyle,
    white = false
}: HeaderProps) => {
    return (
        <View
            style={[
                {
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center'
                },
                contentContainerStyle
            ]}
        >
            {onPressBack ? (
                <Ionicon
                    style={{ padding: 6 }}
                    onPress={onPressBack}
                    color={white ? 'white' : 'text'}
                    name="arrow-back"
                    size={32}
                />
            ) : (
                <Text />
            )}

            <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                fontSize={titleFontSize || 24}
                color={white ? 'white' : 'text'}
                fontFamily="SFBold"
            >
                {title?.length && title.length > 26
                    ? title.substring(0, 26) + '...'
                    : title}
            </Text>
            {hasRightIcon && rightIcon ? (
                rightIcon
            ) : hasRightIcon && !rightIcon ? (
                <Ionicon name="add" size={32} />
            ) : (
                <Text />
            )}
        </View>
    )
}

export default Header
