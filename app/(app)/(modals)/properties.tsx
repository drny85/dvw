import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import React from 'react'
import Screen from '@/common/components/Screen'
import Header from '@/common/components/Header'
import { router } from 'expo-router'
import View from '@/common/components/View'
import Text from '@/common/components/Text'
import { useProperties } from '@/common/hooks/properties/useProperties'
import Row from '@/common/components/Row'
import { SIZES } from '@/constants/Sizes'
import { FontAwesome } from '@expo/vector-icons'
import Divider from '@/common/components/Divider'
import Loading from '@/common/components/Loading'

const Properties = () => {
    const { properties, loading } = useProperties()
    console.log(properties.length)

    const renderProperties: ListRenderItem<any> = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    router.push(`/(app)/(modals)/${item['MDU PROP ID']}`)
                }
                style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}
            >
                <View style={{ width: '88%', gap: SIZES.base }}>
                    <Text fontSize={12} fontFamily="QSBold">
                        {item.id}
                    </Text>
                    <Text>{item['VSS PROP NAME']}</Text>
                    <Row style={{ gap: SIZES.base }}>
                        <Text fontFamily="QSLight">
                            {item['VSS STREET NO']}
                        </Text>
                        <Text fontFamily="QSLight">{item['VSS STREET']},</Text>
                        <Text fontFamily="QSLight">{item['VSS CITY']}</Text>
                    </Row>
                </View>
                <FontAwesome name="chevron-right" size={20} />
            </TouchableOpacity>
        )
    }
    if (loading) return <Loading />

    return (
        <Screen>
            <Header title="My Properties" onPressBack={router.back} />

            <FlatList
                data={[...properties]}
                keyExtractor={(item) => item.id}
                renderItem={renderProperties}
                ItemSeparatorComponent={() => <Divider />}
                contentContainerStyle={{
                    padding: SIZES.base,
                    gap: SIZES.padding
                }}
                ListEmptyComponent={
                    <View style={styles.container}>
                        <Text fontFamily="SFBold">No Properties</Text>
                    </View>
                }
            />
        </Screen>
    )
}

export default Properties

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: SIZES.height * 0.4,
        left: 0,
        right: 0
    }
})
