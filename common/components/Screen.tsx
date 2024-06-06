// Import necessary modules and type for ViewProps.
import { ViewProps, SafeAreaView, Platform } from 'react-native'
import useThemeColor from '../hooks/useThemeColor'
import View from './View'
import { PropsWithChildren } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// Create a Screen component that fills available space.

export default function Screen({
    style,
    ...props
}: ViewProps & PropsWithChildren) {
    const color = useThemeColor('background')
    const { top, bottom } = useSafeAreaInsets()
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: color,
                paddingTop: Platform.OS === 'android' ? top : undefined,
                paddingBottom: Platform.OS === 'android' ? bottom : undefined
            }}
        >
            <View
                backgroundColor="background" // Set the background color.
                style={[{ flex: 1 }, style]} // Apply flex styling.
                {...props}
            >
                {props.children}
            </View>
        </SafeAreaView>
    )
}
