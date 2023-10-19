import { Ionicon } from '@/common/components/Icon'
import useNotifications from '@/common/hooks/useNotification'
import useThemeColor from '@/common/hooks/useThemeColor'
import { Stack, useRouter } from 'expo-router'
import React from 'react'

export const unstable_settings = {
    initialRouteName: 'index'
}

const _layout = () => {
    const router = useRouter()
    const bgColor = useThemeColor('background')
    console.log('Feeds')
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

                    headerRight: () => {
                        return (
                            <Ionicon
                                color="text"
                                name="add"
                                size={32}
                                onPress={() =>
                                    router.push(
                                        '/(app)/(root)/(feeds)/addFeedView'
                                    )
                                }
                            />
                        )
                    }
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
