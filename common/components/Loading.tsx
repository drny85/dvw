import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import useThemeColor from '../hooks/useThemeColor'

const Loading = (): JSX.Element => {
    const _color = useThemeColor('background')
    const c = useThemeColor('text')
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: _color
            }}
        >
            <ActivityIndicator color={c} size="large" />
        </View>
    )
}

export default Loading
