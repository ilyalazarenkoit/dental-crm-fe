/**
 * @module TokenSlice
 * @remarks Redux slice for managing password reset token state
 */

import { TokenPayload, TokenState } from "@models/set-password.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Initial state for the token slice
 */
const initialState: TokenState = {
  resetToken: null,
  userId: null,
  expiry: null,
  spf: "",
  mail: "",
};

/**
 * Redux slice for token management
 * @remarks Handles token-related state including reset tokens and user IDs
 */
const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    /**
     * Sets both token and user ID in the store
     * @param state - Current token state
     * @param action - Action containing token and ID
     */
    setTokenParams: (state, action: PayloadAction<TokenPayload>) => {
      state.resetToken = action.payload.token;
      state.userId = action.payload.id;
      state.spf = action.payload.spf;
      state.mail = action.payload.mail;
      state.expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    },
    /**
     * Clears all token-related data from store and session storage
     * @param state - Current token state
     */
    clearToken: (state) => {
      state.resetToken = null;
      state.userId = null;
      state.expiry = null;
      state.spf = "";
      state.mail = "";
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("reset_data");
      }
    },
  },
});

export const { setTokenParams, clearToken } = tokenSlice.actions;

/**
 * Selector for getting reset-related data from the token state
 * @param state - The token state
 * @returns Reset-related data including token and user ID
 */
export const selectResetData = (state: TokenState) => ({
  token: state.resetToken,
  id: state.userId,
});

export const tokenReducer = tokenSlice.reducer;
