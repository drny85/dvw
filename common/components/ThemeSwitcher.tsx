import React from 'react'
import Row from './Row'
import Text from './Text'
import { Ionicon } from './Icon'
import ThemeIcon from '@/features/settings/ThemeIcon'
import { ViewStyle } from 'react-native'

type Props = {
    small?: boolean
    containerStyle?: ViewStyle
}
const ThemeSwitcher = ({ small, containerStyle }: Props) => {
    return (
        <Row
            backgroundColor={small ? 'background' : 'primary'}
            style={[
                {
                    padding: small ? 10 : 16,
                    borderRadius: small ? 10 : 16,
                    columnGap: 16,
                    alignSelf: small ? 'center' : undefined
                },
                containerStyle
            ]}
        >
            {!small && (
                <>
                    <Ionicon size={32} name="contrast" />
                    <Text
                        fontSize={16}
                        fontFamily="SFMedium"
                        style={{ flex: 1 }}
                    >
                        Theme
                    </Text>
                </>
            )}

            <Row style={{ columnGap: small ? 8 : undefined, height: 50 }}>
                <ThemeIcon name="sunny" theme="light" size={small ? 20 : 28} />
                <ThemeIcon name="contrast" theme="pink" />
                <ThemeIcon name="moon" theme="dark" />
            </Row>
        </Row>
    )
}

export default ThemeSwitcher
