import { referralssCollection } from '@/lib/collections'
import { RootState } from '@/store/configureStore'
import { Referral } from '@/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const addReferral = createAsyncThunk(
    'referrals/add',
    async (referral: Referral, { rejectWithValue, getState }) => {
        try {
            const {
                auth: { user }
            } = getState() as RootState
            if (!user?.id) return
            await addDoc(referralssCollection(user.id), referral)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateReferral = createAsyncThunk(
    'referrals/update',
    async (referral: Referral, { rejectWithValue, getState }) => {
        try {
            const {
                auth: { user }
            } = getState() as RootState
            if (!user?.id) return

            const ref = doc(referralssCollection(user.id), referral.id)
            await updateDoc(ref, referral)
        } catch (error) {
            console.log('Error updating referral', error)
            return rejectWithValue(error)
        }
    }
)

export const deleteReferral = createAsyncThunk(
    'referrals/delete',
    async (referralId: string, { rejectWithValue, getState }) => {
        try {
            const {
                auth: { user }
            } = getState() as RootState
            if (!user?.id) return
            const ref = doc(referralssCollection(user.id), referralId)
            await deleteDoc(ref)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
