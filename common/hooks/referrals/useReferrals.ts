import { setAllReferrals } from '@/features/referrals/referralsSlide'
import { Referral } from '@/types'
import { referralssCollection } from '@/utils/collections'
import { onSnapshot, query, where } from 'firebase/firestore'
import moment from 'moment'
import { useEffect, useState } from 'react'
import useAppDispatch from '../useAppDispatch'
export const useReferrals = (userId: string) => {
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [loading, setLoading] = useState(true)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }
        const q = query(
            referralssCollection(userId),
            where(
                'moveIn',
                '>=',
                moment().subtract(1, 'month').startOf('day').toISOString()
            )
        )
        const sub = onSnapshot(q, (snap) => {
            setReferrals(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
            dispatch(
                setAllReferrals(
                    snap.docs.map((d) => ({ id: d.id, ...d.data() }))
                )
            )
            setLoading(false)
        })

        return sub
    }, [userId])

    return { referrals, loading }
}
