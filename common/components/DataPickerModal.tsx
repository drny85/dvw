import {
    FlatList,
    ListRenderItem,
    Modal,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Text from './Text'

import Divider from './Divider'
import Row from './Row'

import { SIZES } from '@/constants/Sizes'
import {
    setHasWireless,
    setReferrralLines
} from '@/features/referrals/referralsSlide'
import { Helper, SERVICE, STATUS } from '@/types'
import { FontAwesome } from '@expo/vector-icons'
import { MotiView } from 'moti'
import useAppDispatch from '../hooks/useAppDispatch'
import useAppSelector from '../hooks/useAppSelector'
import useThemeColor from '../hooks/useThemeColor'
import View from './View'
import LineSetter from './myPlan/LineSetter'

interface Props {
    visisble: boolean
    selected?: any
    title: string
    data: Helper | STATUS[] | SERVICE[] | any
    onPress: (value: Helper | STATUS['id'] | SERVICE | any) => void
    onCancel?: () => void
    onAdd?: () => void
}
const DataPickerModal: React.FC<Props> = ({
    visisble,
    data,
    onPress,
    title,
    selected,
    onCancel,
    onAdd
}) => {
    const bgColor = useThemeColor('background')
    const shadowColor = useThemeColor('accent')
    const textColor = useThemeColor('text')
    const isWireless = useAppSelector((s) => s.referrals.hasWireless)
    const referralLines = useAppSelector((s) => s.referrals.referralLines)
    const dispatch = useAppDispatch()

    const renderItem: ListRenderItem<typeof data> = ({ index, item }) => {
        if (isWireless && referralLines === 0) return null
        return (
            <TouchableOpacity
                onPress={() => onPress(item)}
                style={[
                    styles.item,
                    {
                        borderRadius: 12,
                        backgroundColor:
                            selected?.id === item.id ? shadowColor : undefined
                    }
                ]}
            >
                <Row>
                    <Text>{item.name || item.id}</Text>
                </Row>
            </TouchableOpacity>
        )
    }

    return (
        <Modal
            style={{ backgroundColor: bgColor }}
            animationType="slide"
            visible={visisble}
        >
            <View
                style={[
                    styles.view,
                    {
                        backgroundColor: bgColor
                    }
                ]}
            >
                <MotiView
                    style={{
                        width: 50,
                        height: 4,
                        backgroundColor: textColor,
                        alignSelf: 'center',
                        borderRadius: 15,
                        marginVertical: 10
                    }}
                    from={{ translateY: -50 }}
                    animate={{ translateY: 0 }}
                    transition={{ type: 'timing', duration: 600 }}
                />
                <Row
                    style={{
                        marginHorizontal: SIZES.padding,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <MotiView
                        animate={{
                            backgroundColor: shadowColor,
                            borderRadius: 18,
                            paddingVertical: 6,
                            paddingHorizontal: 8
                        }}
                    >
                        <TouchableOpacity
                            style={{ paddingHorizontal: SIZES.base }}
                            onPress={() => {
                                if (isWireless) {
                                    dispatch(setReferrralLines(0))
                                    dispatch(setHasWireless(false))
                                }
                                onCancel && onCancel()
                            }}
                        >
                            <Text color="white">Cancel</Text>
                        </TouchableOpacity>
                    </MotiView>
                    <Text fontFamily="SFBold">Pick A {title}</Text>
                    {onAdd ? (
                        <TouchableOpacity onPress={onAdd}>
                            <FontAwesome
                                name="plus"
                                color={textColor}
                                size={28}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}
                </Row>

                <FlatList
                    contentContainerStyle={{
                        marginTop: 20,
                        width: SIZES.isSmallDevice
                            ? '100%'
                            : SIZES.width * 0.85,
                        alignSelf: 'center'
                    }}
                    ItemSeparatorComponent={() => <Divider />}
                    ListHeaderComponent={
                        isWireless ? (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text fontFamily="SFBold">Number of Lines</Text>
                                <View style={{ marginVertical: SIZES.padding }}>
                                    <LineSetter
                                        data={referralLines}
                                        onAddLine={() => {
                                            dispatch(
                                                setReferrralLines(
                                                    referralLines + 1
                                                )
                                            )
                                        }}
                                        onRemoveLine={() => {
                                            if (referralLines > 0) {
                                                dispatch(
                                                    setReferrralLines(
                                                        referralLines - 1
                                                    )
                                                )
                                            }
                                        }}
                                    />
                                </View>
                                {referralLines > 0 && (
                                    <Text
                                        center
                                        fontFamily="QSBold"
                                        fontSize={18}
                                    >
                                        Sale Type
                                    </Text>
                                )}
                            </View>
                        ) : undefined
                    }
                    data={data}
                    keyExtractor={(item) => item.id!}
                    renderItem={renderItem}
                    ListFooterComponent={
                        <View style={{ height: SIZES.statusBarHeight }} />
                    }
                />
            </View>
        </Modal>
    )
}

export default DataPickerModal

const styles = StyleSheet.create({
    view: {
        flex: 1,
        paddingTop: SIZES.statusBarHeight * 1.5
    },
    item: {
        paddingVertical: SIZES.padding * 0.7,
        paddingHorizontal: SIZES.padding * 0.5
    }
})
