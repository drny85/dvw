import Text from '@/common/components/Text'
import useAppSelector from '@/common/hooks/useAppSelector'
import useNotifications from '@/common/hooks/useNotification'
import useThemeColor from '@/common/hooks/useThemeColor'
import { Ionicons } from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import React from 'react'
import { Image } from 'react-native'

export const unstable_settings = {
    initialRouteName: '(home)'
}

const _layout = () => {
    const bgColor = useThemeColor('background')
    const user = useAppSelector((s) => s.auth.user)
    useNotifications()
    return (
        <Stack
            initialRouteName="(home)"
            screenOptions={{
                headerStyle: { backgroundColor: bgColor },
                headerShadowVisible: false,
                headerTitle: () => (
                    <Text fontFamily="QSRegular" fontSize={18}>
                        Welcome {user?.name.split(' ')[0]}
                    </Text>
                ),
                headerLeft: () => (
                    <Image
                        source={{ uri: user?.image }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                        resizeMode="cover"
                    />
                ),
                headerRight: () => (
                    <Ionicons
                        color="text"
                        name="ios-add-sharp"
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
