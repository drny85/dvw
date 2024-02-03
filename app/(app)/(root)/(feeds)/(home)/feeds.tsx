import Divider from '@/common/components/Divider'
import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { useAllReferrals } from '@/common/hooks/referrals/useAllReferrals'

import { SIZES } from '@/constants/Sizes'
import { ReferralSold } from '@/types'
import moment from 'moment'
import { MotiView } from 'moti'
import React, { useRef } from 'react'
import { Animated, FlatList, ListRenderItem } from 'react-native'

const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList<ReferralSold>
)
const feeds = () => {
    const flatListRef = useRef<FlatList>(null)
    const scrollY = useRef(new Animated.Value(0)).current
    const { sales, loading } = useAllReferrals()

    const data = sales
        .filter((r) =>
            moment(r.date).isBetween(
                moment(new Date()).subtract(2, 'days').startOf('day'),
                moment(new Date()).endOf('day')
            )
        )
        .sort((a, b) => moment(a.date).diff(moment(b.date)))

    const generatePackage = (serive: ReferralSold['services']) => {
        {
            serive && serive.internet && serive.internet.name + ', '
        }
        {
            serive && serive.tv && serive.tv.name + ', '
        }
        {
            serive && serive.home && serive.home.name
        }
        if (!serive) {
            return null
        }
        const i = serive && serive.internet ? serive.internet.name : ''
        const tv = serive && serive.tv ? serive.tv.name : ''
        const ph = serive && serive.home ? serive.home.name : ''
        const wireless = serive && serive.wireless ? serive.wireless.name : ''

        const final = i + ' ,' + tv + '' + ph + '' + wireless

        return final
    }

    const renderData: ListRenderItem<ReferralSold> = ({ item, index }) => {
        const serv = generatePackage(item.services)
        return (
            <MotiView
                style={{ padding: SIZES.padding }}
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: index * 100 }}
            >
                <Text fontFamily="SFLight">
                    An order of {serv} was placed on{' '}
                    {moment(item.date).format('lll')} by{' '}
                    <Text capitalize fontFamily="QSBold">
                        {item.seller || 'anonymous'}
                    </Text>
                </Text>
            </MotiView>
        )
    }
    if (loading) return <Loading />
    return (
        <Screen>
            <AnimatedFlatList
                data={data.reverse()}
                ref={flatListRef}
                keyExtractor={(item) => item.id!}
                renderItem={renderData}
                //inverted
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    {
                        useNativeDriver: false
                    }
                )}
                ItemSeparatorComponent={() => <Divider small />}
                ListEmptyComponent={
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 60
                        }}
                    >
                        <Text fontFamily="SFBold">No activities found</Text>
                    </View>
                }
                ListFooterComponent={
                    <View style={{ marginBottom: SIZES.padding }} />
                }
                contentContainerStyle={{
                    padding: SIZES.base,
                    gap: SIZES.base
                }}
                onContentSizeChange={(w, h) => {
                    if (flatListRef.current) {
                        // flatListRef.current.scrollToOffset({
                        //     offset: 0,
                        //     animated: true
                        // })
                    }
                }}
            />
        </Screen>
    )
}

export default feeds
