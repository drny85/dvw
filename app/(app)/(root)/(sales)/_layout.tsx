import React from 'react'
import { Stack } from 'expo-router'

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: '(sales)'
}

const SalesPayout = () => {
    return (
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    )
}

export default SalesPayout
