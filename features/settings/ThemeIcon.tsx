import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { Ionicons } from '@expo/vector-icons'
import { ComponentProps } from 'react'
import { Image, Pressable } from 'react-native'
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    withSpring
} from 'react-native-reanimated'
import { Theme, updateTheme } from './settingsSlice'

export interface ThemeIconProps {
    theme: Theme
    name: ComponentProps<typeof Ionicons>['name']
    size?: ComponentProps<typeof Ionicons>['size']
}

export default ({ name, theme, size }: ThemeIconProps) => {
    const dispatch = useAppDispatch()
    const greyColor = useThemeColor('grey')
    const selectedColor = useThemeColor('accent')
    const selected = useAppSelector((state) => state.settings.theme === theme)
    const padding = useDerivedValue(
        () => withSpring(selected ? 8 : 4),
        [selected]
    )

    const style = useAnimatedStyle(() => ({
        padding: theme === 'pink' ? 2 : padding.value,
        borderRadius: interpolate(padding.value, [4, 8], [8, 64]),
        backgroundColor: interpolateColor(
            padding.value,
            [4, 8],
            ['transparent', selectedColor + '30']
        )
    }))

    return (
        <Pressable
            disabled={selected}
            onPress={() => dispatch(updateTheme(theme))}
        >
            <Animated.View style={style}>
                {theme === 'pink' ? (
                    <Image
                        resizeMode="contain"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            overflow: 'hidden'
                        }}
                        source={require('@/assets/images/orange.png')}
                    />
                ) : (
                    <Ionicons
                        size={size || 28}
                        color={selected ? selectedColor : greyColor}
                        name={name}
                    />
                )}
            </Animated.View>
        </Pressable>
    )
}
