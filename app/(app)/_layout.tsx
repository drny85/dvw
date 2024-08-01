import useColorScheme from '@/common/hooks/useColorScheme'
import { useLinking } from '@/common/hooks/useLinking'
import useThemeColor from '@/common/hooks/useThemeColor'
import { useUserStatus } from '@/common/hooks/useUserStatus'
import Fonts from '@/constants/Fonts'
import Styles from '@/constants/Styles'
import { persistor, store } from '@/store/configureStore'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export const unstable_settings = {
    initialRouteName: '(root)'
}

export default function () {
    const [stateLoaded, setStateLoaded] = useState(false)
    const [fontsLoaded, fontError] = useFonts(Fonts)

    // Callback function to hide the splash screen when layout is triggered
    const onLayout = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded, fontError])

    // Callback function executed before the persist gate is lifted
    const onBeforeLimit = useCallback(() => setStateLoaded(true), [])

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} onBeforeLift={onBeforeLimit}>
                {/* Render the SafeAreaView and AppNavigator when fonts and state are loaded */}
                {stateLoaded && fontsLoaded && (
                    <GestureHandlerRootView
                        onLayout={onLayout}
                        style={Styles.flex}
                    >
                        <BottomSheetModalProvider>
                            <RootLayout />
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                )}
            </PersistGate>
        </Provider>
    )
}

function RootLayout() {
    const colorScheme = useColorScheme()
    const navigationBarColor = useThemeColor('background')
    const bg = useThemeColor('background')
    useLinking()
    useUserStatus()

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            {/* Set the status bar style based on the color scheme */}
            <StatusBar
                style={colorScheme === 'light' ? 'dark' : 'light'}
                backgroundColor={bg}
            />
            <Stack
                screenOptions={{
                    headerShown: false,
                    navigationBarColor,
                    animation: 'slide_from_bottom',
                    contentStyle: {
                        backgroundColor: bg
                    }
                }}
            />
        </ThemeProvider>
    )
}
