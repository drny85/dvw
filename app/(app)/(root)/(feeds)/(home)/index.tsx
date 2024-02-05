import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import FeedBottomSheet from '@/common/components/feed/FeedBottomSheet'
import FeedCard from '@/common/components/feed/FeedCard'
import { useAuth } from '@/common/hooks/auth/useAuth'
import { useFeeds } from '@/common/hooks/feeds/useFeeds'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'

import { deleteFeed, updateFeed } from '@/features/feeds/feedsActions'
import { setView } from '@/features/feeds/feedsSlide'

import { Feed } from '@/types'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useRef } from 'react'

import { Button, FlatList, ListRenderItem, StyleSheet } from 'react-native'

const Feeds = () => {
    useAuth()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const { feeds, loading } = useFeeds()
    const [feed, setFeed] = React.useState<Feed | null>(null)
    const user = useAppSelector((s) => s.auth.user)
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present()
    }, [])

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
    const renderFeeds: ListRenderItem<Feed> = useCallback(({ item }) => {
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
                    handlePresentModalPress()
                }}
            />
        )
    }, [])

    useEffect(() => {
        if (feeds.length === 0) {
            dispatch(setView('feeds'))
        }
    }, [feeds.length])

    if (loading) return <Loading />

    return (
        <Screen>
            <Row
                style={{
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.base,
                    marginTop: SIZES.base
                }}
            >
                <View />
            </Row>
            {feeds.length === 0 && (
                <View style={styles.center}>
                    <Text style={{ fontSize: 20 }}>No posts yet</Text>
                    <View style={{ marginTop: SIZES.padding * 3 }}>
                        <Button
                            title="Add First Post"
                            onPress={() => {
                                if (user?.acceptedEULA) {
                                    router.push(
                                        '/(app)/(root)/(feeds)/addFeedView'
                                    )
                                } else {
                                    router.push('/(app)/(root)/(feeds)/eula')
                                }
                            }}
                        />
                    </View>
                </View>
            )}
            {feeds.length > 0 && (
                <>
                    {/* <Header
                        title="Posts"
                        contentContainerStyle={{ paddingRight: 10 }}
                        hasRightIcon
                        rightIcon={
                           
                        }
                    /> */}

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
                </>
            )}

            <FeedBottomSheet
                ref={bottomSheetModalRef}
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
