// Import necessary module from Redux Toolkit
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// Define the possible themes as 'dark', 'light', or 'auto'
export type Theme = 'dark' | 'light' | 'auto' | 'pink'

export type SettingsState = {
    theme: Theme
    route: 'myPlan' | null
}

export const themes: Theme[] = ['auto', 'dark', 'light']

const initialState: SettingsState = {
    theme: themes[0],
    route: null // Default theme is 'auto'
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
        }
    }
})

const settingsReducer = slice.reducer

export const { updateTheme, setReturnRoute } = slice.actions

export default settingsReducer
