import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useThemeColor from '@/common/hooks/useThemeColor'
import { useWirelessQuotes } from '@/common/hooks/wirelessQuotes/useWirelessQuotes'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet,
    setLinesData,
    setReviewModal
} from '@/features/wireless/wirelessSlide'
import {
    deleteWirelessQuote,
    updateWirelessQuote
} from '@/features/wirelessQuotes/wirelessQuoteActions'
import { sendEmail } from '@/firebase'
import { Line, WirelessQuote } from '@/types'
import { firstResponderDiscount } from '@/utils/firstResponderDiscount'
import { totalPerksCount } from '@/utils/perksCount'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import moment from 'moment'
import Animated, { FadeOutLeft } from 'react-native-reanimated'
import React from 'react'
import {
    Alert,
    Button,
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import useAppSelector from '@/common/hooks/useAppSelector'

const MyQuotes = () => {
    const { loading, quotes } = useWirelessQuotes()
    const { route } = useAppSelector((s) => s.settings)
    const bgColor = useThemeColor('background')
    const iconColor = useThemeColor('warning')
    const greyColor = useThemeColor('placeholder')
    const btnColor = useThemeColor('border')
    const dispatch = useAppDispatch()
    const [loadingQuote, setLoadingQuote] = React.useState(false)

    const handleSendQuote = async (quoteId: string) => {
        if (!quoteId) return
        try {
            setLoadingQuote(true)
            const func = sendEmail()
            await func({ quoteId })
            Alert.alert('Email sent', 'This quote has been sent!')
        } catch (error) {
            console.log(error)
            const err = error as Error
            Alert.alert('Email Error', err.message)
        } finally {
            setLoadingQuote(false)
        }
    }
    const onPressQuote = (quote: WirelessQuote) => {
        if (quote.hasFios) {
            dispatch(setExpressInternet(quote.internetPlan))
        } else {
            dispatch(setExpressInternet())
        }
        dispatch(setExpressFirstResponder(quote.isFirstResponder))

        dispatch(setExpressAutoPay(quote.isAutoPay ? 10 : 0))
        dispatch(setExpressHasFios(quote.hasFios))
        dispatch(setLinesData(quote.lines))
        dispatch(setReviewModal('review'))
        router.push('/(app)/(root)/(plan)')
    }

    const toggleQuoteStatus = async (q: WirelessQuote) => {
        try {
            dispatch(
                updateWirelessQuote({
                    ...q,
                    status: q.status === 'pending' ? 'closed' : 'pending'
                })
            )
        } catch (error) {
            console.log(error)
        }
    }

    const total = (lines: Line[], isFirstResponder: boolean): number =>
        lines.reduce((acc, line) => acc + line.price, 0) -
        firstResponderDiscount(lines.length, isFirstResponder)

    const onDelete = (quoteId: string) => {
        try {
            if (!quoteId) return

            dispatch(deleteWirelessQuote(quoteId))
        } catch (error) {
            console.log('Error deleting quote', error)
        }
    }

    const renderQuotes: ListRenderItem<WirelessQuote> = ({ index, item }) => {
        return (
            <Animated.View
                exiting={FadeOutLeft}
                style={[
                    Styles.boxShadow,
                    {
                        backgroundColor: !item.sent ? bgColor : 'gray',
                        padding: SIZES.padding,
                        borderRadius: SIZES.radius
                    }
                ]}
            >
                <Row style={{ justifyContent: 'space-between' }}>
                    <Row>
                        <Text>{index + 1} - </Text>
                        <Text fontFamily="SFBold">{item.customerName}</Text>
                    </Row>
                    <Text>
                        {item.lines.length}{' '}
                        {item.lines.length === 1 ? 'line' : 'lines'}
                    </Text>
                    <Row style={{ gap: SIZES.base }}>
                        <TouchableOpacity
                            onPress={() => onDelete(item.quoteId!)}
                        >
                            <FontAwesome
                                name="trash-o"
                                color={iconColor}
                                size={24}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderRadius: SIZES.radius,
                                backgroundColor: 'grey',
                                paddingVertical: SIZES.base,
                                paddingHorizontal: SIZES.base * 2
                            }}
                            onPress={() => onPressQuote(item)}
                        >
                            <Text
                                color="white"
                                fontFamily="SFBold"
                                fontSize={16}
                            >
                                View
                            </Text>
                        </TouchableOpacity>
                    </Row>
                </Row>
                <Divider />
                <Row
                    style={{
                        justifyContent: 'space-between',
                        marginBottom: SIZES.base
                    }}
                >
                    <Text>Perks {totalPerksCount(item.lines)}</Text>
                    <Text>
                        Total{' '}
                        <Text fontFamily="SFBold">
                            ${total(item.lines, item.isFirstResponder)}
                        </Text>
                    </Text>
                </Row>
                <Row style={{ justifyContent: 'space-between' }}>
                    <Text capitalize>
                        Status:{' '}
                        <Text
                            color={
                                item.status === 'closed' ? 'success' : 'warning'
                            }
                        >
                            {item.status}
                        </Text>
                    </Text>
                    <TouchableOpacity onPress={() => toggleQuoteStatus(item)}>
                        <Text
                            fontFamily="SFBold"
                            color={
                                item.status !== 'closed' ? 'success' : 'warning'
                            }
                        >
                            {item.status === 'pending'
                                ? ' Mark as Sold'
                                : 'Mark as Pending'}
                        </Text>
                    </TouchableOpacity>
                </Row>
                <View style={{ gap: SIZES.base, marginTop: SIZES.base }}>
                    {item.phoneNumber && <Text>Phone {item.phoneNumber}</Text>}
                    {item.email && <Text>Email {item.email}</Text>}
                </View>

                {item.message && (
                    <View style={{ padding: SIZES.padding }}>
                        <Text fontFamily="QSLight">{item.message}</Text>
                    </View>
                )}
                <Text fontSize={12} style={{ marginTop: SIZES.base }}>
                    created on: {moment(item.createdAt).format('lll')}
                </Text>
                {item.scheduledOn && (
                    <Text fontSize={12} style={{ marginTop: SIZES.base }}>
                        Follow Up: {moment(item.scheduledOn).format('lll')} (
                        {moment(item.scheduledOn).fromNow()})
                    </Text>
                )}
                {item.sent && item.sentOn && (
                    <Text fontSize={12} style={{ marginTop: SIZES.base }}>
                        sent on: {moment(item.sentOn).format('lll')}
                    </Text>
                )}
                <View style={{ marginTop: SIZES.padding }}>
                    <Button
                        disabled={loadingQuote || item.sent}
                        title={item.sent ? 'Sent' : 'Send Quote'}
                        color={loadingQuote ? greyColor : btnColor}
                        onPress={() => handleSendQuote(item.quoteId!)}
                    />
                </View>
            </Animated.View>
        )
    }

    if (loading) return <Loading />
    return (
        <Screen>
            <Header
                title={`My Quotes (${quotes.length})`}
                onPressBack={() => {
                    if (route === 'myPlan') {
                        router.push(`/(app)/(root)/(plan)`)
                        return
                    }
                    if (router.canGoBack()) {
                        router.back()
                    } else {
                        router.push('/(app)/(root)/(sales)')
                    }
                }}
            />

            <FlatList
                data={quotes.sort((a, b) =>
                    b.createdAt.localeCompare(a.createdAt)
                )}
                renderItem={renderQuotes}
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.padding,
                    marginBottom: 20
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
            />
        </Screen>
    )
}

export default MyQuotes

const styles = StyleSheet.create({})
