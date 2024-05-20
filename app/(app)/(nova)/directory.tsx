import DirectoryListItem from '@/common/components/DirectoryListItem'
import Loading from '@/common/components/Loading'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useAppSelector from '@/common/hooks/useAppSelector'
import { useNavigationSearch } from '@/common/hooks/useNavigationSearch'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { AppUser } from '@/types'
import { usersCollection } from '@/utils/collections'

import { useNavigation } from 'expo-router'
import { onSnapshot, query, where } from 'firebase/firestore'
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState
} from 'react'
import { FlatList, ListRenderItem, ScrollView } from 'react-native'

const Directory = () => {
    const navigation = useNavigation()

    const background = useThemeColor('background')
    const textColor = useThemeColor('text')
    const user = useAppSelector((s) => s.auth.user)
    const [users, setUsers] = useState<AppUser[]>([])

    const [loading, setLoading] = useState<boolean>(true)
    const search = useNavigationSearch({
        searchBarOptions: {
            placeholder: 'Search user',
            tintColor: textColor,

            textColor: textColor,
            barTintColor: '#ffffff80'
        }
    })
    const directory = useMemo(() => {
        if (!search) return users
        return users.filter((d) =>
            d.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [users, search])

    const renderUsers: ListRenderItem<AppUser> = useCallback(({ item }) => {
        return <DirectoryListItem user={item} />
    }, [])

    useEffect(() => {
        const docQuery = query(
            usersCollection,
            where('emailVerified', '==', true)
        )

        return onSnapshot(docQuery, (d) => {
            const results = d.docs
                .filter((u) => u.id !== user?.id)
                .map((doc) => ({ ...doc.data() }))
            setUsers(results)
            setLoading(false)
        })
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: background
            },
            headerTitle: `Directory (${users.length})`,
            headerLargeStyle: {
                backgroundColor: background
            },
            headerLargeTitleStyle: {
                color: textColor
            }
        })
    }, [navigation, background, textColor, users.length])

    useStatusBarColor('dark')

    if (loading) return <Loading />
    return (
        <View style={{ flex: 1, backgroundColor: background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentInsetAdjustmentBehavior="automatic"
            >
                <FlatList
                    ListEmptyComponent={<Text center>No EM Found</Text>}
                    scrollEnabled={false}
                    data={directory.sort((a, b) =>
                        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                    )}
                    contentContainerStyle={{
                        padding: SIZES.base,
                        gap: SIZES.padding,
                        marginBottom: 20
                    }}
                    renderItem={renderUsers}
                />
            </ScrollView>
        </View>
    )
}

export default Directory
