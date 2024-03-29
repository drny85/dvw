import { auth } from '@/firebase'
import { usersCollection } from '@/utils/collections'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppDispatch from '../useAppDispatch'
import { AppUser } from '@/types'
import { setAppUser } from '@/features/auth/authSlice'

export const useAuth = () => {
    const user = auth.currentUser
    // const user = useAppSelector((s) => s.auth.user)

    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user) {
            //dispatch(setAppUser(null))

            return
        }
        setLoading(true)
        const userQuery = doc(usersCollection, user.uid)
        const sub = onSnapshot(userQuery, (snapshot) => {
            dispatch(
                setAppUser({
                    ...snapshot.data(),
                    id: snapshot.id,
                    emailVerified: user.emailVerified
                } as AppUser)
            )
            setLoading(false)
        })
        return sub
    }, [user])

    return { loading }
}
