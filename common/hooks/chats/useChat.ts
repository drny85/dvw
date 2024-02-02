import { Chat } from '@/types'
import { chatsCollection } from '@/utils/collections'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useChat = (chatId: string) => {
    const [chat, setChats] = useState<Chat>()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!chatId) {
            setLoading(false)
            return
        }
        const chatRef = doc(chatsCollection, chatId)
        getDoc(chatRef)
            .then((snap) => {
                setChats({ id: snap.id, ...snap.data() } as Chat)
                setLoading(false)
            })
            .catch((e) => console.log('error getting chat doc', e))
    }, [chatId])

    return { chat, loading }
}
