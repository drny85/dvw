import React from 'react'
import { Stack } from 'expo-router'

export const unstable_settings = {
    initialRouteName: '(plan)'
}

const PlanLaypout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="filter" options={{ presentation: 'modal' }} />

            <Stack.Screen
                name="myPlan"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="saveQuote"
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="myquotes"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
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

            <Stack.Screen
                name="details/[planName]"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default PlanLaypout
