import { Stack } from 'expo-router'
import React from 'react'

const SettingsLayout = () => {
    return (
        <Stack
            initialRouteName="settings"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen
                name="numbers"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="donate"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="helpers/managers"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="helpers/coach"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="helpers/referees"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="[helper]"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="helpers/[helperId]"
                options={{ presentation: 'fullScreenModal' }}
            />
        </Stack>
    )
}

export default SettingsLayout
