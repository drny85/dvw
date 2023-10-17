import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import { router, useLocalSearchParams } from 'expo-router'
import View from '@/common/components/View'
import Header from '@/common/components/Header'
import Row from '@/common/components/Row'
import { FontAwesome } from '@expo/vector-icons'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { useHelper } from '@/common/hooks/referrals/useHelper'
import Loading from '@/common/components/Loading'

const HelperInfo = () => {
    const { helperId } = useLocalSearchParams<{ helperId: string }>()
    const trash = useThemeColor('warning')
    const edit = useThemeColor('accent')

    const { loading, helper } = useHelper(helperId)
    console.log(loading)
    if (loading) return <Loading />
    return (
        <Screen>
            <Header
                title="Details"
                onPressBack={() => router.back()}
                rightIcon={
                    <Row
                        style={{
                            alignItems: 'center',
                            gap: SIZES.padding * 1.5,
                            marginRight: SIZES.padding
                        }}
                    >
                        <TouchableOpacity>
                            <FontAwesome name="trash" color={trash} size={28} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome name="pencil" color={edit} size={28} />
                        </TouchableOpacity>
                    </Row>
                }
                hasRightIcon
            />
            <View style={styles.container}>
                <Text>{helper?.name}</Text>
            </View>
        </Screen>
    )
}

export default HelperInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
