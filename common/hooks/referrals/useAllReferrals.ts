import { salesCollection } from '@/utils/collections'
import { ReferralSold } from '@/types'
import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useAllReferrals = () => {
    const [sales, setReferrals] = useState<ReferralSold[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        return onSnapshot(salesCollection, (snap) => {
            const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setReferrals(data)
            setLoading(false)
        })
    }, [])

    return { loading, sales }
}
