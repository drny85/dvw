import { Chat } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { createChat, sendMessage } from "./chatsActions";

type ChatsState = {
  chats: Chat[];
  chat: Chat | null;
  loading: boolean;
};
const initialState: ChatsState = {
  chats: [],
  chat: null,
  loading: false,
};

const chatsSlide = createSlice({
  name: "chats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(createChat.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const {} = chatsSlide.actions;

export default chatsSlide.reducer;
