import { Referral, SalesRange } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type SalesState = {
    range: SalesRange
    id: string | null
    saleQuote: Referral | null
}
const initialState: SalesState = {
    range: 'today',
    saleQuote: null,
    id: null
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
        },
        setId: (state, { payload }: PayloadAction<string | null>) => {
            state.id = payload
        }
    }
})

export const { setRange, setSaleQuoteReferral, setId } = salesSlide.actions

export default salesSlide.reducer
