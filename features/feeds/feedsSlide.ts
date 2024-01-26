import { Feed } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { addFeed } from './feedsActions'

type FeedsState = {
    feeds: Feed[]
    loading: boolean
    feed: Feed | null
    postInfo: { message: string; image: string }
    view: 'feeds' | 'posts'
}
const initialState: FeedsState = {
    feeds: [],
    loading: false,
    feed: null,
    postInfo: { message: '', image: '' },
    view: 'feeds'
}

const feedsSlide = createSlice({
    name: 'feeds',
    initialState,
    reducers: {
        setFeeds: (state, { payload }: PayloadAction<Feed[]>) => {
            state.feeds = payload
        },
        setFeed: (state, { payload }: PayloadAction<Feed>) => {
            state.feed = payload
        },
        setPostInfo: (
            state,
            { payload }: PayloadAction<FeedsState['postInfo']>
        ) => {
            state.postInfo = payload
        },
        setView: (state, { payload }: PayloadAction<FeedsState['view']>) => {
            state.view = payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addFeed.pending, (state) => {
                state.loading = true
            })
            .addCase(addFeed.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(addFeed.rejected, (state) => {
                state.loading = false
            })
    }
})

export const { setFeeds, setFeed, setPostInfo, setView } = feedsSlide.actions

export default feedsSlide.reducer
