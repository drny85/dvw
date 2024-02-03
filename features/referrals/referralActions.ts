import { referralssCollection } from '@/utils/collections'
import { RootState } from '@/store/configureStore'
import { Referral } from '@/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { setId } from '../sales/salesSlide'

export const addReferral = createAsyncThunk(
    'referrals/add',
    async (
        referral: Referral,
        { rejectWithValue, getState, dispatch }
    ): Promise<string | null> => {
        try {
            const {
                auth: { user }
            } = getState() as RootState
            if (!user?.id) return null
            const res = await addDoc(referralssCollection(user.id), referral)
            dispatch(setId(res.id))
            return res.id
        } catch (error) {
            console.log(error)
            return null
        }
    }
)

export const updateReferral = createAsyncThunk(
    'referrals/update',
    async (
        referral: Referral,
        { rejectWithValue, getState, dispatch }
    ): Promise<string | null> => {
        try {
            const {
                auth: { user }
            } = getState() as RootState
            if (!user?.id) return null
            if (!referral.id) return null
            const ref = doc(referralssCollection(user.id), referral.id)
            await updateDoc(ref, referral)
            dispatch(setId(referral.id))
            return referral.id!
        } catch (error) {
            console.log('Error updating referral', error)
            return null
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
