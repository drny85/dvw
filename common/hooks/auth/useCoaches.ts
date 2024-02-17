import { AppUser } from '@/types'
import { usersCollection } from '@/utils/collections'
import { getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useCoachess = () => {
    const [loading, setLoading] = useState(true)
    const [coaches, setUsersData] = useState<AppUser[]>([])

    const getUsers = async () => {
        try {
            const usersRef = query(
                usersCollection,
                where('role', '==', 'coach')
            )
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
        getUsers()
    }, [])

    return { loading, coaches }
}
