import { AppUser } from '@/types'
import { usersCollection } from '@/utils/collections'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useAllVerifiedUsers = () => {
    const [loading, setLoading] = useState(true)
    const [usersData, setUsersData] = useState<AppUser[]>([])

    useEffect(() => {
        const usersRef = query(
            usersCollection,
            where('emailVerified', '==', true)
        )
        return onSnapshot(usersRef, (snapshot) => {
            const usersData: AppUser[] = snapshot.docs.map(
                (doc) => ({ ...doc.data(), id: doc.id } as AppUser)
            )
            //.filter((u) => u.email && isValidDrascoEmail(u.email))
            setUsersData(usersData)
            setLoading(false)
        })
    }, [])

    return { loading, usersData }
}
