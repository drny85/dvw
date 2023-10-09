import { ImageBackground, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feed } from '@/types'
import { TouchableOpacity, Image } from 'react-native'
import useThemeColor from '../../hooks/useThemeColor'
import Text from '../Text'
import View from '../View'
import { useDimensions } from '../../hooks/useDimensions'
import { SIZES } from '@/constants/Sizes'
import ActionView from './ActionView'
import moment from 'moment'
import { MotiView, AnimatePresence } from 'moti'
import { FontAwesome } from '@expo/vector-icons'
import { useComments } from '@/common/hooks/comments/useComments'
import FeedSkeleton from './FeedSkeleton'
import useAppSelector from '@/common/hooks/useAppSelector'

type Props = {
    feed: Feed

    onCommentPress: (shouldFocus: boolean) => void
    onLikePress: (id: string) => void
    onDeletePress: (id: string) => void
}
const FeedCard = ({
    feed,

    onCommentPress,
    onLikePress,
    onDeletePress
}: Props) => {
    const bgColor = useThemeColor('primary')
    const user = useAppSelector((s) => s.auth.user)
    const isMe = feed.user.id === user?.id
    const deleteColor = useThemeColor('warning')
    const editColor = useThemeColor('button')
    const [viewMore, setViewMore] = React.useState(false)
    const [pressAction, setPressAction] = React.useState(false)
    const { comments, loading } = useComments(feed.id!)
    const { value } = useDimensions()
    const toogleViewMore = () => {
        setViewMore(!viewMore)
    }

    // Generate a random phone number
    const photos: { key: string; value: string }[] = [
        { key: 'photo1', value: require('@/assets/images/feeds/1.jpg') },
        { key: 'photo2', value: require('@/assets/images/feeds/2.jpg') },
        { key: 'photo3', value: require('@/assets/images/feeds/3.jpg') },
        { key: 'photo4', value: require('@/assets/images/feeds/4.jpg') },
        { key: 'photo5', value: require('@/assets/images/feeds/5.jpg') },
        { key: 'photo6', value: require('@/assets/images/feeds/6.jpg') },
        { key: 'photo7', value: require('@/assets/images/feeds/7.jpg') },
        { key: 'photo8', value: require('@/assets/images/feeds/8.jpg') },
        { key: 'photo9', value: require('@/assets/images/feeds/9.jpg') }
        // Add more key-value pairs as needed
    ]

    const selectedPhoto = photos[+feed.image]

    if (loading) return <FeedSkeleton />
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing' }}
            exit={{ opacity: 0, scale: 0 }}
            style={[styles.container, { backgroundColor: bgColor }]}
        >
            <ImageBackground
                fadeDuration={600}
                source={
                    feed.feedType === 'quote'
                        ? (selectedPhoto.value as any)
                        : feed.numberOfLines === 1
                        ? require('@/assets/images/posts/one.png')
                        : feed.numberOfLines === 2
                        ? require('@/assets/images/posts/two.png')
                        : require('@/assets/images/posts/more.png')
                }
                style={[
                    styles.image,
                    {
                        maxHeight: value.height * 0.3,
                        height: value.height * 0.3
                    }
                ]}
                resizeMode="cover"
            >
                {feed.feedType === 'quote' ||
                    (feed.numberOfLines > 0 && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.4)'
                            }}
                        />
                    ))}
                {feed.feedType === 'feed' && (
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            padding: SIZES.base
                        }}
                    >
                        <Text
                            capitalize
                            center
                            color="white"
                            fontSize={24}
                            fontFamily="QSLight"
                        >
                            {feed.numberOfLines}{' '}
                            {feed.numberOfLines === 1 ? 'line' : 'lines'}{' '}
                            {feed.saleType === 'direct'
                                ? 'direct sale'
                                : 'click to call'}
                        </Text>
                    </View>
                )}
                {feed.feedType === 'quote' && (
                    <View
                        style={{
                            padding: SIZES.padding,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                            overflow: 'hidden'
                        }}
                    >
                        <Text
                            style={{ lineHeight: 28 }}
                            color="white"
                            fontSize={20}
                            fontFamily="QSBold"
                            center
                        >
                            {feed.message}
                        </Text>
                    </View>
                )}

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        position: 'absolute',
                        top: 0,
                        width: '100%'
                    }}
                >
                    <View
                        style={{
                            padding: SIZES.base,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: SIZES.base
                        }}
                    >
                        <Image
                            style={{ height: 50, width: 50, borderRadius: 25 }}
                            source={
                                feed.user.image
                                    ? { uri: feed.user.image }
                                    : require('@/assets/images/profile.jpg')
                            }
                        />
                        <Text color="white" fontFamily="SFBold" capitalize>
                            {feed.user.name}
                        </Text>
                    </View>
                    {isMe && (
                        <TouchableOpacity
                            style={{ marginRight: SIZES.padding }}
                            onPress={() => {
                                setPressAction(!pressAction)
                            }}
                        >
                            <Text
                                color="white"
                                fontSize={26}
                                fontFamily="SFBold"
                            >
                                ...
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <AnimatePresence>
                    {pressAction && (
                        <MotiView
                            from={{
                                opacity: 0,
                                translateY: -50
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0
                            }}
                            style={{
                                alignSelf: 'flex-end',
                                padding: SIZES.padding,
                                backgroundColor: bgColor,
                                borderRadius: SIZES.radius * 0.5,
                                margin: SIZES.base,
                                position: 'absolute',
                                top: 50
                            }}
                            transition={{ type: 'timing', duration: 600 }}
                            exit={{
                                opacity: 0,
                                translateY: -50
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: SIZES.padding * 2
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => onDeletePress(feed.id!)}
                                >
                                    <FontAwesome
                                        name="trash-o"
                                        size={30}
                                        color={deleteColor}
                                    />
                                </TouchableOpacity>
                                {/* <TouchableOpacity>
                  <FontAwesome name="edit" size={30} color={editColor} />
                </TouchableOpacity> */}
                            </View>
                        </MotiView>
                    )}
                </AnimatePresence>
            </ImageBackground>

            <View style={styles.footer}>
                <ActionView
                    feed={feed}
                    onCommentPress={() => onCommentPress(true)}
                    onLikePress={() => onLikePress(feed.id!)}
                />
                <Text
                    style={{ marginVertical: SIZES.base }}
                    fontFamily="SFBold"
                    fontSize={SIZES.font}
                >
                    {feed.title}
                </Text>
                {feed.feedType === 'feed' && (
                    <Text fontFamily="SFLight">
                        {feed.message.length > 100 && !viewMore
                            ? feed.message.slice(0, 100) + ' ...'
                            : feed.message}
                        {feed.message.length > 100 && !viewMore && (
                            <Text onPress={toogleViewMore}>more</Text>
                        )}
                    </Text>
                )}

                <TouchableOpacity onPress={() => onCommentPress(false)}>
                    {comments.length > 0 && (
                        <Text color="grey" fontFamily="SFLight">
                            View all {comments.length}{' '}
                            {comments.length > 1 ? 'comments' : 'comment'}
                        </Text>
                    )}
                </TouchableOpacity>
                <Text fontFamily="SFLight" color="grey">
                    {moment(feed.createdAt).fromNow()}
                </Text>
            </View>
        </MotiView>
    )
}

export default FeedCard

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 5,
        shadowColor: 'black'
    },
    image: {
        width: '100%'
    },
    footer: {
        padding: SIZES.padding
    }
})
