import React from 'react'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'

const NotFound = () => {
    return (
        <Screen
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
                padding: 20,
                backgroundColor: 'orange'
            }}
        >
            <Text>Page Not Found</Text>
        </Screen>
    )
}

export default NotFound
