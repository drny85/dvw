import { Referral } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ReferralsState = {
    referral: Referral | null
    referralId: string | null
    editing: boolean
    goToPlan: boolean
}
const initialState: ReferralsState = {
    referral: null,
    editing: false,
    goToPlan: false,

    referralId: null
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
        },
        setGoToPlanRoute: (state, { payload }: PayloadAction<boolean>) => {
            state.goToPlan = payload
        },

        setReferralId: (state, { payload }: PayloadAction<string | null>) => {
            state.referralId = payload
        }
    }
})

export const {
    setReferralState,
    setEditingReferral,
    setGoToPlanRoute,
    setReferralId
} = referralsSlide.actions

export default referralsSlide.reducer
