import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
import { doc, onSnapshot } from 'firebase/firestore'
import { referralssCollection } from '@/lib/collactions'
import { Referral } from '@/types'
export const useReferral = (referralId: string) => {
    const user = useAppSelector((s) => s.auth.user)
    const [referral, setReferral] = useState<Referral>()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!user || !referralId) {
            setLoading(false)
            return
        }
        const ref = doc(referralssCollection(user.id), referralId)
        const sub = onSnapshot(ref, (snap) => {
            setReferral({ id: snap.id, ...(snap.data() as Referral) })
            setLoading(false)
        })

        return sub
    }, [user, referralId])

    return { referral, loading }
}
