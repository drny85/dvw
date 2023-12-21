import React from 'react'

import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { useBlockedUsers } from '@/common/hooks/auth/useBlockedUsers'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'
import { updateUser } from '@/features/auth/authActions'
import { AppUser } from '@/features/auth/authSlice'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native'
import useThemeColor from '@/common/hooks/useThemeColor'

const BlockUsers = () => {
    const dispatch = useAppDispatch()
    const iconColor = useThemeColor('text')
    const user = useAppSelector((s) => s.auth.user)
    const { usersData, loading } = useBlockedUsers()
    const bgColor = useThemeColor('background')

    const unblockUser = (userId: string) => {
        try {
            const b = user?.blockedUsers.filter((u) => u !== userId)
            dispatch(updateUser({ ...user!, blockedUsers: [...b!] }))
            router.back()
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) return <Loading />

    const renderBlockedUser: ListRenderItem<AppUser> = ({ item }) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    backgroundColor: bgColor,
                    shadowOpacity: 0.6,
                    elevation: 6,
                    padding: SIZES.padding,
                    borderRadius: SIZES.base
                }}
            >
                <Text center>{item.name} </Text>
                <TouchableOpacity onPress={() => unblockUser(item.id)}>
                    <Row>
                        <Text fontFamily="QSLight" fontSize={14}>
                            Unblock
                        </Text>
                        <MaterialIcons
                            size={24}
                            name="block"
                            style={{ marginLeft: SIZES.base }}
                            color={iconColor}
                        />
                    </Row>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <Screen>
            <Header title="Blocked Users" onPressBack={router.back} />

            {usersData.length === 0 && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text>No blocked users</Text>
                </View>
            )}
            {usersData.length > 0 && (
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <FlatList
                        data={usersData}
                        renderItem={renderBlockedUser}
                        contentContainerStyle={{
                            padding: SIZES.padding
                        }}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            )}
        </Screen>
    )
}

export default BlockUsers
