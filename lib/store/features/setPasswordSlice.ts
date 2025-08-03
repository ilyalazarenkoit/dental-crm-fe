/**
 * @module SetPasswordSlice
 * @remarks Redux slice for handling password reset functionality.
 * Manages the state and actions for password reset operations,
 * including validation, API communication, and success/error handling
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "keep-react";
import { ninoxAuthService } from "@store/services/ninoxAuthService";
import { RootState } from "@store/store";
import { SetPasswordState } from "@models/set-password.model";
import { t } from "i18next";

/**
 * Initial state for the password reset slice
 */
const initialState: SetPasswordState = {
  isLoading: true,
  error: null,
  setPasswordSuccess: false,
  setPasswordStatus: null,
  setPasswordError: null,
};

/**
 * Async thunk for setting a new user password
 * @remarks Handles the password reset process including validation,
 * session data retrieval, and API communication
 * @param password - The new password to set
 */
export const setUserPassword = createAsyncThunk(
  "setPassword/setUserPassword",
  async ({ password }: { password: string }, { dispatch, rejectWithValue }) => {
    if (!password || password.trim() === "") {
      const errorMessage = t("auth.password-empty");
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }

    try {
      const sessionData = sessionStorage.getItem("reset_data");
      if (!sessionData) {
        throw new Error("No reset data found");
      }

      const parsedData = JSON.parse(sessionData);

      const response = await dispatch(
        ninoxAuthService.endpoints.passwordReset2.initiate({
          resetCode: parsedData.token,
          newPassword: password,
          mail: parsedData.mail,
        })
      ).unwrap();

      if (response && response.message === "password reset successful") {
        toast.success(t("auth.save-password-success"));
        return true;
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset password";
      toast.error(t("auth.save-password-error"));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Redux slice for password reset functionality
 * @remarks Handles the state management for password reset operations
 */
const setPasswordSlice = createSlice({
  name: "setPassword",
  initialState,
  reducers: {
    /**
     * Resets the password success state
     * @param state - Current state
     */
    resetPasswordSuccess(state) {
      state.setPasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.setPasswordStatus = null;
      })
      .addCase(setUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.setPasswordSuccess = true;
        state.error = null;
        state.setPasswordStatus = "success";
      })
      .addCase(setUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.setPasswordStatus = "failed";
        state.setPasswordError = action.payload as string;
      });
  },
});

export const { resetPasswordSuccess } = setPasswordSlice.actions;

/**
 * Selector for getting the password reset state from the root state
 * @param state - The root state of the Redux store
 * @returns The current password reset state
 */
export const selectSetPasswordState = (state: RootState) => state.setPassword;

export const setPasswordReducer = setPasswordSlice.reducer;
