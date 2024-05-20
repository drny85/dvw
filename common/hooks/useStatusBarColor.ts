import { useNavigation } from 'expo-router'
import { setStatusBarStyle } from 'expo-status-bar'
import { useEffect } from 'react'
import useColorScheme from './useColorScheme'

export const useStatusBarColor = (color: 'light' | 'dark') => {
    const navigation = useNavigation()
    const theme = useColorScheme()

    useEffect(() => {
        const sub = navigation.addListener('focus', () => {
            setStatusBarStyle(
                (theme === 'dark' || theme === 'pink') && color === 'dark'
                    ? 'light'
                    : color
            )
        })

        return () => navigation.removeListener('focus', sub)
    }, [navigation, color, theme])
}
