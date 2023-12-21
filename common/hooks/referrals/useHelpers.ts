import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
import { onSnapshot } from 'firebase/firestore'
import { helpersCollection } from '@/lib/collections'
import { Helper } from '@/types'

export const useHelpers = () => {
    const user = useAppSelector((s) => s.auth.user)
    const [helpers, setHelpers] = useState<Helper[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || !user?.id) {
            setLoading(false)

            return
        }
        const sub = onSnapshot(helpersCollection(user.id), (res) => {
            setHelpers(res.docs.map((d) => ({ id: d.id, ...d.data() })))
            setLoading(false)
        })

        return sub
    }, [user])

    return { helpers, loading }
}
