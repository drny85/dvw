import useThemeColor from '@/common/hooks/useThemeColor'
import { StackScreenWithSearchBar } from '@/constants/layout'
import { FontAwesome } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const ModalLaout = () => {
    const textColor = useThemeColor('text')
    const bgColor = useThemeColor('background')
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="referral" />
            <Stack.Screen name="perks" />
            <Stack.Screen name="quotes" />
            <Stack.Screen
                name="trade-in"
                options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
                name="filtered"
                options={{
                    headerShown: true,
                    ...StackScreenWithSearchBar,
                    headerStyle: {
                        backgroundColor: bgColor
                    },
                    headerTitleStyle: {
                        fontSize: 18
                    },

                    headerLeft: () => (
                        <TouchableOpacity
                            style={{ padding: 8 }}
                            onPress={router.back}
                        >
                            <FontAwesome
                                name="chevron-left"
                                size={22}
                                color={textColor}
                            />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen name="spark" />
            <Stack.Screen name="switcherOffer" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="reports" />
            <Stack.Screen name="Congratulations" />
            <Stack.Screen name="[referralId]" />
            <Stack.Screen name="scheduleWireles" />
        </Stack>
    )
}

export default ModalLaout
