import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getUser, logoutUser } from "./authActions";

// Define the type for the authentication state
export type AppUser = {
  id: string;
  name: string;
  email?: string;
  emailVerified: boolean;
  role?: UserRole;
  image?: string;
  pushToken?: string;
  createdAt?: string;
};

export type UserRole = "admin" | "em" | "coach";
export type AuthState = {
  user: AppUser | null;
  loading: boolean; // Indicates if the user is logged in
};

const initialState: AuthState = {
  user: null,
  loading: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAppUser: (state, { payload }: PayloadAction<AppUser | null>) => {
      state.user = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(getUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;

        state.user = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { setAppUser } = slice.actions;

const authReducer = slice.reducer;

export default authReducer;
