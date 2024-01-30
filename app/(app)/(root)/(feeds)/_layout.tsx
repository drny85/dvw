import Greeting from '@/common/components/feed/Greeting'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useAppSelector from '@/common/hooks/useAppSelector'
import useNotifications from '@/common/hooks/useNotification'
import useThemeColor from '@/common/hooks/useThemeColor'
import { Ionicons } from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import React from 'react'
import { Image } from 'react-native'

export const unstable_settings = {
    initialRouteName: '(feeds)'
}

const _layout = () => {
    const bgColor = useThemeColor('background')
    const textColor = useThemeColor('text')
    useReferrals()
    const user = useAppSelector((s) => s.auth.user)
    useNotifications()
    return (
        <Stack
            initialRouteName="(home)"
            screenOptions={{
                headerStyle: { backgroundColor: bgColor },
                headerShadowVisible: false,
                headerTitle: () => <Greeting />,
                headerLeft: () => (
                    <Image
                        source={{
                            uri:
                                user?.image ||
                                `https://ui-avatars.com/api/?background=0D8ABC&color=fff`
                        }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                        resizeMode="cover"
                    />
                ),
                headerRight: () => (
                    <Ionicons
                        color={textColor}
                        name="add-sharp"
                        size={34}
                        onPress={() => {
                            if (user?.acceptedEULA) {
                                router.push('/(app)/(root)/(feeds)/addFeedView')
                            } else {
                                router.push('/(app)/(root)/(feeds)/eula')
                            }
                        }}
                    />
                )
            }}
        >
            <Stack.Screen name="(home)" />
            <Stack.Screen name="likes" options={{ headerShown: false }} />

            <Stack.Screen
                name="[feedId]"
                options={{ title: 'Feed Details', headerShown: false }}
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
