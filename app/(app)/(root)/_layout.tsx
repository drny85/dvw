import useAppSelector from '@/common/hooks/useAppSelector'

import { Redirect, Tabs } from 'expo-router'

import useThemeColor from '@/common/hooks/useThemeColor'
import { FontAwesome } from '@expo/vector-icons'

import { useAuth } from '@/common/hooks/auth/useAuth'
import { onFetchUpdateAsync } from '@/utils/checkUpdates'
import React from 'react'
import { LogBox } from 'react-native'
import { useUserStatus } from '@/common/hooks/useUserStatus'
import { useShake } from '@/common/hooks/useShake'

export function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name']
    color: string
    size?: React.ComponentProps<typeof FontAwesome>['size']
}) {
    return <FontAwesome {...props} />
}

LogBox.ignoreLogs([
    'Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.',
    'Sending `onAnimatedValueUpdate` with no listeners registered'
])

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: '(root)'
}

export default function () {
    // Check if the user is logged in using Redux state
    const { loading } = useAuth()
    useShake()
    onFetchUpdateAsync()

    const { user, loading: ld } = useAppSelector((state) => state.auth)
    const tabBarActiveTintColor = useThemeColor('accent')
    const primaryColor = useThemeColor('background')

    if (loading || ld) return null

    if ((!user || !user.emailVerified) && !loading) {
        return <Redirect href={'/(app)/auth'} />
    }

    return (
        <Tabs
            initialRouteName="(feeds)"
            screenOptions={{
                tabBarActiveTintColor,
                headerShadowVisible: false,
                headerShown: false,
                headerTitleStyle: {
                    fontFamily: 'SFMedium'
                },
                tabBarLabelStyle: {
                    fontFamily: 'SFMedium'
                },
                tabBarStyle: {
                    backgroundColor: primaryColor,
                    borderTopWidth: 0
                },

                headerStyle: {
                    backgroundColor: primaryColor
                }
            }}
        >
            <Tabs.Screen
                name="(feeds)"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="home" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="(sales)"
                options={{
                    title: 'Sales',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="dollar" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="(chats)"
                options={{
                    title: 'Chats',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="telegram" color={color} size={size} />
                    )
                }}
            />
            <Tabs.Screen
                name="(plan)"
                options={{
                    title: 'Plans',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="wifi" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="(settings)"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="user" size={size - 4} color={color} />
                    )
                }}
            />
        </Tabs>
    )
}
