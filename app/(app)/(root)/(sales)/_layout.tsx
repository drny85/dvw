import React from 'react'
import { Stack } from 'expo-router'

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: 'index'
}

const SalesPayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="referrals"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="reports"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="[filterType]"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="details/[id]"
                options={{ presentation: 'fullScreenModal' }}
            />
        </Stack>
    )
}

export default SalesPayout
