import { messagesCollection } from '@/lib/collections'
import { Message } from '@/types'
import { onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useMessages = (chatId: string) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!chatId) {
            setLoading(false)
            return
        }
        const sortedQuery = query(
            messagesCollection,
            orderBy('createdAt', 'asc'),
            where('chatId', '==', chatId)
        )
        const sub = onSnapshot(sortedQuery, (snap) => {
            setMessages(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            setLoading(false)
        })

        return sub
    }, [chatId])

    return { messages, loading }
}
