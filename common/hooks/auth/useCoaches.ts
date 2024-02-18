import { AppUser } from '@/types'
import { usersCollection } from '@/utils/collections'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useCoachess = () => {
    const [loading, setLoading] = useState(true)
    const [coaches, setUsersData] = useState<AppUser[]>([])

    useEffect(() => {
        const usersRef = query(usersCollection, where('role', '==', 'coach'))
        return onSnapshot(usersRef, (snapshot) => {
            const usersData: AppUser[] = snapshot.docs.map(
                (doc) => ({ ...doc.data(), id: doc.id } as AppUser)
            )
            setUsersData(usersData)
            setLoading(false)
        })
    }, [])

    return { loading, coaches }
}
