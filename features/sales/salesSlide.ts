import { Referral, SalesRange } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type SalesState = {
    range: SalesRange
    saleQuote: Referral | null
}
const initialState: SalesState = {
    range: 'today',
    saleQuote: null
}

const salesSlide = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        setRange: (state, action) => {
            state.range = action.payload
        },
        setSaleQuoteReferral: (
            state,
            { payload }: PayloadAction<Referral | null>
        ) => {
            state.saleQuote = payload
        }
    }
})

export const { setRange, setSaleQuoteReferral } = salesSlide.actions

export default salesSlide.reducer
