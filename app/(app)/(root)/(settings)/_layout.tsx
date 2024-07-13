import useThemeColor from '@/common/hooks/useThemeColor'
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
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
                    headerTitleStyle: {
                        color: iconColor
                    },
                    headerRight: () => {
                        return (
                            <TouchableOpacity onPress={router.back}>
                                <Ionicons
                                    name="close-circle"
                                    size={30}
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
                name="eula"
                options={{
                    presentation: 'fullScreenModal',
                    title: 'Terms of Use',
                    headerStyle: {
                        backgroundColor: bgColor
                    },
                    headerLeft: () => (
                        <Feather
                            name="chevron-left"
                            size={30}
                            color={iconColor}
                            onPress={router.back}
                        />
                    )
                    // headerShown: false
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
