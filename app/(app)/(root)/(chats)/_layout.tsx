import React from 'react'
import { Stack } from 'expo-router'

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: '(chats)'
}

const ChatLayout = () => {
    return (
        <Stack initialRouteName="chat">
            <Stack.Screen name="chat" />
            <Stack.Screen
                name="eula"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="[chatId]"
                options={{
                    presentation: 'fullScreenModal'
                }}
            />

            <Stack.Screen
                name="newChat"
                options={{ presentation: 'modal', headerShown: false }}
            />
        </Stack>
    )
}

export default ChatLayout
