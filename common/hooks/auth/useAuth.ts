import { AppUser, setAppUser } from '@/features/auth/authSlice'
import { auth } from '@/firebase'
import { usersCollection } from '@/lib/collections'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'
import useAppDispatch from '../useAppDispatch'

export const useAuth = () => {
    const user = auth.currentUser
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!user || !user.emailVerified) {
            dispatch(setAppUser(null))
            return
        }

        const userQuery = doc(usersCollection, user.uid)
        const sub = onSnapshot(userQuery, (snapshot) => {
            dispatch(
                setAppUser({ ...snapshot.data(), id: snapshot.id } as AppUser)
            )
        })
        return () => sub()
    }, [user])
}
