// Import necessary modules and type for ViewProps.
import { Platform, ViewProps, SafeAreaView } from 'react-native'
import useThemeColor from '../hooks/useThemeColor'
import View from './View'
import { PropsWithChildren } from 'react'
// Create a Screen component that fills available space.

export default function Screen({
    style,
    ...props
}: ViewProps & PropsWithChildren) {
    const color = useThemeColor('background')
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
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
