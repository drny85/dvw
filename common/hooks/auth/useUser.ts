import { AppUser } from '@/types'
import { usersCollection } from '@/utils/collections'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useUser = (userId: string) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<AppUser | null>(null)
    useEffect(() => {
        if (!userId) {
            setLoading(false)
            setUser(null)
            console.log('no user id')
            return
        }
        const userRef = doc(usersCollection, userId)
        return onSnapshot(userRef, (snapshot) => {
            const userData = snapshot.data() as AppUser
            setUser(userData)
            setLoading(false)
            return userData
        })
    }, [userId])

    return { user, loading }
}
