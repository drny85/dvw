import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import FeedsView from '@/common/components/feed/FeedsView'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { cancelNotification } from '@/common/hooks/useNotification'
import { useStatusBarColor } from '@/common/hooks/useStatusBarColor'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { updateReferral } from '@/features/referrals/referralActions'
import { setReferralId } from '@/features/referrals/referralsSlide'
import { Referral } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import moment from 'moment'
import React, { useMemo } from 'react'
import {
    Alert,
    FlatList,
    ListRenderItem,
    Pressable,
    TouchableOpacity
} from 'react-native'

const FollowUps = () => {
    const user = useAppSelector((s) => s.auth.user)
    const { referrals, loading } = useReferrals(user?.id!)

    const bg = useThemeColor('accent')
    const dispatch = useAppDispatch()
    const data = useMemo(
        () =>
            referrals
                ?.filter(
                    (r) =>
                        r.followUpOn !== null &&
                        moment(r.followUpOn).isAfter(moment())
                )
                .sort((a, b) =>
                    moment(a.followUpOn).diff(moment(b.followUpOn))
                ),
        [referrals]
    )

    // if (data.length === 0 && )
    //     return (
    //         <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
    //             <Text fontSize={20}>No Follow Ups</Text>
    //         </Screen>
    //     )
    const onDeleteFollowUp = async (referral: Referral) => {
        // delete follow up
        try {
            if (!referral || !referral.notificationIdentifier) return
            const removed = await cancelNotification(
                referral.notificationIdentifier
            )
            if (removed) {
                dispatch(
                    updateReferral({
                        ...referral,
                        followUpOn: null,
                        notificationIdentifier: null,
                        followUpType: null
                    })
                )
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to delete follow up')
        }
    }

    const renderFollowUps: ListRenderItem<Referral> = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    dispatch(setReferralId(item.id!))
                    router.push(`/(app)/(modals)/${item.id}`)
                }}
                style={[
                    Styles.boxShadow,
                    {
                        backgroundColor: bg,
                        borderRadius: SIZES.radius * 0.5,
                        padding: SIZES.base,
                        gap: SIZES.base,
                        justifyContent: 'center'
                    }
                ]}
            >
                <Text
                    color="white"
                    center
                    fontFamily="QSBold"
                    fontSize={22}
                    capitalize
                >
                    {item.followUpType}
                </Text>
                <Row
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text color="white">
                        {' '}
                        {index + 1} - {item.name}
                    </Text>

                    <Text color="white" fontSize={14} fontFamily="SFLight">
                        {moment(item.followUpOn).fromNow()}
                    </Text>
                </Row>
                <Text color="white" center fontFamily="QSBold" fontSize={12}>
                    {moment(item.followUpOn).format('lll')}s
                </Text>
                {item.notificationIdentifier && (
                    <Pressable
                        style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: '#ffffff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            Alert.alert(
                                'Delete Follow Up',
                                'Are you sure you want to delete this follow up?',
                                [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => {
                                            // delete follow up
                                            onDeleteFollowUp(item)
                                        }
                                    }
                                ]
                            )
                        }}
                    >
                        <FontAwesome name="close" size={20} color={'grey'} />
                    </Pressable>
                )}
            </TouchableOpacity>
        )
    }
    useStatusBarColor('light')
    if (loading) return <Loading />
    return (
        <Screen>
            <Text center style={{ marginTop: SIZES.padding }}>
                Upcoming Follow Ups ({data.length})
            </Text>
            <FlatList
                contentContainerStyle={{
                    padding: SIZES.base,
                    gap: SIZES.padding
                }}
                data={data}
                keyExtractor={(item) => item.id!}
                renderItem={renderFollowUps}
                ListFooterComponent={<FeedsView referrals={referrals} />}
            />
        </Screen>
    )
}

export default FollowUps
