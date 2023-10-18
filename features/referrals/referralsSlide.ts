import { Referral } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ReferralsState = {
    referral: Referral | null
    editing: boolean
}
const initialState: ReferralsState = {
    referral: null,
    editing: false
}

const referralsSlide = createSlice({
    name: 'referrals',
    initialState,
    reducers: {
        setReferralState: (state, action) => {
            state.referral = action.payload
        },
        setEditingReferral: (state, { payload }: PayloadAction<boolean>) => {
            state.editing = payload
        }
    }
})

export const { setReferralState, setEditingReferral } = referralsSlide.actions

export default referralsSlide.reducer
