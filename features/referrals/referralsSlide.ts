import { Referral } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ReferralsState = {
    referral: Referral | null
    editing: boolean
    goToPlan: boolean
}
const initialState: ReferralsState = {
    referral: null,
    editing: false,
    goToPlan: false
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
        }
    }
})

export const { setReferralState, setEditingReferral, setGoToPlanRoute } =
    referralsSlide.actions

export default referralsSlide.reducer
