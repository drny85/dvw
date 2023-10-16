import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import React from 'react'
import Screen from '../Screen'
import View from '../View'
import Text from '../Text'
import { FontAwesome } from '@expo/vector-icons'
import { SIZES } from '@/constants/Sizes'
import useThemeColor from '@/common/hooks/useThemeColor'
import { router } from 'expo-router'
import { useHelpers } from '@/common/hooks/referrals/useHelpers'
import Loading from '../Loading'
import Styles from '@/constants/Styles'
import { useReferrals } from '@/common/hooks/referrals/useReferrals'
import { Referral } from '@/types'

const Referrals = () => {
    const bgColor = useThemeColor('secondary')
    const textColor = useThemeColor('white')
    const { loading, helpers } = useHelpers()
    const { loading: loadingReferrals, referrals } = useReferrals()
    const managers = helpers.filter((helper) => helper.type === 'ce')
    const referees = helpers.filter((helper) => helper.type === 'referee')
    const coaches = helpers.filter((helper) => helper.type === 'coach')
    const candAdd = managers.length === 0 || referees.length === 0
    const show =
        coaches.length > 0 && managers.length > 0 && referees.length > 0

    const renderReferrals: ListRenderItem<Referral> = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    router.push(`/(app)/(root)/(sales)/details/${item.id}`)
                }
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    if (loading || loadingReferrals) return <Loading />

    return (
        <Screen>
            {candAdd && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: SIZES.padding
                    }}
                >
                    {referees.length === 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                router.push('/(app)/(root)/(sales)/referee')
                            }}
                            style={[
                                Styles.boxShadow,
                                styles.btn,
                                { backgroundColor: bgColor }
                            ]}
                        >
                            <Text color="white" fontFamily="SFBold">
                                Add Referee / LA
                            </Text>
                        </TouchableOpacity>
                    )}
                    {managers.length === 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                router.push('/(app)/(root)/(sales)/ce')
                            }}
                            style={[
                                Styles.boxShadow,
                                styles.btn,
                                { backgroundColor: bgColor }
                            ]}
                        >
                            <Text color="white" fontFamily="SFBold">
                                Add Manager / CE
                            </Text>
                        </TouchableOpacity>
                    )}

                    {coaches.length === 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                router.push('/(app)/(root)/(sales)/coach')
                            }}
                            style={[
                                Styles.boxShadow,
                                styles.btn,
                                { backgroundColor: bgColor }
                            ]}
                        >
                            <Text color="white" fontFamily="SFBold">
                                Add Coach
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {show && (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={referrals}
                        keyExtractor={(item) => item.id!}
                        renderItem={renderReferrals}
                        contentContainerStyle={{
                            paddingHorizontal: SIZES.padding,
                            paddingVertical: SIZES.padding * 2
                        }}
                        ListEmptyComponent={<Text center>No Referrals</Text>}
                        ListFooterComponent={<View />}
                    />
                    <TouchableOpacity
                        style={[
                            styles.floatingButton,
                            { backgroundColor: bgColor }
                        ]}
                        onPress={() => {
                            router.push('/referrals')
                        }}
                    >
                        <FontAwesome name="plus" size={30} color={textColor} />
                    </TouchableOpacity>
                </View>
            )}
        </Screen>
    )
}

export default Referrals

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: SIZES.padding,
        right: SIZES.padding,

        height: 60,
        width: 60,
        borderRadius: 30,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        borderRadius: SIZES.radius * 3,
        padding: SIZES.padding,
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 400
    }
})
