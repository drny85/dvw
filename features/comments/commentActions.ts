import { RootState } from '@/store/configureStore'
import { Comment } from '@/types'
import { commentsCollection } from '@/lib/collections'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const addComment = createAsyncThunk(
    'comments/add',
    async (
        data: { comment: Comment; feedId: string },
        { rejectWithValue, getState }
    ) => {
        try {
            const {
                auth: { user }
            } = getState() as RootState
            console.log(data.feedId)
            if (!user || !data.feedId) return

            const { comment, feedId } = data

            await addDoc(commentsCollection(feedId), comment as Comment)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateComment = createAsyncThunk(
    'comments/update',
    async (
        data: { comment: Comment; feedId: string },
        { rejectWithValue, getState }
    ) => {
        try {
            const docRef = doc(commentsCollection(data.feedId), data.comment.id)
            await updateDoc(docRef, data.comment)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteComment = createAsyncThunk(
    'comments/delete',
    async (
        data: { commentId: string; feedId: string },
        { rejectWithValue, getState }
    ) => {
        try {
            const commentRef = doc(
                commentsCollection(data.feedId),
                data.commentId
            )
            await deleteDoc(commentRef)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
