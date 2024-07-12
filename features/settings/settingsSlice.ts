// Import necessary module from Redux Toolkit
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// Define the possible themes as 'dark', 'light', or 'auto'
export type Theme = 'dark' | 'light' | 'auto' | 'pink'

export type SettingsState = {
    theme: Theme
    route: 'myPlan' | null
    shake: boolean
    show5G: boolean
    saveContact: boolean
}

export const themes: Theme[] = ['auto', 'dark', 'light']

const initialState: SettingsState = {
    theme: themes[0],
    route: null,
    shake: true,
    show5G: false,
    saveContact: true // Default theme is 'auto'
}

const slice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateTheme(state, { payload }: { payload: Theme }) {
            state.theme = payload // Update the theme based on the provided payload
        },
        setReturnRoute: (
            state,
            { payload }: PayloadAction<SettingsState['route']>
        ) => {
            state.route = payload
        },
        setShake: (state, { payload }: PayloadAction<boolean>) => {
            state.shake = payload
        },
        setShow5G: (state, { payload }: PayloadAction<boolean>) => {
            state.show5G = payload
        },
        setSaveContact: (state, { payload }: PayloadAction<boolean>) => {
            state.saveContact = payload
        }
    }
})

const settingsReducer = slice.reducer

export const {
    updateTheme,
    setReturnRoute,
    setShake,
    setShow5G,
    setSaveContact
} = slice.actions

export default settingsReducer
