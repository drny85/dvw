import Row from '@/common/components/Row'
import ThemeSwitcher from '@/common/components/ThemeSwitcher'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { logoutUser } from '@/features/auth/authActions'
import { FontAwesome } from '@expo/vector-icons'
import { Drawer } from 'expo-router/drawer'
import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'

const SettingsLayout = () => {
    const dispatch = useAppDispatch()
    const color = useThemeColor('text')
    const logoutPress = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                onPress: () => dispatch(logoutUser()),
                style: 'destructive'
            }
        ])
    }
    return (
        <Drawer
            screenOptions={{
                title: 'Profile',
                headerRight: ({ tintColor }) => (
                    <TouchableOpacity
                        style={{ marginRight: SIZES.padding }}
                        onPress={logoutPress}
                    >
                        <FontAwesome name="sign-out" size={28} color={color} />
                    </TouchableOpacity>
                )
            }}
        >
            <Drawer.Screen name="index" />
            <Drawer.Screen name="numbers" options={{ title: 'Numbers' }} />
        </Drawer>
        // <Stack initialRouteName="settings" screenOptions={{ headerShown: false }}>
        //   <Stack.Screen name="index" />
        //   <Stack.Screen
        //     name="numbers"
        //     options={{ presentation: "fullScreenModal" }}
        //   />
        //   <Stack.Screen
        //     name="donate"
        //     options={{ presentation: "fullScreenModal" }}
        //   />
        // </Stack>
    )
}

export default SettingsLayout
