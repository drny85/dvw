import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
import { doc, onSnapshot } from 'firebase/firestore'
import { propertiesCollection } from '@/lib/collections'

export const useProperty = (propertyId: string) => {
    const [loading, setLoading] = useState(true)
    const [property, setProperty] = useState<any>()
    const user = useAppSelector((s) => s.auth.user)

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }
        const propRef = doc(propertiesCollection(user.id), propertyId)
        return onSnapshot(propRef, (snashop) => {
            setProperty({ id: snashop.id, ...snashop.data() })
            setLoading(false)
        })
    }, [user])

    return { property, loading }
}
