import useNotifications from '@/common/hooks/useNotification'
import useThemeColor from '@/common/hooks/useThemeColor'
import { Stack } from 'expo-router'
import React from 'react'

export const unstable_settings = {
    initialRouteName: 'index'
}

const _layout = () => {
    const bgColor = useThemeColor('background')

    useNotifications()
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{ headerStyle: { backgroundColor: bgColor } }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Posts',

                    headerShown: false
                }}
            />
            <Stack.Screen name="likes" options={{ headerShown: false }} />

            <Stack.Screen
                name="[feedId]"
                options={{ title: 'Feed  Details', headerShown: false }}
            />
            <Stack.Screen
                name="addFeedView"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="eula"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="image"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default _layout
