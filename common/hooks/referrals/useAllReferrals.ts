import { ReferralSold } from '@/types'
import { salesCollection } from '@/utils/collections'
import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'

export const useAllReferrals = () => {
    const user = useAppSelector((s) => s.auth.user)
    const [sales, setReferrals] = useState<ReferralSold[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user) return
        if (
            user.role !== 'coach' &&
            user.role !== 'ceo' &&
            user.email !== 'robert.melendez@drascosales.com'
        )
            return
        setLoading(true)
        return onSnapshot(salesCollection, (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setReferrals(data)
            setLoading(false)
        })
    }, [user])

    return { loading, sales }
}
