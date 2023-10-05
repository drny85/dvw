import { SalesRange } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type SalesState = {
  range: SalesRange;
};
const initialState: SalesState = {
  range: "today",
};

const salesSlide = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setRange: (state, action) => {
      state.range = action.payload;
    },
  },
});

export const { setRange } = salesSlide.actions;

export default salesSlide.reducer;
