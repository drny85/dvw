import { Msg } from '@/types'
import { messagesCollection } from '@/utils/collections'
import { onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useMessages = (chatId: string) => {
    const [messages, setMessages] = useState<Msg[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!chatId) {
            setLoading(false)
            return
        }
        const sortedQuery = query(
            messagesCollection,
            orderBy('createdAt', 'desc'),
            where('chatId', '==', chatId)
        )
        const sub = onSnapshot(sortedQuery, (snap) => {
            setMessages(
                snap.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    //@ts-ignore
                    createdAt: doc.data().createdAt.toDate()
                }))
            )

            setLoading(false)
        })

        return sub
    }, [chatId])

    return { messages, loading }
}
