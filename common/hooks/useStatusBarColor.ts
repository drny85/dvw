import { useNavigation } from 'expo-router'
import { setStatusBarStyle } from 'expo-status-bar'
import { useEffect } from 'react'

export const useStatusBarColor = (color: 'light' | 'dark') => {
    const navigation = useNavigation()
    useEffect(() => {
        const sub = navigation.addListener('focus', () => {
            setStatusBarStyle(color)
        })

        return () => navigation.removeListener('focus', sub)
    }, [navigation, color])
}
