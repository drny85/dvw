import DateTimePickerComponent from '@/common/components/DateTimePicker'
import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { Referral } from '@/types'
import { shareCSV } from '@/utils/shareFile'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, FlatList, TouchableOpacity } from 'react-native'

const Spark = () => {
    const user = useAppSelector((state) => state.auth.user)
    const [from, setFrom] = useState(new Date())
    const [sortBy, setSortBy] = useState<'name' | 'install'>('install')
    const [to, setTo] = useState(new Date())
    const [filter, setFilter] = useState(false)
    const [generating, setGenerating] = useState(false)
    const { loading, referrals } = useReferrals(user?.id!)
    const textColor = useThemeColor('text')
    const secColor = useThemeColor('accent')
    const btnColor = useThemeColor('button')
    const bgColor = useThemeColor('background')
    const [data, setData] = useState<Referral[]>([])

    const getResults = useCallback(() => {
        if (to.getTime() <= from.getTime()) {
            Alert.alert('Error', 'To date must be greater than From date')
            return
        }

        setData(
            referrals
                .filter(
                    (r) =>
                        r.status.id === 'closed' &&
                        r.mon &&
                        !r.isVerizonWirelessCustomer
                )
                .filter((d) => moment(d.due_date).isBetween(from, to))
        )
        setFilter(false)
    }, [to, from])

    const generateFile = async () => {
        if (data.length === 0) return

        try {
            const d = data.map((r) => ({
                name: r.name.split(' ')[0],
                lastName: r.name.split(' ')[1],
                email: r.email
            }))

            setGenerating(true)

            await shareCSV(d, 'myWirelessLeads')
        } catch (error) {
            console.log(error)
        } finally {
            setGenerating(false)
        }
    }

    useEffect(() => {
        setData(
            referrals.filter(
                (r) =>
                    r.status.id === 'closed' &&
                    r.mon &&
                    !r.isVerizonWirelessCustomer
            )
        )
    }, [referrals.length])

    if (loading) return <Loading />

    if (generating)
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: bgColor,
                    padding: SIZES.base
                }}
            >
                <LottieView
                    style={{ flex: 1 }}
                    autoPlay
                    source={require('@/assets/animations/vzw.json')}
                    resizeMode="contain"
                />
                <View style={{ paddingBottom: SIZES.padding * 3.5 }}>
                    <Text center fontFamily="Lora" fontSize={22}>
                        Getting All Non-Verizon Wireless Customers
                    </Text>
                </View>
            </View>
        )
    return (
        <View
            style={{
                flex: 1,
                paddingTop: SIZES.statusBarHeight,
                paddingBottom: SIZES.padding,
                position: 'relative'
            }}
        >
            <Header
                title={`Non-VZW - ${data.length}`}
                onPressBack={router.back}
                hasRightIcon
                rightIcon={
                    <TouchableOpacity
                        style={{ marginRight: SIZES.padding }}
                        onPress={() => setFilter((p) => !p)}
                    >
                        <FontAwesome
                            name="filter"
                            size={26}
                            color={textColor}
                        />
                    </TouchableOpacity>
                }
            />
            <View
                style={{
                    backgroundColor: secColor,
                    padding: SIZES.base,
                    borderRadius: SIZES.radius,
                    margin: SIZES.base
                }}
            >
                <Row
                    style={{
                        justifyContent: 'space-between',
                        paddingHorizontal: SIZES.padding
                    }}
                >
                    <Text
                        color="white"
                        fontFamily="SFBold"
                        onPress={() => setSortBy('name')}
                    >
                        Name
                    </Text>
                    <Text
                        color="white"
                        fontFamily="SFBold"
                        onPress={() => setSortBy('install')}
                    >
                        Install Date
                    </Text>
                </Row>
            </View>
            <FlatList
                data={data.sort((a, b) =>
                    sortBy === 'install'
                        ? a?.due_date!.localeCompare(b?.due_date!)
                        : a.name > b.name
                        ? 1
                        : -1
                )}
                keyExtractor={(item) => item.id!}
                contentContainerStyle={{ marginTop: SIZES.base }}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            paddingHorizontal: SIZES.base * 1.5,
                            paddingVertical: SIZES.padding
                        }}
                    >
                        <Row style={{ justifyContent: 'space-between' }}>
                            <Text fontFamily="QSBold">
                                {index + 1} - {item.name}
                            </Text>

                            <Text>{moment(item.due_date).format('L')}</Text>
                        </Row>
                    </View>
                )}
            />

            <View
                style={{
                    marginVertical: SIZES.padding,

                    padding: SIZES.base
                }}
            >
                <Button title=" Generate CSV" onPress={generateFile} />
            </View>

            <AnimatePresence>
                {filter && (
                    <MotiView
                        transition={{ type: 'timing', duration: 500 }}
                        exit={{ opacity: 0, translateY: 10 }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 120,
                            backgroundColor: 'grey',
                            borderRadius: SIZES.radius * 2,
                            padding: SIZES.padding
                        }}
                        from={{ opacity: 0, translateY: 0 }}
                        animate={{
                            opacity: 1,
                            translateY: 10,
                            height: SIZES.height * 0.5,
                            position: 'absolute',
                            backgroundColor: secColor,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 120
                        }}
                    >
                        <Text
                            color="white"
                            center
                            fontFamily="QSBold"
                            fontSize={22}
                        >
                            Select a Range
                        </Text>
                        <View
                            style={{
                                padding: SIZES.padding,
                                marginTop: SIZES.padding,
                                gap: SIZES.padding * 2,
                                width: '70%',
                                alignSelf: 'center'
                            }}
                        >
                            <Row
                                style={{
                                    alignItems: 'center',
                                    gap: SIZES.base,
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Text color="white" fontFamily="QSBold">
                                    From
                                </Text>
                                <DateTimePickerComponent
                                    onVisibilityChange={() => {}}
                                    mode="date"
                                    //maximumDate={new Date()}
                                    maximumDate={moment().toDate()}
                                    minimumDate={moment()
                                        .startOf('year')
                                        .toDate()}
                                    isVisible
                                    value={from}
                                    onDateChange={(date) => {
                                        setFrom(date)
                                    }}
                                />
                            </Row>
                            <Row
                                style={{
                                    alignItems: 'center',
                                    gap: SIZES.base,
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Text color="white" fontFamily="QSBold">
                                    To
                                </Text>
                                <DateTimePickerComponent
                                    onVisibilityChange={() => {}}
                                    mode="date"
                                    isVisible
                                    value={to}
                                    maximumDate={moment().toDate()}
                                    minimumDate={moment()
                                        .startOf('year')
                                        .toDate()}
                                    onDateChange={(date) => {
                                        setTo(date)
                                    }}
                                />
                            </Row>
                            <View
                                style={{
                                    marginTop: SIZES.padding,
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={getResults}
                                    style={{
                                        borderRadius: SIZES.radius,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: btnColor,
                                        paddingVertical: SIZES.base,
                                        paddingHorizontal: SIZES.padding
                                    }}
                                >
                                    <Text
                                        color="white"
                                        fontFamily="QSBold"
                                        fontSize={22}
                                    >
                                        View Results
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </MotiView>
                )}
            </AnimatePresence>
        </View>
    )
}

export default Spark
