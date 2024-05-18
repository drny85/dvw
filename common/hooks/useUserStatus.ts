import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import useAppDispatch from './useAppDispatch'
import { updateUser } from '@/features/auth/authActions'
import useAppSelector from './useAppSelector'

export const useUserStatus = () => {
    const appState = useRef(AppState.currentState)
    const dispatch = useAppDispatch()
    const user = useAppSelector((s) => s.auth.user)
    const [appStateVisible, setAppStateVisible] = useState(appState.current)

    useEffect(() => {
        if (!user) return
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    const updatedUser = {
                        ...user,
                        isOnline: true,
                        lastSeen: new Date().toISOString()
                    }
                    dispatch(updateUser({ ...updatedUser }))
                }

                appState.current = nextAppState
                setAppStateVisible(appState.current)
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'background'
                ) {
                    const updatedUser = {
                        ...user,
                        isOnline: false
                    }
                    dispatch(updateUser({ ...updatedUser }))
                }
            }
        )

        return () => {
            subscription.remove()
        }
    }, [user])
}
