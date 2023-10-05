import { createSlice } from "@reduxjs/toolkit";
import { addComment, deleteComment, updateComment } from "./commentActions";
import { Comment } from "@/types";

type CommentsState = {
  loading: boolean;
  comments: Comment[];
};
const initialState: CommentsState = {
  loading: false,
  comments: [],
};

const commentsSlide = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addComment.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateComment.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteComment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {} = commentsSlide.actions;

export default commentsSlide.reducer;
