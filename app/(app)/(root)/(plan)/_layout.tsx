import React from 'react'
import { Stack } from 'expo-router'

export const unstable_settings = {
    initialRouteName: '(plan)'
}

const PlanLaypout = () => {
    return (
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />

            <Stack.Screen
                name="emailSent"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="[lineId]"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default PlanLaypout
