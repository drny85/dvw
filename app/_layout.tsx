// Import necessary components and libraries from 'expo-router'

import { useNotificationObserver } from '@/common/hooks/useNotificationObserver'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import { Slot } from 'expo-router'
import React from 'react'
import * as SplashScreen from 'expo-splash-screen'
// Export ErrorBoundary from 'expo-router'
export { ErrorBoundary } from 'expo-router'
import { useNavigationContainerRef } from 'expo-router'
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation'
// Define initial navigation settings
export const unstable_settings = {
    initialRouteName: '(root)'
}
// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync()

export default function () {
    // Render the Slot component to initiate navigation
    const navigationRef = useNavigationContainerRef()
    useReactNavigationDevTools(navigationRef)
    useNotificationObserver()
    return (
        <BottomSheetModalProvider>
            <Slot />
        </BottomSheetModalProvider>
    )
}
