// Import necessary components and hooks

import useAppSelector from '@/common/hooks/useAppSelector'

import { Redirect, Tabs } from 'expo-router'

import useThemeColor from '@/common/hooks/useThemeColor'
import { FontAwesome } from '@expo/vector-icons'

import { useAuth } from '@/common/hooks/auth/useAuth'
import React from 'react'
import { LogBox } from 'react-native'
import { onFetchUpdateAsync } from '@/utils/checkUpdates'

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name']
    color: string
    size?: React.ComponentProps<typeof FontAwesome>['size']
}) {
    return <FontAwesome {...props} />
}

LogBox.ignoreLogs([
    'Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.'
])

export const unstable_settings = {
    // Ensure any route can link back to `/`
    initialRouteName: '(feeds)'
}

export default function () {
    // Check if the user is logged in using Redux state
    const { loading } = useAuth()
    onFetchUpdateAsync()

    const { user, loading: ld } = useAppSelector((state) => state.auth)
    const tabBarActiveTintColor = useThemeColor('accent')
    const primaryColor = useThemeColor('background')

    if (loading || ld) return null

    // if ((!user || !user.emailVerified) && !loading) {
    //     console.log('Redirect to auth from app/layout')
    //     return <Redirect href={'/(app)/auth'} />
    // }

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
                    title: 'Posts',
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
                    title: 'My Plan',
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
