import { useEffect } from 'react'
import { Alert, Linking } from 'react-native'
import * as Link from 'expo-linking'
import useAppSelector from './useAppSelector'

export const useLinking = () => {
    const user = useAppSelector((s) => s.auth.user)
    useEffect(() => {
        if (!user) return
        const handleDeepLink = (event: any) => {
            let data = Link.parse(event.url)
            // Handle deep link data
            if (user.email === 'robert.melendez@drascosales.com') {
                Alert.alert('Deep link received', JSON.stringify(data))
            }
        }

        Linking.addEventListener('url', handleDeepLink)

        return () => {
            Linking.removeAllListeners('url')
        }
    }, [user])
}
