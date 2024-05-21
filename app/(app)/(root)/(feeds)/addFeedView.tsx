import DateModal from '@/common/components/DateModal'
import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Switcher from '@/common/components/Switcher'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import FeedCard from '@/common/components/feed/FeedCard'
import LineSetter from '@/common/components/myPlan/LineSetter'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { addFeed } from '@/features/feeds/feedsActions'
import { Feed, FeedType, SaleType } from '@/types'
import { analyzeTextForToxicity } from '@/utils/moderateMessage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { z } from 'zod'

const scheme = z.object({
    title: z.string().min(2),
    message: z.string().min(6)
})

type FormValues = z.infer<typeof scheme>

const AddFeedModal = () => {
    const router = useRouter()
    const [messageCopy, setMessageCopy] = useState('')
    const [feedType, setFeedType] = useState<FeedType>()
    const [saleType, setSaleType] = useState<SaleType | null>(null)
    const [numberOfLines, setNumberOfLines] = useState<number>(1)
    const loading = useAppSelector((s) => s.feeds.loading)
    const dispatch = useAppDispatch()
    const bgColor = useThemeColor('primary')
    const bgAccent = useThemeColor('accent')
    const user = useAppSelector((s) => s.auth.user)
    const [reviewFeed, setReviewFeed] = useState(false)
    const [showDate, setShowDate] = useState(false)
    const [isFromAnotherDay, setIsFromAnotherDay] = useState(false)
    const image = Math.floor(Math.random() * 9)
    const [createdAt, setCreatedAt] = useState(new Date().toISOString())
    const onSubmit = async (data: FormValues) => {
        const res = await analyzeTextForToxicity(data.message)
        const titleCkeck = await analyzeTextForToxicity(data.title)

        if (res || titleCkeck) {
            Alert.alert('Message is not appropiate')
            return
        }
        const newFeed: Feed = {
            commentsCount: 0,
            createdAt: createdAt,
            comments: [],
            liked: false,
            likes: [],
            message: data.message,
            title: data.title,
            user: user!,
            likesCount: 0,
            numberOfLines: saleType ? numberOfLines : 0,
            image: String(image),
            feedType: feedType!,
            saleType
        }

        try {
            dispatch(addFeed(newFeed))
            reset()
            setFeedType(undefined)
            setIsFromAnotherDay(false)
            setCreatedAt(new Date().toISOString())

            router.back()
        } catch (error) {
            console.log(error)
        }
    }
    const {
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isLoading, isSubmitting, isValid }
    } = useForm<FormValues>({
        resolver: zodResolver(scheme),
        defaultValues: {
            title: '',
            message: ''
        }
    })
    useStatusBarColor('dark')

    if (loading) return <Loading />

    if (reviewFeed) {
        const values = getValues()
        const newFeed: Feed = {
            commentsCount: 0,
            createdAt: new Date().toISOString(),
            comments: [],
            liked: false,
            likes: [],
            message: values.message,
            title: values.title,
            user: user!,
            likesCount: 0,
            numberOfLines: saleType ? numberOfLines : 0,
            image: String(image),
            feedType: feedType!,
            saleType
        }
        return (
            <Screen>
                <Header
                    onPressBack={() => setReviewFeed(false)}
                    title="Review Post"
                />
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {feedType === 'feed' && (
                        <Text
                            style={{ marginBottom: 6 }}
                            fontFamily="OWRegelar"
                            fontSize={22}
                        >
                            {!isFromAnotherDay
                                ? 'From Today'
                                : `From ${moment(createdAt).format('ll')}`}
                        </Text>
                    )}
                    <FeedCard
                        feed={newFeed}
                        onCommentPress={() => {}}
                        onLikePress={() => {}}
                        onDeletePress={() => {}}
                    />

                    <View style={{ marginTop: SIZES.padding * 2 }}>
                        <Button
                            title={'Add Post'}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </View>
            </Screen>
        )
    }

    if (!feedType) {
        return (
            <Screen>
                <Header
                    onPressBack={() => router.back()}
                    title="Select a Post Type"
                />
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            gap: SIZES.padding * 2
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                padding: SIZES.padding,
                                borderRadius: SIZES.radius * 3,
                                backgroundColor: bgAccent,
                                justifyContent: 'center',
                                alignItems: 'center',
                                ...Styles.boxShadow
                            }}
                            onPress={() => {
                                setFeedType('feed')
                            }}
                        >
                            <Text
                                color="white"
                                fontSize={18}
                                fontFamily="SFBold"
                            >
                                Wireless Sale
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                padding: SIZES.padding,
                                borderRadius: SIZES.radius * 3,
                                backgroundColor: bgAccent,
                                justifyContent: 'center',
                                alignItems: 'center',
                                ...Styles.boxShadow
                            }}
                            onPress={() => {
                                setFeedType('quote')
                                setIsFromAnotherDay(false)
                                setCreatedAt(new Date().toISOString())
                            }}
                        >
                            <Text
                                color="white"
                                fontSize={18}
                                fontFamily="SFBold"
                            >
                                Inspirational Quotes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Screen>
        )
    }

    return (
        <Screen>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                keyboardVerticalOffset={60}
            >
                <ScrollView style={{ flex: 1 }}>
                    {feedType === 'feed' && (
                        <>
                            <Header
                                title="Add Post"
                                onPressBack={() => {
                                    if (saleType) {
                                        setSaleType(null)
                                    }
                                    if (feedType) {
                                        setFeedType(undefined)
                                    } else {
                                        router.back()
                                    }
                                }}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    padding: SIZES.padding,
                                    gap: SIZES.padding * 2
                                }}
                            >
                                <View>
                                    {!saleType && (
                                        <Text
                                            style={{
                                                paddingTop: SIZES.padding
                                            }}
                                            fontFamily="SFBold"
                                            fontSize={20}
                                            center
                                        >
                                            Select a Type of Sale
                                        </Text>
                                    )}
                                    {TotalLines(
                                        reset,
                                        saleType,
                                        setSaleType,
                                        bgAccent,
                                        bgColor
                                    )}
                                </View>

                                <AnimatePresence>
                                    {saleType && (
                                        <MotiView
                                            from={{
                                                opacity: 0,
                                                translateY: -20
                                            }}
                                            animate={{
                                                opacity: 1,
                                                translateY: 0
                                            }}
                                            exit={{
                                                opacity: 0,
                                                translateY: -20
                                            }}
                                            transition={{
                                                type: 'timing',
                                                duration: 300,
                                                delay: 500
                                            }}
                                        >
                                            <View style={{ gap: SIZES.base }}>
                                                <Text
                                                    fontFamily="SFBold"
                                                    fontSize={20}
                                                    center
                                                >
                                                    How Many Lines?
                                                </Text>
                                                <LineSetter
                                                    onAddLine={() => {
                                                        setNumberOfLines(
                                                            numberOfLines + 1
                                                        )
                                                    }}
                                                    onRemoveLine={() => {
                                                        setNumberOfLines(
                                                            (prev) =>
                                                                prev > 1
                                                                    ? prev - 1
                                                                    : prev
                                                        )
                                                    }}
                                                    data={numberOfLines}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    gap: SIZES.padding * 1.5,
                                                    marginTop:
                                                        SIZES.padding * 1.5
                                                }}
                                            >
                                                <View>
                                                    <Controller
                                                        control={control}
                                                        rules={{
                                                            required: true
                                                        }}
                                                        render={({
                                                            field: {
                                                                onChange,
                                                                onBlur,
                                                                value
                                                            }
                                                        }) => (
                                                            <TextInput
                                                                placeholder="A title for your post"
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                autoCapitalize="words"
                                                                onChangeText={
                                                                    onChange
                                                                }
                                                                value={value}
                                                                error={
                                                                    errors.title &&
                                                                    errors.title
                                                                        .message
                                                                }
                                                            />
                                                        )}
                                                        name="title"
                                                    />
                                                </View>
                                                <View>
                                                    <Controller
                                                        control={control}
                                                        render={({
                                                            field: {
                                                                onChange,
                                                                onBlur,
                                                                value
                                                            }
                                                        }) => (
                                                            <TextInput
                                                                placeholder="A message for your post"
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                textAlign="center"
                                                                isMultiline={
                                                                    true
                                                                }
                                                                onChangeText={
                                                                    onChange
                                                                }
                                                                value={value}
                                                                error={
                                                                    errors.message &&
                                                                    errors
                                                                        .message
                                                                        .message
                                                                }
                                                            />
                                                        )}
                                                        name="message"
                                                    />
                                                </View>

                                                <View
                                                    style={{
                                                        marginTop:
                                                            SIZES.padding * 2,
                                                        gap: SIZES.padding
                                                    }}
                                                >
                                                    <Text
                                                        style={{ marginTop: 6 }}
                                                        fontFamily="QSBold"
                                                        center
                                                    >
                                                        Sale Date:{' '}
                                                        {moment(
                                                            createdAt
                                                        ).format('ll')}
                                                    </Text>
                                                    <Switcher
                                                        value={isFromAnotherDay}
                                                        title="Is sale from another day?"
                                                        onValueChange={() =>
                                                            setIsFromAnotherDay(
                                                                (prev) => {
                                                                    if (!prev) {
                                                                        setShowDate(
                                                                            true
                                                                        )
                                                                    } else {
                                                                        setShowDate(
                                                                            false
                                                                        )
                                                                        setCreatedAt(
                                                                            new Date().toISOString()
                                                                        )
                                                                    }
                                                                    return !prev
                                                                }
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        disabled={
                                                            isLoading ||
                                                            isSubmitting ||
                                                            !isValid
                                                        }
                                                        title={'Review Post'}
                                                        onPress={() => {
                                                            if (
                                                                feedType ===
                                                                'feed'
                                                            ) {
                                                                if (
                                                                    numberOfLines ===
                                                                    0
                                                                ) {
                                                                    Alert.alert(
                                                                        'Please select a number of lines'
                                                                    )
                                                                    return
                                                                }
                                                            }
                                                            setReviewFeed(true)
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </MotiView>
                                    )}
                                </AnimatePresence>
                            </View>
                        </>
                    )}
                    {feedType === 'quote' && (
                        <>
                            <Header
                                title="Add Quote"
                                onPressBack={() => {
                                    if (feedType) {
                                        setFeedType(undefined)
                                    } else {
                                        router.back()
                                    }
                                }}
                            />
                            <View style={{ flex: 1, gap: SIZES.padding }}>
                                <MotiView
                                    style={{
                                        padding: SIZES.padding,
                                        gap: SIZES.padding * 2
                                    }}
                                >
                                    <View style={{ marginBottom: 40 }}>
                                        <Controller
                                            control={control}
                                            render={({
                                                field: {
                                                    onChange,
                                                    onBlur,
                                                    value
                                                }
                                            }) => (
                                                <TextInput
                                                    placeholder="Type a quote or inspirational message"
                                                    onBlur={() => {
                                                        onBlur()
                                                    }}
                                                    isMultiline={true}
                                                    onChangeText={(text) => {
                                                        onChange(text)
                                                        setMessageCopy(value)
                                                    }}
                                                    style={{
                                                        fontFamily: 'QSRegular'
                                                    }}
                                                    maxLength={246}
                                                    value={value}
                                                    error={
                                                        errors.message &&
                                                        errors.message.message
                                                    }
                                                />
                                            )}
                                            name="message"
                                        />
                                        <Text color="grey">
                                            {messageCopy.length} / 246
                                        </Text>
                                    </View>

                                    <View>
                                        <Controller
                                            control={control}
                                            rules={{
                                                required: true
                                            }}
                                            render={({
                                                field: {
                                                    onChange,
                                                    onBlur,
                                                    value
                                                }
                                            }) => (
                                                <TextInput
                                                    placeholder="Author"
                                                    onBlur={() => {
                                                        onBlur()
                                                    }}
                                                    autoCapitalize="words"
                                                    onChangeText={onChange}
                                                    value={value}
                                                    error={
                                                        errors.title &&
                                                        errors.title.message
                                                    }
                                                    style={{
                                                        fontFamily: 'QSRegular',
                                                        borderRadius:
                                                            SIZES.radius
                                                    }}
                                                />
                                            )}
                                            name="title"
                                        />
                                    </View>

                                    <View style={{ marginTop: SIZES.padding }}>
                                        <Button
                                            disabled={
                                                isLoading ||
                                                isSubmitting ||
                                                !isValid
                                            }
                                            title={'Review Post'}
                                            onPress={() => {
                                                if (isValid) {
                                                    setReviewFeed(true)
                                                }
                                            }}
                                        />
                                    </View>
                                </MotiView>
                            </View>
                        </>
                    )}
                    <DateModal
                        date={createdAt}
                        maxDate={new Date().toISOString()}
                        onChange={(event, date) => {
                            if (date) {
                                setCreatedAt(date?.toISOString())
                                setShowDate(false)
                            }
                        }}
                        show={showDate}
                        setShow={() => {
                            setCreatedAt(new Date().toISOString())
                            setShowDate(false)
                            setIsFromAnotherDay(false)
                        }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    )
}

export default AddFeedModal

function TotalLines(
    reset: Function,
    saleType: string | null,
    setSaleType: React.Dispatch<React.SetStateAction<SaleType | null>>,
    bgAccent: string,
    bgColor: string
) {
    return (
        <MotiView
            style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            animate={{
                translateY: saleType === null ? SIZES.height / 2 - 150 : 0
            }}
            transition={{ type: 'timing', duration: 200 }}
        >
            <TouchableOpacity
                onPress={() => {
                    reset()
                    setSaleType('direct')
                }}
                style={{
                    borderRadius: SIZES.radius * 3,
                    paddingHorizontal: SIZES.padding * 2,
                    paddingVertical: SIZES.base,
                    backgroundColor: saleType === 'direct' ? bgAccent : bgColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...Styles.boxShadow
                }}
            >
                <Text
                    fontFamily={'SFBold'}
                    fontSize={18}
                    color={saleType === 'direct' ? 'white' : 'text'}
                >
                    Direct Sale
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    reset()
                    setSaleType('c2c')
                }}
                style={{
                    borderRadius: SIZES.radius * 3,
                    paddingHorizontal: SIZES.padding,
                    paddingVertical: SIZES.base,
                    backgroundColor: saleType === 'c2c' ? bgAccent : bgColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...Styles.boxShadow
                }}
            >
                <Text
                    fontFamily={'SFBold'}
                    color={saleType === 'c2c' ? 'white' : 'text'}
                    fontSize={18}
                >
                    Click to Call
                </Text>
            </TouchableOpacity>
        </MotiView>
    )
}
