import Screen from '@/common/components/Screen'
import React, { useState } from 'react'
import { Alert, FlatList, ListRenderItem, StyleSheet } from 'react-native'

import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { useCoachess } from '@/common/hooks/auth/useCoaches'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { updateUser } from '@/features/auth/authActions'

import { useUser } from '@/common/hooks/auth/useUser'
import { AppUser, Helper } from '@/types'
import { helpersCollection } from '@/utils/collections'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { addDoc } from 'firebase/firestore'
import { TouchableOpacity } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

const Coach = () => {
    const { loading, coaches } = useCoachess()
    const user = useAppSelector((s) => s.auth.user)
    const dispatch = useAppDispatch()
    const [selected, setSelected] = useState<string>(user?.coachId!)
    const { loading: loadingCoach, user: selectedCoach } = useUser(selected)

    const color = useThemeColor('text')
    const bgColor = useThemeColor('accent')

    const saveSuccess = async () => {
        try {
            if (!selectedCoach || !user) return
            const h: Helper = {
                name: selectedCoach.name,
                phone: selectedCoach.phone || '',
                email: selectedCoach.email || '',
                id: selectedCoach.id,
                addedOn: new Date().toISOString(),
                userId: user.id,
                type: 'coach'
            }

            await addDoc(helpersCollection(user?.id), { ...h })
            dispatch(updateUser({ ...user, coachId: selectedCoach.id }))
            //router.back()
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Something went wrong')
        }
    }

    const renderCoaches: ListRenderItem<AppUser> = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    padding: SIZES.base,
                    borderRadius: SIZES.radius,
                    backgroundColor:
                        selectedCoach?.id === item.id ? bgColor : undefined
                }}
                onPress={() => setSelected(item.id)}
            >
                <Text
                    fontFamily={
                        selectedCoach?.id === item.id ? 'SFBold' : 'SFRegular'
                    }
                    capitalize
                    color={selectedCoach?.id === item.id ? 'white' : 'text'}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }

    if (loading || loadingCoach) return <Loading />
    return (
        <Screen>
            <Header
                title={
                    selectedCoach?.coachId ? 'My Coach' : 'Select Your Coach'
                }
                onPressBack={router.back}
                hasRightIcon
                rightIcon={
                    user?.coachId ? (
                        <View />
                    ) : (
                        <TouchableOpacity
                            onPress={saveSuccess}
                            style={{ padding: SIZES.padding }}
                        >
                            <FontAwesome name="save" size={24} color={color} />
                        </TouchableOpacity>
                    )
                }
            />
            {/* <PersonList
                data={coaches}
            /> */}
            {user?.coachId && selectedCoach && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: SIZES.padding,
                        gap: SIZES.padding,
                        marginBottom: SIZES.padding * 2
                    }}
                >
                    <Animated.Image
                        style={{
                            height: SIZES.width / 2,
                            width: SIZES.width / 2,
                            borderRadius: SIZES.width / 4,
                            alignSelf: 'center',
                            marginBottom: SIZES.padding * 2
                        }}
                        entering={FadeIn.duration(800)}
                        source={
                            selectedCoach.image
                                ? { uri: selectedCoach.image }
                                : require('@/assets/images/profile.jpg')
                        }
                    />
                    <Text capitalize fontFamily="SFBold" fontSize={22}>
                        {selectedCoach.name}
                    </Text>
                    {selectedCoach?.phone && (
                        <Text capitalize>{selectedCoach.phone}</Text>
                    )}
                    <Text>{selectedCoach.email}</Text>
                </View>
            )}
            {!user?.coachId && (
                <FlatList
                    keyExtractor={(item) => item.id!}
                    renderItem={renderCoaches}
                    data={coaches.sort((a, b) =>
                        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                    )}
                    contentContainerStyle={{
                        padding: SIZES.padding
                    }}
                    ListHeaderComponent={
                        <View
                            style={{
                                marginBottom: SIZES.padding,
                                gap: SIZES.base
                            }}
                        >
                            <Text fontFamily="QSLight">
                                If you dont see your coach here, she/he has not
                                created an account
                            </Text>
                            <Divider small />
                        </View>
                    }
                    ItemSeparatorComponent={() => <Divider />}
                    ListEmptyComponent={
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text center>No Coaches</Text>
                        </View>
                    }
                />
            )}
        </Screen>
    )
}

export default Coach

const styles = StyleSheet.create({})
