import Loading from '@/common/components/Loading'
import ProgressCircle from '@/common/components/referrals/ProgressCircle'
import Referrals from '@/common/components/referrals/Referrals'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import { useAllReferrals } from '@/common/hooks/referrals/useAllReferrals'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { setWeeklySalesGoal } from '@/features/settings/settingsSlice'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import { AnimatePresence, MotiView } from 'moti'
import { useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'

const ReferralsScreen = () => {
    useStatusBarColor('light')
    const dispatch = useAppDispatch()
    const iconColor = useThemeColor('text')
    const backgroundColor = useThemeColor('accent')
    const weeklyGoal = useAppSelector((s) => s.settings.weeklySalesGoal)
    const [goal, setGoal] = useState('')
    const user = useAppSelector((s) => s.auth.user)
    const [edit, setEdit] = useState(false)
    const { loading, sales } = useAllReferrals()

    const filteted = useMemo(() => {
        if (user?.role === 'em') return sales
        return sales.filter((s) => s.coach?.id === user?.id)
    }, [sales, user])
    // console.log(JSON.stringify(filteted, null, 2))

    const thisWeek = filteted.filter((s) =>
        moment(s.date).isBetween(
            moment().startOf('week'),
            moment().endOf('week')
        )
    )
    const thisMonth = filteted.filter((s) =>
        moment(s.date).isSame(moment(), 'month')
    )
    const thisYear = filteted.filter((s) =>
        moment(s.date).isSame(moment(), 'year')
    )

    const mappedToServices = filteted.reduce((acc, sale) => {
        if (!sale.services) return acc
        Object.entries(sale.services).forEach((item) => {
            if (!acc[item[1]?.name!]) {
                acc[item[1]?.name!] = 0
            }
            acc[item[1]?.name!] += 1
        })
        return acc
    }, {} as Record<string, number>)
    // console.log(mappedToServices)

    const data = [
        {
            title: 'This Week',
            value: thisWeek.length,
            goal: weeklyGoal
        },
        {
            title: 'This Month',
            value: thisMonth.length,
            goal: weeklyGoal * 4.4
        },
        {
            title: 'This Year',
            value: thisYear.length,
            goal: weeklyGoal * 52
        }
    ]

    if (loading) return <Loading />

    if (user?.role === 'em') return <Referrals />

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <Row style={{ justifyContent: 'space-evenly' }}>
                    <Text center fontFamily="QSBold">
                        This Week Goal:{' '}
                        <Text fontFamily="SFBold" fontSize={26}>
                            {weeklyGoal}
                        </Text>
                    </Text>
                    <TouchableOpacity onPress={() => setEdit((p) => !p)}>
                        <FontAwesome name="edit" size={26} color={iconColor} />
                    </TouchableOpacity>
                </Row>
                <AnimatePresence>
                    {edit && (
                        <MotiView
                            from={{ opacity: 0, translateY: -15 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing' }}
                        >
                            <TextInput
                                style={{
                                    borderRadius: 10,
                                    width: '80%',
                                    alignSelf: 'center',
                                    marginTop: 10
                                }}
                                value={goal}
                                onEndEditing={(e) => {
                                    if (!goal) return

                                    dispatch(
                                        setWeeklySalesGoal(+e.nativeEvent.text)
                                    )
                                    setGoal('')
                                    setEdit(false)
                                }}
                                onChangeText={(text) => {
                                    setGoal(text)
                                }}
                                returnKeyType="done"
                                returnKeyLabel="Update"
                                keyboardType="numeric"
                                placeholder="New Goal"
                            />
                        </MotiView>
                    )}
                </AnimatePresence>
                <Row
                    style={{
                        justifyContent: 'space-evenly',
                        marginVertical: SIZES.padding
                    }}
                >
                    {data.map((item, i) => (
                        <View key={item.title}>
                            <ProgressCircle
                                percentage={(item.value / item.goal) * 100}
                                textColor={iconColor}
                                color={backgroundColor}
                                duration={600}
                                max={100}
                                strokeWidth={10}
                            />
                            <Text fontFamily="QSBold" fontSize={12} center>
                                {item.title} ({item.value.toFixed(0)})
                            </Text>
                        </View>
                    ))}
                </Row>
            </View>
        </Screen>
    )
}

export default ReferralsScreen
