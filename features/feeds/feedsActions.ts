import { Feed } from '@/types'
import { feedsColletion } from '@/utils/collections'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const addFeed = createAsyncThunk(
    'feeds/addFeed',
    async (feed: Feed, { rejectWithValue }): Promise<void> => {
        try {
            if (!feed.title || !feed.message)
                rejectWithValue('Missing title or message')

            await addDoc(feedsColletion, feed)
        } catch (error) {
            rejectWithValue(error)
        }
    }
)

export const updateFeed = createAsyncThunk(
    'feeds/update',
    async (feed: Feed, { rejectWithValue }) => {
        try {
            if (!feed.id) return rejectWithValue('Missing feed id')
            const feedRef = doc(feedsColletion, feed.id)
            await updateDoc(feedRef, feed)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteFeed = createAsyncThunk(
    'feeds/delete',
    async (feedId: string, { rejectWithValue }) => {
        try {
            if (!feedId) return rejectWithValue('Missing feed id')
            const feedRef = doc(feedsColletion, feedId)

            await deleteDoc(feedRef)
        } catch (error) {
            rejectWithValue(error)
        }
    }
)
