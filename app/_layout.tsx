// Import necessary components and libraries from 'expo-router'
import { Slot, SplashScreen, router } from 'expo-router'
import React from 'react'
import * as Notifications from 'expo-notifications'
import { NotificationData } from '@/types'

// Export ErrorBoundary from 'expo-router'
export { ErrorBoundary } from 'expo-router'

// Define initial navigation settings
export const unstable_settings = {
    initialRouteName: '(root)'
}

// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync()
function useNotificationObserver() {
    React.useEffect(() => {
        let isMounted = true

        function redirect(notification: Notifications.Notification) {
            const data = notification.request.content.data as NotificationData
            if (data.type === 'new-message') {
                router.push(`/(app)/(root)/(chats)/${data.id}`)
            }
        }

        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (!isMounted || !response?.notification) {
                return
            }
            redirect(response?.notification)
        })

        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    redirect(response.notification)
                }
            )

        return () => {
            isMounted = false
            subscription.remove()
        }
    }, [])
}

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
    return <Slot />
}
