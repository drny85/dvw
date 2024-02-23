import Loading from '@/common/components/Loading'
import View from '@/common/components/View'
import PersonList from '@/common/components/referrals/PersonList'
import { useHelpers } from '@/common/hooks/referrals/useHelpers'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { Helper } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router, useNavigation } from 'expo-router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'

const Referees = () => {
    const { loading, helpers } = useHelpers()
    const navigation = useNavigation()
    const [searchValue, setSearchValue] = useState<string>('')
    const [referees, setReferees] = useState<Helper[]>([])
    const bgColor = useThemeColor('background')
    const color = useThemeColor('text')

    useEffect(() => {
        if (!searchValue) {
            setReferees([...helpers.filter((h) => h.type === 'referee')])
            return
        } else {
            if (searchValue) {
                setReferees([
                    ...helpers
                        .filter((h) => h.type === 'referee')
                        .filter((r) =>
                            r.name
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                        )
                ])
            }
        }
    }, [searchValue, helpers])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Referees',
            headerLargeTitle: true,
            headerBlurEffect: 'regular',
            headerTransparent: true,
            headerStyle: {
                backgroundColor: bgColor
            },
            headerLeft: () => {
                return (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ padding: SIZES.padding }}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={24}
                            color={color}
                        />
                    </TouchableOpacity>
                )
            },
            headerRight: () => {
                return (
                    <TouchableOpacity
                        onPress={() =>
                            router.push('/(app)/(root)/(settings)/referee')
                        }
                        style={{ padding: SIZES.padding }}
                    >
                        <FontAwesome name="plus" size={24} color={color} />
                    </TouchableOpacity>
                )
            },

            headerSearchBarOptions: {
                placeholder: 'Search Referee',
                onChangeText(e: any) {
                    setSearchValue(e.nativeEvent.text)
                }
            }
        })
    }, [navigation])

    if (loading) return <Loading />
    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ScrollView contentContainerStyle={{ marginTop: SIZES.base }}>
                <PersonList
                    scrollEnabled={false}
                    data={referees.sort((a, b) => (a.name > b.name ? 1 : -1))}
                />
            </ScrollView>
            {/* <Header
                title="Referees / LA"
                onPressBack={router.back}
                hasRightIcon
                rightIcon={
                    <TouchableOpacity
                        onPress={() =>
                            router.push('/(app)/(root)/(settings)/referee')
                        }
                        style={{ padding: SIZES.padding }}
                    >
                        <FontAwesome name="plus" size={24} color={color} />
                    </TouchableOpacity>
                }
            /> */}
        </View>
    )
}

export default Referees
