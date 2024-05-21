import { Chat, Msg } from '@/types'
import { chatsCollection, messagesCollection } from '@/utils/collections'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where
} from 'firebase/firestore'

export const createChat = createAsyncThunk(
    'chats/create',
    async (data: Chat): Promise<string | null> => {
        try {
            if (!data) return null
            const created = await addDoc(chatsCollection, data)
            return created.id
        } catch (error) {
            console.log(error)
            return null
        }
    }
)

export const sendMessage = createAsyncThunk(
    'chats/sendMessage',
    async (data: Msg) => {
        try {
            if (!data) return
            await addDoc(messagesCollection, data)
        } catch (error) {
            console.log(error)
        }
    }
)

export const deleteMessage = createAsyncThunk(
    'chats/deleteMessage',
    async (id: string) => {
        try {
            if (!id) return
            const messageRef = doc(messagesCollection, id)
            await deleteDoc(messageRef)
        } catch (error) {
            console.log(error)
        }
        return id // return id to trigger re-render of chat page
    }
)

export const deleteChat = createAsyncThunk(
    'chats/delete',
    async (id: string) => {
        try {
            const chatRef = doc(chatsCollection, id)

            await deleteDoc(chatRef)
            await deleteChatMessages(id)
        } catch (error) {
            console.log(error)
        }
    }
)

const deleteChatMessages = async (chatId: string) => {
    try {
        const ref = query(messagesCollection, where('chatId', '==', chatId))
        const messages = await getDocs(ref)
        if (messages.empty) return
        messages.forEach(async (doc) => {
            await deleteDoc(doc.ref)
        })
    } catch (error) {
        console.log(error)
    }
}
