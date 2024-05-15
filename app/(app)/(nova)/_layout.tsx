import useThemeColor from '@/common/hooks/useThemeColor'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { FontAwesome } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const NovaLayout = () => {
    const text = useThemeColor('text')
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
                        <TouchableOpacity onPress={router.back}>
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
