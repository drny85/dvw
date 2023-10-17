// Import necessary modules and hooks
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useNotifications from '@/common/hooks/useNotification'
import { getUser } from '@/features/auth/authActions'
import { setAppUser } from '@/features/auth/authSlice'
import { auth } from '@/firebase'

import { Redirect, Stack } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth/react-native'
import { useEffect } from 'react'

export default function () {
    const loggedIn = useAppSelector((state) => state.auth.user)
    useNotifications()
    const dispatch = useAppDispatch()
    const unbsucribed = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            dispatch(setAppUser(null))

            return
        }

        dispatch(getUser({ userId: user.uid, isVerified: user.emailVerified }))
    })
    useEffect(() => {
        return () => {
            unbsucribed()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // If the user is logged in, redirect to the home page
    if (loggedIn && loggedIn.emailVerified) {
        return <Redirect href={'/'} />
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
            }}
        />
    )
}
