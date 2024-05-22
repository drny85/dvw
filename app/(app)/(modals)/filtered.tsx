import Loading from '@/common/components/Loading'
import View from '@/common/components/View'
import ReferralCard from '@/common/components/referrals/ReferralCard'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useAppSelector from '@/common/hooks/useAppSelector'
import { useNavigationSearch } from '@/common/hooks/useNavigationSearch'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { Referral } from '@/types'
import { filterTitle } from '@/utils/filterTitle'
import { getResults } from '@/utils/getReferralsFilterData'
import { useNavigation } from 'expo-router'
import React, { useLayoutEffect, useMemo } from 'react'
import { FlatList, ListRenderItem, ScrollView } from 'react-native'

const FilteredReferrals = () => {
    const navigation = useNavigation()
    const filterType = useAppSelector((s) => s.referrals.filtered)
    const user = useAppSelector((s) => s.auth.user)
    const color = useThemeColor('text')
    const bgColor = useThemeColor('background')
    const { loading, referrals } = useReferrals(user?.id!)
    const data = getResults(referrals, filterType!)
    const search = useNavigationSearch({
        searchBarOptions: {
            placeholder: 'Search by name, email or phone',
            hintTextColor: color,
            textColor: color,
            tintColor: color,
            barTintColor: '#ffffff80'
        }
    })

    const results = useMemo(() => {
        if (!search) return data
        return data.filter((r) => {
            const regex = new RegExp(`${search}`, 'gi')
            return (
                r.name.match(regex) ||
                r.address.match(regex) ||
                (r.status.id === 'closed' && r.mon?.match(regex)) ||
                r.phone.match(regex)
            )
        })
    }, [search, referrals, data])

    const renderReferrals: ListRenderItem<Referral> = ({ item }) => {
        return <ReferralCard item={item} bgColor={bgColor} />
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLargeStyle: {
                backgroundColor: bgColor
            },
            headerLargeTitleStyle: {
                color: color
            },
            title: filterTitle(filterType!)
        })
    }, [filterTitle, navigation, bgColor, color])

    useStatusBarColor('dark')

    if (loading || !filterType) return <Loading />

    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <ScrollView
                style={{ flex: 1 }}
                contentInsetAdjustmentBehavior="automatic"
            >
                <FlatList
                    scrollEnabled={false}
                    contentContainerStyle={{
                        padding: SIZES.padding,
                        gap: SIZES.padding
                    }}
                    showsVerticalScrollIndicator={false}
                    data={results}
                    renderItem={renderReferrals}
                />
            </ScrollView>
        </View>

        // <Screen>
        //     <Header
        //         onPressBack={() => router.back()}
        //         title={filterTitle(filterType)}
        //         hasRightIcon
        //         rightIcon={
        //             <TouchableOpacity
        //                 onPress={() => {
        //                     setSearching((prev) => {
        //                         if (prev) {
        //                             return false
        //                         }
        //                         setFiltered(referrals)
        //                         return true
        //                     })
        //                 }}
        //                 style={{ marginRight: SIZES.padding }}
        //             >
        //                 <FontAwesome
        //                     name={searching ? 'times' : 'search'}
        //                     color={color}
        //                     size={26}
        //                 />
        //             </TouchableOpacity>
        //         }
        //     />
        //     <AnimatePresence>
        //         {searching && (
        //             <MotiView
        //                 style={{ paddingHorizontal: SIZES.padding }}
        //                 from={{ opacity: 0, translateY: -20 }}
        //                 animate={{ opacity: 1, translateY: 0 }}
        //                 exit={{ opacity: 0, translateY: -20 }}
        //                 transition={{ type: 'timing', duration: 400 }}
        //             >
        //                 <TextInput
        //                     placeholder="Search by name, email or phone"
        //                     onChangeText={handleSearch}
        //                 />
        //             </MotiView>
        //         )}
        //     </AnimatePresence>
        //     <FlatList
        //         contentContainerStyle={{
        //             padding: SIZES.padding,
        //             gap: SIZES.padding
        //         }}
        //         showsVerticalScrollIndicator={false}
        //         data={searching ? filtered : data}
        //         renderItem={renderReferrals}
        //     />
        // </Screen>
    )
}

export default FilteredReferrals
