import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { Line, LineName } from '@/types'
import { totalPerksCount } from '@/utils/perksCount'
import { FontAwesome } from '@expo/vector-icons'
import { MotiView } from 'moti'
import React from 'react'
import { StyleSheet, Switch, TouchableOpacity } from 'react-native'
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu'
import Text from '../Text'
import View from '../View'

type Props = {
    index: number
    line: Line
    onBYOD: (id: string) => void
    onDelete: (id: string) => void
    onSwitchLine: (id: string, name: LineName) => void
    onPerksPress: (id: string) => void
}
const LineItem = ({
    line,
    onBYOD,
    onDelete,
    onSwitchLine,
    onPerksPress,
    index
}: Props) => {
    const ascent = useThemeColor('placeholder')
    const text = useThemeColor('text')
    const warning = useThemeColor('warning')

    const trackColor = useThemeColor('accent')
    const thumbColor = useThemeColor('success')
    const bgColor = useThemeColor('background')

    const [linePressed, setLinePressed] = React.useState(false)
    const onPressLineName = (name: LineName) => {
        setLinePressed(false)
        onSwitchLine(line.id, name)
    }

    return (
        <>
            <MotiView
                style={[
                    styles.container,
                    Styles.boxShadow,
                    { backgroundColor: bgColor }
                ]}
                from={{
                    opacity: 0,
                    scale: 0.9
                }}
                animate={{
                    opacity: 1,
                    scale: 1
                }}
                transition={{
                    type: 'timing',
                    duration: 300
                }}
                exit={{ opacity: 0, scale: 0 }}
            >
                <View
                    style={{
                        width: '26%'
                    }}
                >
                    <Menu
                        animationDuration={300}
                        visible={linePressed}
                        style={{
                            backgroundColor: ascent,
                            marginTop: SIZES.padding * 2
                        }}
                        anchor={
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexGrow: 1
                                }}
                            >
                                <Text fontSize={12}>{index + 1} - </Text>

                                <Text
                                    onPress={() => setLinePressed(true)}
                                    fontSize={16}
                                    fontFamily="SFBold"
                                >
                                    {SIZES.width > 500
                                        ? line.name
                                        : line.name.split(' ')[1]}
                                </Text>
                            </View>
                        }
                    >
                        {[
                            'Unlimited Welcome',
                            'Unlimited Plus',
                            'Unlimited Ultimate'
                        ].map((p) => (
                            <View key={p}>
                                <MenuItem
                                    textStyle={{
                                        color: text,
                                        fontFamily: 'SFBold'
                                    }}
                                    pressColor={bgColor}
                                    onPress={() =>
                                        onPressLineName(p as LineName)
                                    }
                                    key={p}
                                >
                                    {p}
                                </MenuItem>
                                <MenuDivider color={bgColor} />
                            </View>
                        ))}
                    </Menu>
                </View>

                <View style={styles.lineName}>
                    <Text fontFamily={line.byod ? 'SFBold' : 'SFRegular'}>
                        BYOD
                    </Text>
                    <Switch
                        value={line.byod}
                        trackColor={{ false: thumbColor, true: '#8d99ae' }}
                        thumbColor={line.byod ? thumbColor : 'grey'}
                        ios_backgroundColor={bgColor}
                        onChange={() => onBYOD(line.id)}
                    />
                </View>
                <View style={styles.lineName}>
                    <Text fontSize={18} fontFamily="SFBold">
                        ${line.price}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => onPerksPress(line.id)}>
                    <Text>
                        {' '}
                        {totalPerksCount([], line) > 0
                            ? `Perks ${totalPerksCount([], line)}`
                            : 'Perks'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(line.id)}>
                    <FontAwesome name="trash-o" size={26} color={warning} />
                </TouchableOpacity>
            </MotiView>
        </>
    )
}

export default LineItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        padding: SIZES.base,
        borderRadius: SIZES.radius * 0.5
    },
    lineName: {
        flexDirection: 'row',
        gap: SIZES.base,
        alignItems: 'center'
    }
})
