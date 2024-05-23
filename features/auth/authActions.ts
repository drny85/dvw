import { createAsyncThunk } from '@reduxjs/toolkit'

import { auth } from '@/firebase'
import { RootState } from '@/store/configureStore'
import { usersCollection } from '@/utils/collections'
import { signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { AppUser } from '@/types'

export const getUser = createAsyncThunk(
    'auth/get',
    async (values: {
        userId: string
        isVerified: boolean
    }): Promise<AppUser | null> => {
        try {
            if (!values.userId) return null
            const userRef = doc(usersCollection, values.userId)

            const userData = (await getDoc(userRef)).data()
            const appUser: AppUser = {
                id: userData?.id!,
                email: userData?.email!,
                acceptedEULA: userData?.acceptedEULA || false,
                role: userData?.role || 'em',
                emailVerified: values.isVerified,
                name: userData?.name || '',
                image: userData?.image || '',
                pushToken: userData?.pushToken || null,
                createdAt: userData?.createdAt || '',
                blockedUsers: userData?.blockedUsers || [],
                isOnline: false,
                coachId: userData?.coachId || null,
                phone: userData?.phone || null
            }

            return appUser
        } catch (error) {
            return null
        }
    }
)

export const updateUser = createAsyncThunk(
    'auth/update',
    async (data: AppUser, { rejectWithValue, getState }) => {
        try {
            const {
                auth: { user }
            } = getState() as RootState
            if (!user) return
            const userRef = doc(usersCollection, user.id)
            await updateDoc(userRef, { ...data })
            return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }): Promise<null> => {
        try {
            await signOut(auth)
            //dispatch(setAppUser(null));
            return null
        } catch (error) {
            console.log(error)
            //dispatch(setAppUser(null));
            return null
        }
    }
)
