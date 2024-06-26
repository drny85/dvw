import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { Helper } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native'
import Divider from '../Divider'
import Row from '../Row'
import Text from '../Text'
import View from '../View'

type Props = {
    data: Helper[]
    scrollEnabled?: boolean
}
const PersonList = ({ data, scrollEnabled }: Props) => {
    const text = useThemeColor('text')

    const renderItem: ListRenderItem<Helper> = ({ index, item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    router.push(`/(app)/(root)/(settings)/helpers/${item.id}`)
                }
                style={{
                    paddingVertical: SIZES.padding * 0.7,
                    paddingHorizontal: SIZES.padding * 0.5,

                    borderRadius: 12
                }}
            >
                <Row
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text fontFamily="SFBold">{item.name || item.id}</Text>
                    <FontAwesome name="chevron-right" size={20} color={text} />
                </Row>
            </TouchableOpacity>
        )
    }
    return (
        <FlatList
            contentContainerStyle={{
                marginTop: 20,
                width: SIZES.isSmallDevice ? '100%' : SIZES.width * 0.85,
                alignSelf: 'center'
            }}
            scrollEnabled={scrollEnabled}
            ItemSeparatorComponent={() => <Divider />}
            data={data}
            keyExtractor={(item) => item.id!}
            ListEmptyComponent={
                <View>
                    <Text fontFamily="SFBold" fontSize={16}>
                        No data found
                    </Text>
                </View>
            }
            renderItem={renderItem}
            ListFooterComponent={
                <View style={{ height: SIZES.statusBarHeight }} />
            }
        />
    )
}

export default PersonList
