import { AppUser } from '@/features/auth/authSlice'
import { usersCollection } from '@/lib/collections'
import { getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'

export const useBlockedUsers = () => {
    const [loading, setLoading] = useState(true)
    const [usersData, setUsersData] = useState<AppUser[]>([])
    const user = useAppSelector((s) => s.auth.user)

    const getUsers = async () => {
        try {
            if (user?.blockedUsers && user.blockedUsers.length === 0) {
                setLoading(false)
                setUsersData([])

                return
            } else {
                if (!user?.blockedUsers) {
                    setLoading(true)
                    setUsersData([])
                }
            }
            const usersRef = query(
                usersCollection,
                where('id', 'in', user?.blockedUsers)
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
        if (user?.blockedUsers?.length === 0) {
            setLoading(false)

            return
        }
        getUsers()
    }, [user])

    return { loading, usersData }
}
