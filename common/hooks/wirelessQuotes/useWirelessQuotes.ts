import { wirelessQuotesCollection } from '@/lib/collections'
import { WirelessQuote } from '@/types'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'

export const useWirelessQuotes = () => {
    const userId = useAppSelector((s) => s.auth.user?.id)
    const [loading, setLoading] = useState(true)
    const [quotes, setQuotes] = useState<WirelessQuote[]>([])

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }
        const queryRes = query(
            wirelessQuotesCollection,
            where('userId', '==', userId)
        )
        const sub = onSnapshot(queryRes, (snap) => {
            setQuotes(
                snap.docs.map((doc) => ({ quoteId: doc.id, ...doc.data() }))
            )
            setLoading(false)
        })

        return sub
    }, [userId])

    return { quotes, loading }
}
