import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import FeedBottomSheet from '@/common/components/feed/FeedBottomSheet'
import FeedCard from '@/common/components/feed/FeedCard'
import { useFeeds } from '@/common/hooks/feeds/useFeeds'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { schedulePushNotification } from '@/common/hooks/useNotification'
import { SIZES } from '@/constants/Sizes'
import { deleteFeed, updateFeed } from '@/features/feeds/feedsActions'
import { Feed } from '@/types'
import BottomSheet from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { Button, FlatList, ListRenderItem, StyleSheet } from 'react-native'

const Feeds = () => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const { loading, feeds } = useFeeds()
    const [feed, setFeed] = React.useState<Feed | null>(null)
    const user = useAppSelector((s) => s.auth.user)

    const [shouldFocus, setShouldFocus] = React.useState(false)

    const dispatch = useAppDispatch()
    const onLikePress = (feed: Feed) => {
        try {
            const feedFCopy = { ...feed }

            const wasLikedIndex = feedFCopy.likes.indexOf(user?.id!)
            if (wasLikedIndex > -1) {
                feedFCopy.likes = feedFCopy.likes.filter(
                    (id) => id !== user?.id!
                )
            } else {
                const f = [...feedFCopy.likes, user?.id!]
                feedFCopy.likes = f
            }
            dispatch(updateFeed(feedFCopy))
        } catch (error) {
            console.log('Error updating feed', error)
        }
    }
    const renderFeeds: ListRenderItem<Feed> = ({ item }) => {
        return (
            <FeedCard
                feed={item}
                onLikePress={() => {
                    onLikePress(item)
                }}
                onDeletePress={(id) => {
                    dispatch(deleteFeed(id))
                }}
                onCommentPress={(shouldFocus) => {
                    setShouldFocus(shouldFocus)
                    setFeed(item)
                    bottomSheetRef.current?.snapToIndex(3)
                }}
            />
        )
    }

    useEffect(() => {
        setTimeout(() => {
            schedulePushNotification()
        }, 3000)
    }, [])

    if (loading) return <Loading />

    return (
        <Screen>
            {feeds.length === 0 && (
                <View style={styles.center}>
                    <Text style={{ fontSize: 20 }}>No posts yet</Text>
                    <View style={{ marginTop: SIZES.padding * 3 }}>
                        <Button
                            title="Add First Post"
                            onPress={() => {
                                router.push('/(app)/(root)/(feeds)/addFeedView')
                            }}
                        />
                    </View>
                </View>
            )}
            {feeds.length > 0 && (
                <FlatList
                    data={feeds}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 6,
                        gap: SIZES.padding
                    }}
                    keyExtractor={(item) => item.id!}
                    renderItem={renderFeeds}
                />
            )}
            <FeedBottomSheet
                ref={bottomSheetRef}
                feedId={feed?.id!}
                shouldFocus={shouldFocus}
            />
        </Screen>
    )
}

export default Feeds

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
