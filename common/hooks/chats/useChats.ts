import { Chat } from '@/types'
import { chatsCollection } from '@/utils/collections'
import { onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useChats = () => {
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const sortedQuery = query(chatsCollection, orderBy('createdAt', 'desc'))
        const sub = onSnapshot(sortedQuery, (snap) => {
            setChats(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            setLoading(false)
        })

        return sub
    }, [])

    return { chats, loading }
}
