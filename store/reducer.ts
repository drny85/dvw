import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import tempReducer from '@/features/other/tempSlice'
import authReducer from '@/features/auth/authSlice'
import settingsReducer from '@/features/settings/settingsSlice'
import feedsSlide from '@/features/feeds/feedsSlide'
import wirelessSlide from '@/features/wireless/wirelessSlide'
import salesSlide from '@/features/sales/salesSlide'
import chatsSlide from '@/features/chats/chatsSlide'
import referralsSlide from '@/features/referrals/referralsSlide'

// Configuration for persisting the root state
const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['temp']
}

// Combine individual reducers into a single rootReducer
const combinedReducer = combineReducers({
    temp: tempReducer,
    auth: authReducer,
    feeds: feedsSlide,
    settings: settingsReducer,
    wireless: wirelessSlide,
    sales: salesSlide,
    chats: chatsSlide,
    referrals: referralsSlide
})

type MainReducer = ReturnType<typeof combinedReducer>

// Create a persisted reducer
const persistedReducer = persistReducer<MainReducer>(
    rootPersistConfig,
    combinedReducer
)

// Define the root reducer for the Redux store
export default function reducer(state: any, action: any) {
    // Reset the store if the action type is 'RESET_STORE'
    if (action.type === 'RESET_STORE') {
        state = undefined
    }
    return persistedReducer(state, action)
}
