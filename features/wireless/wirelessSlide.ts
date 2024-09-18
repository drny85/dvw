import { InternetPlan, Line, WirelessQuote } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface DataState {
    expressAutoPay: 0 | 10
    expressFirstResponder: boolean
    expressHasFios: boolean
    expressInternet: InternetPlan
    BYOD: boolean
    hoverPlan: 'plus' | 'welcome' | 'ultimate' | undefined
    lines: Line[]
    reviewModal: 'review' | 'quote' | undefined
    getStarted: boolean
    quotes: WirelessQuote[]
    shake: boolean
    isWelcome: boolean
    fromQuote: boolean
    showInfo: boolean
    dueTotal: number
}

const initialState: DataState = {
    expressAutoPay: 10,
    expressFirstResponder: false,
    BYOD: false,
    expressHasFios: true,
    expressInternet: undefined,
    hoverPlan: undefined,
    lines: [],
    reviewModal: undefined,
    getStarted: false,
    quotes: [],
    shake: false,
    isWelcome: true,
    fromQuote: false,
    showInfo: false,
    dueTotal: 0
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
        toogleShake: (state, { payload }: PayloadAction<boolean>) => {
            state.shake = payload
        },
        toggleIsWelcomeQualified: (state) => {
            state.isWelcome = !state.isWelcome
        },
        setFromQuote: (state, { payload }: PayloadAction<boolean>) => {
            state.fromQuote = payload
        },
        setShowInfo: (state, { payload }: PayloadAction<boolean>) => {
            state.showInfo = payload
        },
        setDueToday: (state, { payload }: PayloadAction<number>) => {
            state.dueTotal = payload
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
    setShowInfo,
    setQuotes,
    toogleShake,
    toggleIsWelcomeQualified,
    setFromQuote,
    setDueToday
} = wirelessSlide.actions

export default wirelessSlide.reducer
