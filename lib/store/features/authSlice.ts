import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, JWTPayload } from "@models/auth.model";
import { jwtDecode } from "jwt-decode";
import { toast } from "keep-react";
import { t } from "i18next";
import { RootState } from "@store/store";

/**
 * Sets the auth token in localStorage or sessionStorage based on `rememberMe` flag.
 */
const setAuthToken = (token: string, rememberMe: boolean) => {
  if (rememberMe) {
    localStorage.setItem("auth_token", token);
    document.cookie = `auth_token=${token}; path=/; max-age=${
      30 * 24 * 60 * 60
    }`;
  } else {
    sessionStorage.setItem("auth_token", token);
    document.cookie = `auth_token=${token}; path=/;`;
  }
};

/**
 * Clears the auth token from both localStorage and sessionStorage.
 */
const clearAuthToken = () => {
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

/**
 * Validates a JWT token for expiration and required structure.
 */
const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime && !!decoded.userId;
  } catch {
    return false;
  }
};

const initialState: AuthState = {
  userId: null,
  token: null,
  isAuthenticated: false,
  error: null,
  lastLogin: null,
  sessionExpiry: null,
  loginAttempts: 0,
  rememberMe: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        jwt: string;
        user_id: string;
        rememberMe: boolean;
      }>
    ) => {
      const { jwt, user_id, rememberMe } = action.payload;

      if (!isTokenValid(jwt)) {
        state.error = {
          code: "AUTH_ERROR",
          message: t("auth-errors.login-failed"),
          timestamp: new Date().toISOString(),
          authFailureReason: "invalid_token",
        };
        state.userId = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loginAttempts += 1;
        toast.error(t("auth-errors.login-failed"));
        return;
      }

      try {
        const decoded = jwtDecode<JWTPayload>(jwt);
        state.userId = user_id;
        state.token = rememberMe ? jwt : null;
        state.isAuthenticated = true;
        state.error = null;
        state.lastLogin = new Date().toISOString();
        state.sessionExpiry = new Date(decoded.exp * 1000).toISOString();
        state.loginAttempts = 0;
        state.rememberMe = rememberMe;
        setAuthToken(jwt, rememberMe);
        toast.success(t("auth.success"));
      } catch (error) {
        state.error = {
          code: "AUTH_ERROR",
          message: t("auth.error"),
          timestamp: new Date().toISOString(),
          details: { error: (error as Error).message },
        };
        state.userId = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loginAttempts += 1;
        toast.error(t("auth.error"));
      }
    },
    logout: (state) => {
      Object.assign(state, {
        ...initialState,
        loginAttempts: state.loginAttempts,
      });
      clearAuthToken();
      toast.info(t("auth.logedOut"));
    },
    reset: (state) => {
      Object.assign(state, {
        ...initialState,
        loginAttempts: state.loginAttempts,
      });
      clearAuthToken();
    },
    clearErrors: (state) => {
      state.error = null;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
    },
    initializeAuth: (state) => {
      try {
        const token =
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="))
            ?.split("=")[1];
        if (token && isTokenValid(token)) {
          const decoded = jwtDecode<JWTPayload>(token);
          state.token = state.rememberMe ? token : null;
          state.userId = decoded.userId;
          state.isAuthenticated = true;
          state.error = null;
          state.sessionExpiry = new Date(decoded.exp * 1000).toISOString();
        } else {
          clearAuthToken();
          state.isAuthenticated = false;
          state.error = null;
        }
      } catch (error) {
        state.error = {
          code: "AUTH_ERROR",
          message: t("auth.error"),
          timestamp: new Date().toISOString(),
          details: { error: (error as Error).message },
        };
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  reset,
  clearErrors,
  resetLoginAttempts,
  initializeAuth,
} = authSlice.actions;

export const selectCurrentUserId = (state: RootState) => state.auth.userId;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthError = (state: RootState) => state.auth.error;

export const authReducer = authSlice.reducer;
