import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
import { onSnapshot } from 'firebase/firestore'
import { referralssCollection } from '@/lib/collactions'
import { Referral } from '@/types'
export const useReferrals = () => {
    const user = useAppSelector((s) => s.auth.user)
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!user) return
        const sub = onSnapshot(referralssCollection(user.id), (snap) => {
            setReferrals(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
            setLoading(false)
        })

        return sub
    }, [user])

    return { referrals, loading }
}
