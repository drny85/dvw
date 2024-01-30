import { Referral } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ReferralsState = {
    referral: Referral | null
    referrals: Referral[]
    referralId: string | null
    editing: boolean
    goToPlan: boolean
    showScheduler: boolean
}
const initialState: ReferralsState = {
    referral: null,
    referrals: [],
    editing: false,
    goToPlan: false,
    showScheduler: false,
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
        },
        setShowScheduler: (state, { payload }: PayloadAction<boolean>) => {
            state.showScheduler = payload
        },
        setAllReferrals: (state, { payload }: PayloadAction<Referral[]>) => {
            state.referrals = payload
        }
    }
})

export const {
    setReferralState,
    setEditingReferral,
    setGoToPlanRoute,
    setReferralId,
    setShowScheduler,
    setAllReferrals
} = referralsSlide.actions

export default referralsSlide.reducer
