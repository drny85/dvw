import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import TextInput from '@/common/components/TextInput'
import ReferralCard from '@/common/components/referrals/ReferralCard'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { Referral } from '@/types'
import { filterTitle } from '@/utils/filterTitle'
import { getResults } from '@/utils/getReferralsFilterData'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native'

const FilteredReferrals = () => {
    const filterType = useAppSelector((s) => s.referrals.filtered)
    const user = useAppSelector((s) => s.auth.user)
    const color = useThemeColor('text')
    const bgColor = useThemeColor('background')
    const [searching, setSearching] = useState(false)
    const { loading, referrals } = useReferrals(user?.id!)
    const [filtered, setFiltered] = useState<Referral[]>([])

    const data = getResults(referrals, filterType!)

    const handleSearch = (value: string) => {
        if (value.length > 0) {
            setSearching(true)
        } else {
            setSearching(false)
        }
        const f = referrals.filter((r) => {
            const regex = new RegExp(`${value}`, 'gi')
            return (
                r.name.match(regex) ||
                r.address.match(regex) ||
                (r.status.id === 'closed' && r.mon?.match(regex)) ||
                r.phone.match(regex)
            )
        })
        setFiltered(f)
    }

    const renderReferrals: ListRenderItem<Referral> = ({ item }) => {
        return <ReferralCard item={item} bgColor={bgColor} />
    }

    if (loading || !filterType) return <Loading />

    return (
        <Screen>
            <Header
                onPressBack={() => router.back()}
                title={filterTitle(filterType)}
                hasRightIcon
                rightIcon={
                    <TouchableOpacity
                        onPress={() => {
                            setSearching((prev) => {
                                if (prev) {
                                    return false
                                }
                                setFiltered(referrals)
                                return true
                            })
                        }}
                        style={{ marginRight: SIZES.padding }}
                    >
                        <FontAwesome
                            name={searching ? 'times' : 'search'}
                            color={color}
                            size={26}
                        />
                    </TouchableOpacity>
                }
            />
            <AnimatePresence>
                {searching && (
                    <MotiView
                        style={{ paddingHorizontal: SIZES.padding }}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -20 }}
                        transition={{ type: 'timing', duration: 400 }}
                    >
                        <TextInput
                            placeholder="Search by name, email or phone"
                            onChangeText={handleSearch}
                        />
                    </MotiView>
                )}
            </AnimatePresence>
            <FlatList
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.padding
                }}
                showsVerticalScrollIndicator={false}
                data={searching ? filtered : data}
                renderItem={renderReferrals}
            />
        </Screen>
    )
}

export default FilteredReferrals
