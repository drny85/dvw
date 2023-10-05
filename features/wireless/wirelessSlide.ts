import { Line, WirelessQuote } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface DataState {
    expressAutoPay: 0 | 10
    expressFirstResponder: boolean
    expressHasFios: boolean
    expressInternet: '200' | '400' | 'gig' | '2gig' | undefined
    BYOD: boolean
    hoverPlan: 'plus' | 'welcome' | 'ultimate' | undefined
    lines: Line[]
    reviewModal: 'review' | 'quote' | undefined
    getStarted: boolean
    quotes: WirelessQuote[]
    shake: boolean
}

const initialState: DataState = {
    expressAutoPay: 10,
    expressFirstResponder: false,
    BYOD: false,
    expressHasFios: false,
    expressInternet: undefined,
    hoverPlan: undefined,
    lines: [],
    reviewModal: undefined,
    getStarted: false,
    quotes: [],
    shake: false
}

const wirelessSlide = createSlice({
    name: 'wireless',
    initialState,
    reducers: {
        setExpressAutoPay: (
            state,
            { payload }: PayloadAction<DataState['expressAutoPay']>
        ) => {
            state.expressAutoPay = payload
        },
        setExpressFirstResponder: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.expressFirstResponder = payload
        },
        setExpressHasFios: (state, { payload }: PayloadAction<boolean>) => {
            state.expressHasFios = payload
        },

        setExpressInternet: (
            state,
            { payload }: PayloadAction<DataState['expressInternet']>
        ) => {
            state.expressInternet = payload
        },

        setExpressReset: (state) => {
            return (state = initialState)
        },
        toogleBYOD: (state) => {
            state.BYOD = !state.BYOD
        },
        setLinesData: (state, { payload }: PayloadAction<Line[]>) => {
            state.lines = payload
        },

        toogleHoverPlan: (
            state,
            {
                payload
            }: PayloadAction<'plus' | 'welcome' | 'ultimate' | undefined>
        ) => {
            state.hoverPlan = payload
        },
        setReviewModal: (
            state,
            { payload }: PayloadAction<DataState['reviewModal']>
        ) => {
            state.reviewModal = payload
        },

        setGetStarted: (state, { payload }: PayloadAction<boolean>) => {
            state.getStarted = payload
        },
        setQuotes: (state, { payload }: PayloadAction<WirelessQuote[]>) => {
            state.quotes = payload
        },
        toogleShake: (state) => {
            state.shake = !state.shake
        }
    }
})

export const {
    setExpressAutoPay,
    setExpressFirstResponder,
    setExpressHasFios,
    setExpressInternet,
    setExpressReset,
    toogleBYOD,
    setLinesData,
    toogleHoverPlan,
    setReviewModal,
    setGetStarted,
    setQuotes,
    toogleShake
} = wirelessSlide.actions

export default wirelessSlide.reducer
