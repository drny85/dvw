import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Screen from '@/common/components/Screen'
import View from '@/common/components/View'
import Text from '@/common/components/Text'
import { SIZES } from '@/constants/Sizes'
import useThemeColor from '@/common/hooks/useThemeColor'
import { router } from 'expo-router'

const PlanHome = () => {
    const backgroundColor = useThemeColor('accent')
    return (
        <Screen>
            <Text center fontFamily="SFBold" fontSize={30}>
                Select One
            </Text>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => router.push('/(app)/(modals)/myplan')}
                    style={[styles.btn, { backgroundColor }]}
                >
                    <Text fontFamily="QSBold" fontSize={22} color="white">
                        Wireless Plans
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor }]}
                    onPress={() => router.push('/(app)/(modals)/plan5g')}
                >
                    <Text fontFamily="QSBold" fontSize={22} color="white">
                        5G Plans
                    </Text>
                </TouchableOpacity>
            </View>
        </Screen>
    )
}

export default PlanHome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SIZES.padding * 2
    },
    btn: {
        padding: SIZES.padding,
        paddingHorizontal: SIZES.padding * 2,
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: SIZES.radius * 3,
        width: '70%'
    }
})
