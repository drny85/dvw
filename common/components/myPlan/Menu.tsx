import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu'
import { SIZES } from '@/constants/Sizes'
import useThemeColor from '@/common/hooks/useThemeColor'
import View from '../View'
import Text from '../Text'
import { Line, LineName } from '@/types'
import { onSwitchLine } from '@/helpers'
import useAppSelector from '@/common/hooks/useAppSelector'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { useState } from 'react'

type Props = {
    line: Line
    index: number
    showFullName?: boolean
    fontSize?: number
}
const LinesMenu = ({ line, index, showFullName, fontSize }: Props) => {
    const ascent = useThemeColor('placeholder')
    const bgColor = useThemeColor('background')
    const [visible, setVisible] = useState(false)
    const { lines, expressAutoPay, expressHasFios, expressInternet } =
        useAppSelector((s) => s.wireless)
    const dispatch = useAppDispatch()
    const onSwitchLinePress = (name: LineName) => {
        onSwitchLine(
            line.id,
            lines,
            name,
            expressAutoPay,
            expressInternet,
            expressHasFios,
            dispatch
        )
        setVisible(false)
    }
    return (
        <Menu
            animationDuration={300}
            visible={visible}
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
                    <Text fontSize={fontSize ? fontSize : 12}>
                        {index + 1} -{' '}
                    </Text>

                    <Text
                        onPress={() => setVisible(true)}
                        fontSize={fontSize ? fontSize : 14}
                        fontFamily="SFBold"
                    >
                        {SIZES.width > 500 || showFullName
                            ? line.name
                            : line.name.split(' ')[1]}
                    </Text>
                </View>
            }
        >
            {['Unlimited Welcome', 'Unlimited Plus', 'Unlimited Ultimate'].map(
                (p) => (
                    <View key={p}>
                        <MenuItem
                            textStyle={{
                                color: '#ffffff',
                                fontFamily: 'SFBold'
                            }}
                            pressColor={bgColor}
                            onPress={() => onSwitchLinePress(p as LineName)}
                            key={p}
                        >
                            {p}
                        </MenuItem>
                        <MenuDivider color={bgColor} />
                    </View>
                )
            )}
        </Menu>
    )
}

export default LinesMenu
