import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "@store/store";
import { ninoxAuthService } from "@store/services/ninoxAuthService";
import {
  PasswordResetRequest,
  PasswordRecoveryState,
  SendEmailPayload,
} from "@models/password-recovery.model";

const initialState: PasswordRecoveryState = {
  email: null,
  isEmailSent: false,
  isLoading: false,
  error: null,
  verificationCode: "",
  passwordChangeStatus: null,
  passwordChangeError: null,
  timestamp: null,
};

export const handleEmailSubmitThunk = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: RootState }
>(
  "passwordRecovery/handleEmailSubmit",
  async (email, { dispatch, rejectWithValue }) => {
    dispatch(startLoading());

    try {
      const result = await dispatch(
        ninoxAuthService.endpoints.resetPasswordCode.initiate({ mail: email })
      ).unwrap();
      if (!result.error) {
        const timestamp = Date.now();
        localStorage.setItem("email", email);
        dispatch(sendEmailSuccess({ email, timestamp }));
      } else {
        dispatch(sendEmailFailure(result.message));
      }
    } catch (error) {
      console.error("Error during email submission:", error);
      dispatch(sendEmailFailure("unexpected-error"));
      return rejectWithValue(error);
    }
  }
);

export const handlePasswordSubmitThunk = createAsyncThunk<
  void,
  { password: string },
  { state: RootState }
>(
  "passwordRecovery/handlePasswordSubmit",
  async ({ password }, { dispatch, getState, rejectWithValue }) => {
    dispatch(startLoading());

    const state = getState();
    const { email, verificationCode } = state.passwordRecovery;

    const requestData: PasswordResetRequest = {
      mail: email || "",
      resetCode: verificationCode || "",
      newPassword: password,
    };

    try {
      const result = await dispatch(
        ninoxAuthService.endpoints.passwordReset2.initiate(requestData)
      ).unwrap();

      if (!result.error) {
        dispatch(setPasswordChangeSuccess());
      } else {
        dispatch(setPasswordChangeFailed(result.message));
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      dispatch(setPasswordChangeFailed("unexpected-error"));
      return rejectWithValue(error);
    }
  }
);

const passwordRecoverySlice = createSlice({
  name: "passwordRecovery",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    sendEmailSuccess(state, action: PayloadAction<SendEmailPayload>) {
      state.isLoading = false;
      state.isEmailSent = true;
      state.email = action.payload.email;
      state.timestamp = action.payload.timestamp;
    },
    sendEmailFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
      state.passwordChangeStatus = "failed";
    },
    updateVerificationCode(state, action: PayloadAction<string>) {
      state.verificationCode = action.payload;
    },
    setPasswordChangeSuccess(state) {
      state.passwordChangeStatus = "success";
      state.isLoading = false;
    },
    setPasswordChangeFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.passwordChangeStatus = "failed";
      state.isLoading = false;
    },
    resetPasswordRecoveryLocalStorage(state) {
      state.passwordChangeStatus = null;
      state.isLoading = false;
      state.email = null;
      state.isEmailSent = false;
      state.verificationCode = "";
      state.error = null;
      state.passwordChangeError = null;
      state.timestamp = null;
    },
  },
});

export const {
  startLoading,
  sendEmailSuccess,
  sendEmailFailure,
  updateVerificationCode,
  setPasswordChangeSuccess,
  setPasswordChangeFailed,
  resetPasswordRecoveryLocalStorage,
} = passwordRecoverySlice.actions;

export default passwordRecoverySlice.reducer;
