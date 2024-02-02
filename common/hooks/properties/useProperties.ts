import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
import { onSnapshot } from 'firebase/firestore'
import { propertiesCollection } from '@/utils/collections'

export const useProperties = () => {
    const [loading, setLoading] = useState(true)
    const [properties, setProperties] = useState<
        { id: string; name: string }[]
    >([])
    const user = useAppSelector((s) => s.auth.user)

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        return onSnapshot(propertiesCollection(user.id), (snashop) => {
            setProperties(snashop.docs.map((p) => ({ id: p.id, ...p.data() })))
            setLoading(false)
        })
    }, [user])

    return { properties, loading }
}
