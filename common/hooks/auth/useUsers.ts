import { AppUser } from '@/types'
import { usersCollection } from '@/utils/collections'
import { getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useUsers = (users: string[]) => {
    const [loading, setLoading] = useState(true)
    const [usersData, setUsersData] = useState<AppUser[]>([])

    const getUsers = async () => {
        try {
            const usersRef = query(usersCollection, where('id', 'in', users))
            const usersSnapshot = await getDocs(usersRef)
            const usersData: AppUser[] = usersSnapshot.docs.map(
                (doc) => ({ ...doc.data(), id: doc.id } as AppUser)
            )
            setUsersData(usersData)

            return
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (users.length === 0) {
            setLoading(false)

            return
        }
        getUsers()
    }, [users.length])

    return { loading, usersData }
}
