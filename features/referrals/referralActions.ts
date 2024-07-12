import { RootState } from '@/store/configureStore'
import { Referral } from '@/types'
import { referralssCollection } from '@/utils/collections'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { setId } from '../sales/salesSlide'
import { ContactPerson, saveContact } from '@/utils/saveContact'

export const addReferral = createAsyncThunk(
    'referrals/add',
    async (
        referral: Referral,
        { getState, dispatch }
    ): Promise<string | null> => {
        try {
            const {
                auth: { user },
                settings: { saveContact: save }
            } = getState() as RootState
            if (!user?.id) return null
            const res = await addDoc(referralssCollection(user.id), referral)
            dispatch(setId(res.id))
            const c: ContactPerson = {
                firstName: referral.name,
                note: referral.address,
                phone: referral.phone,
                email: referral.email!
            }
            if (save) {
                await saveContact(c)
            }

            return Promise.resolve(res.id)
        } catch (error) {
            console.log(error)
            return Promise.reject(null)
        }
    }
)

export const updateReferral = createAsyncThunk(
    'referrals/update',
    async (
        referral: Referral,
        { getState, dispatch }
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
