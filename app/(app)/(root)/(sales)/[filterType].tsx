import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import React, { useState } from 'react'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import { router, useLocalSearchParams } from 'expo-router'
import { Referral, ReferralsFilterType } from '@/types'
import Header from '@/common/components/Header'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import Loading from '@/common/components/Loading'
import { getResults } from '@/utils/getReferralsFilterData'
import { SIZES } from '@/constants/Sizes'
import { FontAwesome } from '@expo/vector-icons'
import { AnimatePresence, MotiView } from 'moti'
import TextInput from '@/common/components/TextInput'
import useThemeColor from '@/common/hooks/useThemeColor'
import { filterTitle } from '@/utils/filterTitle'
import Styles from '@/constants/Styles'
import View from '@/common/components/View'
import Row from '@/common/components/Row'
import moment from 'moment'

const FilteredReferrals = () => {
    const { filterType } = useLocalSearchParams<{
        filterType: ReferralsFilterType
    }>()
    const color = useThemeColor('text')
    const bgColor = useThemeColor('background')
    const [searching, setSearching] = useState(false)
    const { loading, referrals } = useReferrals()
    if (loading) return <Loading />

    const data = getResults(referrals, filterType)

    const renderReferrals: ListRenderItem<Referral> = ({ item }) => {
        return (
            <TouchableOpacity
                style={[
                    Styles.boxShadow,
                    styles.card,
                    ,
                    { backgroundColor: bgColor }
                ]}
                onPress={() =>
                    router.push(`/(app)/(root)/(sales)/details/${item.id}`)
                }
            >
                <Text
                    style={{ marginBottom: SIZES.base }}
                    center
                    fontFamily="SFBold"
                >
                    {item.name}
                </Text>
                <View style={{ gap: SIZES.base }}>
                    <Text fontFamily="QSLight">
                        {item.address.slice(0, item.address.length - 5)}
                    </Text>
                    <Text fontFamily="QSLight">
                        Apt / Unit or FLR: {item.apt}
                    </Text>
                    <Row style={{ justifyContent: 'space-between' }}>
                        <Text fontFamily="QSBold">
                            Move In:{' '}
                            <Text fontFamily="QSLight">
                                {moment(item.moveIn).format('LL')}
                            </Text>
                        </Text>
                        <Text fontFamily="QSLight">
                            ({moment(item.moveIn).fromNow()})
                        </Text>
                    </Row>
                </View>
                {item.status.id === 'closed' && (
                    <Row
                        style={{
                            justifyContent: 'space-between',
                            marginTop: SIZES.base
                        }}
                    >
                        <Text fontFamily="QSBold">
                            Closed On:{' '}
                            <Text fontFamily="QSLight">
                                {moment(item.order_date).format('lll')}
                            </Text>
                        </Text>

                        <Text fontFamily="QSLight">
                            ({moment(item.moveIn).fromNow()})
                        </Text>
                    </Row>
                )}
                <Text center style={{ marginTop: SIZES.base }}>
                    Status: {item.status.name}
                </Text>
            </TouchableOpacity>
        )
    }
    return (
        <Screen>
            <Header
                onPressBack={router.back}
                title={filterTitle(filterType)}
                hasRightIcon
                rightIcon={
                    <TouchableOpacity style={{ marginRight: SIZES.padding }}>
                        <FontAwesome
                            name={searching ? 'times' : 'search'}
                            color={color}
                            size={26}
                            onPress={() => setSearching(!searching)}
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
                            onChangeText={(text) => {}}
                        />
                    </MotiView>
                )}
            </AnimatePresence>
            <FlatList
                contentContainerStyle={{ padding: SIZES.padding }}
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={renderReferrals}
            />
        </Screen>
    )
}

export default FilteredReferrals

const styles = StyleSheet.create({
    card: {
        padding: SIZES.base,
        borderRadius: SIZES.radius
    }
})
