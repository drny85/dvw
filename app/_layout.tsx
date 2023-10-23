// Import necessary components and libraries from 'expo-router'

import ErrorComponent from '@/common/components/ErrorComponent'
import { useNotificationObserver } from '@/common/hooks/useNotificationObserver'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import { Slot, SplashScreen } from 'expo-router'
import React from 'react'

// Export ErrorBoundary from 'expo-router'
export { ErrorBoundary } from 'expo-router'

// Define initial navigation settings
export const unstable_settings = {
    initialRouteName: '(root)'
}

// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync()

/**
 * 1. Expo router requires rendering a "Slot" or layout component (e.g., Stack, Tab) during the initial render.
 *
 * 2. In this case, we have components that can potentially delay the rendering of the Slot:
 *    - PersistGate: For rehydrating the store.
 *    - useFonts: For loading custom fonts.
 *
 * 3. To ensure that state and custom fonts are fully loaded before rendering the entire app, we render a Slot here.
 *    The actual rendering of the app is deferred to a layout component one level down in the component hierarchy.
 */
export default function () {
    // Render the Slot component to initiate navigation

    useNotificationObserver()
    return (
        <ErrorComponent>
            <BottomSheetModalProvider>
                <Slot />
            </BottomSheetModalProvider>
        </ErrorComponent>
    )
}
