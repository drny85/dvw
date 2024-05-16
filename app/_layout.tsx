import { useNotificationObserver } from '@/common/hooks/useNotificationObserver'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
// Export ErrorBoundary from 'expo-router'
export { ErrorBoundary } from 'expo-router'
// Define initial navigation settings
export const unstable_settings = {
    initialRouteName: '(root)'
}
// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync()

export default function () {
    // Render the Slot component to initiate navigation

    useNotificationObserver()

    return (
        <BottomSheetModalProvider>
            <Slot />
        </BottomSheetModalProvider>
    )
}
