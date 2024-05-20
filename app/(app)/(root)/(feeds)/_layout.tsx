import Text from '@/common/components/Text'
import View from '@/common/components/View'
import Greeting from '@/common/components/feed/Greeting'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useAppSelector from '@/common/hooks/useAppSelector'
import useNotifications from '@/common/hooks/useNotification'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { Ionicons } from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import React from 'react'
import { Image, TouchableHighlight } from 'react-native'

export const unstable_settings = {
    initialRouteName: '(feeds)'
}

const _layout = () => {
    const accent = useThemeColor('accent')
    const secondary = useThemeColor('secondary')
    const user = useAppSelector((s) => s.auth.user)
    useReferrals(user?.id!)

    useNotifications()
    return (
        <Stack
            initialRouteName="(home)"
            screenOptions={{
                headerStyle: { backgroundColor: accent },
                headerShadowVisible: false,
                headerTitle: () => <Greeting />,

                headerLeft: () => {
                    if (!user?.image) {
                        return (
                            <TouchableHighlight
                                activeOpacity={0.3}
                                onLongPress={() =>
                                    router.push('/(app)/(nova)/directory')
                                }
                                underlayColor={'transparent'}
                                style={{
                                    marginBottom: 6
                                }}
                                onPress={() => router.push('/spark')}
                            >
                                <View
                                    style={{
                                        height: 40,
                                        width: 40,
                                        borderRadius: 20,
                                        backgroundColor: secondary,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    {user && user.name ? (
                                        <Text
                                            uppercase
                                            fontFamily="QSBold"
                                            color="white"
                                            center
                                        >
                                            {user.name[0]}
                                            {user.name.split(' ')[1][0]}
                                        </Text>
                                    ) : (
                                        <Text
                                            uppercase
                                            fontFamily="QSBold"
                                            color="white"
                                            center
                                        >
                                            UN
                                        </Text>
                                    )}
                                </View>
                            </TouchableHighlight>
                        )
                    }
                    return (
                        <TouchableHighlight
                            activeOpacity={0.3}
                            onLongPress={() =>
                                router.push('/(app)/(nova)/directory')
                            }
                            underlayColor={'transparent'}
                            onPress={() => router.push('/spark')}
                        >
                            <Image
                                source={{
                                    uri:
                                        user?.image ||
                                        `https://ui-avatars.com/api/?background=0D8ABC&color=fff`
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    marginRight: SIZES.padding
                                }}
                                resizeMode="cover"
                            />
                        </TouchableHighlight>
                    )
                },

                headerRight: () => (
                    <Ionicons
                        color={'#ffffff'}
                        name="add-sharp"
                        size={34}
                        onPress={() => {
                            if (user?.acceptedEULA) {
                                router.push('/(app)/(root)/(feeds)/addFeedView')
                            } else {
                                router.push('/(app)/(root)/(feeds)/eula')
                            }
                        }}
                    />
                )
            }}
        >
            <Stack.Screen name="(home)" />
            <Stack.Screen name="likes" options={{ headerShown: false }} />

            <Stack.Screen
                name="[feedId]"
                options={{ title: 'Feed Details', headerShown: false }}
            />
            <Stack.Screen
                name="addFeedView"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="eula"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="image"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default _layout
