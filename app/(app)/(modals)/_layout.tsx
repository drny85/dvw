import { StackScreenWithSearchBar } from '@/constants/layout'
import { FontAwesome } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const ModalLaout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="referral" />
            <Stack.Screen name="quotes" />
            <Stack.Screen
                name="filtered"
                options={{
                    headerShown: true,
                    ...StackScreenWithSearchBar,
                    headerLeft: () => (
                        <TouchableOpacity onPress={router.back}>
                            <FontAwesome name="chevron-left" size={22} />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen name="spark" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="reports" />
            <Stack.Screen name="Congratulations" />
            <Stack.Screen name="[referralId]" />
            <Stack.Screen name="scheduleWireles" />
        </Stack>
    )
}

export default ModalLaout
