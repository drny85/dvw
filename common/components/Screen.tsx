// Import necessary modules and type for ViewProps.
import { Platform, ViewProps, SafeAreaView } from 'react-native'
import useThemeColor from '../hooks/useThemeColor'
import View from './View'
import { PropsWithChildren } from 'react'
import { SafeAreaView as AndroidSA } from 'react-native-safe-area-context'

// Create a Screen component that fills available space.
const SafeArea = Platform.OS === 'ios' ? SafeAreaView : AndroidSA
export default function Screen({
    style,
    ...props
}: ViewProps & PropsWithChildren) {
    const color = useThemeColor('background')
    return (
        <SafeArea style={{ flex: 1, backgroundColor: color }}>
            <View
                backgroundColor="background" // Set the background color.
                style={[{ flex: 1 }, style]} // Apply flex styling.
                {...props}
            >
                {props.children}
            </View>
        </SafeArea>
    )
}
