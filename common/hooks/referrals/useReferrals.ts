import { referralssCollection } from '@/lib/collections'
import { Referral } from '@/types'
import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
export const useReferrals = () => {
    const user = useAppSelector((s) => s.auth.user)
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        const sub = onSnapshot(referralssCollection(user.id), (snap) => {
            setReferrals(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
            setLoading(false)
        })

        return sub
    }, [user])

    return { referrals, loading }
}
