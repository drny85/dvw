import React from 'react'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import useThemeColor from '@/common/hooks/useThemeColor'

const NotFound = () => {
    const backgroundColor = useThemeColor('background')
    return (
        <Screen
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
                padding: 20,
                backgroundColor
            }}
        >
            <Text>Page Not Found</Text>
        </Screen>
    )
}

export default NotFound
