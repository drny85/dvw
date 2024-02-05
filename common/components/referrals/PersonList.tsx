import { SIZES } from '@/constants/Sizes'
import { Helper } from '@/types'
import React from 'react'
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native'
import Divider from '../Divider'
import Row from '../Row'
import Text from '../Text'
import View from '../View'
import { FontAwesome } from '@expo/vector-icons'
import useThemeColor from '@/common/hooks/useThemeColor'
import { router } from 'expo-router'
import useAppSelector from '@/common/hooks/useAppSelector'

type Props = {
    data: Helper[]
}
const PersonList = ({ data }: Props) => {
    const text = useThemeColor('text')
    const user = useAppSelector((s) => s.auth.user)
    const disabled =
        data.filter((item) => item.type === 'coach' && item.userId === user?.id)
            .length === 1
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
            ItemSeparatorComponent={() => <Divider />}
            data={data}
            keyExtractor={(item) => item.id!}
            renderItem={renderItem}
            ListFooterComponent={
                <View style={{ height: SIZES.statusBarHeight }} />
            }
        />
    )
}

export default PersonList
