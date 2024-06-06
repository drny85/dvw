import useThemeColor from '@/common/hooks/useThemeColor'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { FontAwesome } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const NovaLayout = () => {
    const text = useThemeColor('text')
    const bg = useThemeColor('background')
    return (
        <Stack>
            <Stack.Screen
                name="filter"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="nova"
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="myinfo"
                options={{
                    title: 'My Contact Info',
                    headerStyle: {
                        backgroundColor: bg
                    },
                    headerLeft: () => {
                        return (
                            <TouchableOpacity
                                style={{ padding: 6 }}
                                onPress={router.back}
                            >
                                <FontAwesome
                                    name="chevron-left"
                                    size={22}
                                    color={text}
                                />
                            </TouchableOpacity>
                        )
                    }
                }}
            />
            <Stack.Screen name="chat" />
            <Stack.Screen
                name="saveQuote"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="directory"
                options={{
                    ...StackScreenWithSearchBar,
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{ padding: 6 }}
                            onPress={router.back}
                        >
                            <FontAwesome
                                name="chevron-left"
                                size={22}
                                color={text}
                            />
                        </TouchableOpacity>
                    ),
                    headerTitle: 'Directory'
                }}
            />
        </Stack>
    )
}

export default NovaLayout
