import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
import { doc, onSnapshot } from 'firebase/firestore'
import { helpersCollection } from '@/lib/collactions'
import { Helper } from '@/types'

export const useHelper = (herlperId: string) => {
    const user = useAppSelector((s) => s.auth.user)
    const [helper, setHelper] = useState<Helper>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || !user?.id || !herlperId) {
            setLoading(false)
            return
        }
        const ref = doc(helpersCollection(user.id), herlperId)
        const sub = onSnapshot(ref, (res) => {
            if (!res.exists()) {
                setLoading(false)
                return
            }
            setHelper({ id: res.id, ...res.data() })
            setLoading(false)
        })

        return sub
    }, [user, herlperId])

    return { helper, loading }
}
