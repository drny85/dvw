import { referralssCollection } from '@/utils/collections'
import { Referral } from '@/types'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
import useAppDispatch from '../useAppDispatch'
import { setAllReferrals } from '@/features/referrals/referralsSlide'
import moment from 'moment'
export const useReferrals = () => {
    const user = useAppSelector((s) => s.auth.user)
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [loading, setLoading] = useState(true)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }
        const q = query(
            referralssCollection(user.id),
            where('moveIn', '>=', moment().startOf('year').toISOString())
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
    }, [user])

    return { referrals, loading }
}
