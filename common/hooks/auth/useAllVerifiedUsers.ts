import { AppUser } from '@/types'
import { usersCollection } from '@/utils/collections'
import { isValidDrascoEmail } from '@/utils/isEmailValid'
import { getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useAllVerifiedUsers = () => {
    const [loading, setLoading] = useState(true)
    const [usersData, setUsersData] = useState<AppUser[]>([])

    const getUsers = async () => {
        try {
            const usersRef = query(
                usersCollection,
                where('emailVerified', '==', true)
            )
            const usersSnapshot = await getDocs(usersRef)
            const usersData: AppUser[] = usersSnapshot.docs.map(
                (doc) => ({ ...doc.data(), id: doc.id } as AppUser)
            )
            //.filter((u) => u.email && isValidDrascoEmail(u.email))
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

    return { loading, usersData }
}
