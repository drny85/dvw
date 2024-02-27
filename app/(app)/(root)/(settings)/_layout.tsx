import useThemeColor from '@/common/hooks/useThemeColor'
import { Ionicons } from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const SettingsLayout = () => {
    const bgColor = useThemeColor('background')
    const iconColor = useThemeColor('text')
    return (
        <Stack
            initialRouteName="settings"
            //screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="numbers"
                options={{
                    presentation: 'fullScreenModal',
                    headerTitle: 'Useful Numbers',
                    headerLargeTitle: true,
                    headerBlurEffect: 'regular',
                    headerTransparent: true,
                    headerStyle: {
                        backgroundColor: bgColor
                    },

                    headerRight: () => {
                        return (
                            <TouchableOpacity onPress={router.back}>
                                <Ionicons
                                    name="close-circle"
                                    size={26}
                                    color={iconColor}
                                />
                            </TouchableOpacity>
                        )
                    }
                }}
            />
            <Stack.Screen
                name="donate"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="helpers/managers"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="helpers/coach"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false,
                    headerTransparent: true
                }}
            />
            <Stack.Screen
                name="helpers/referees"
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="[helper]"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="helpers/[helperId]"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="blocked"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default SettingsLayout
