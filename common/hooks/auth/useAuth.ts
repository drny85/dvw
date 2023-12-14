import { AppUser, setAppUser } from '@/features/auth/authSlice'
import { auth } from '@/firebase'
import { usersCollection } from '@/lib/collections'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppDispatch from '../useAppDispatch'
import useAppSelector from '../useAppSelector'

export const useAuth = () => {
    const user = auth.currentUser

    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user || !user.emailVerified) {
            dispatch(setAppUser(null))

            return
        }
        setLoading(true)
        const userQuery = doc(usersCollection, user.uid)
        const sub = onSnapshot(userQuery, (snapshot) => {
            console.log('dispatch user from useAuth')
            dispatch(
                setAppUser({ ...snapshot.data(), id: snapshot.id } as AppUser)
            )
            setLoading(false)
        })
        return sub
    }, [user])

    return { loading }
}
