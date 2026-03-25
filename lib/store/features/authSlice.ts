import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  JWTPayload,
  LoginResponse,
  MeOrganization,
  MeUser,
  RefreshResponse,
} from "@models/auth.model";
import { jwtDecode } from "jwt-decode";
import { toast } from "@/lib/utils/toast";
import { t } from "i18next";

/**
 * Enhanced JWT token validation using cybersecurity best practices
 * Updated for new backend JWT format
 * Based on RFC 7519, OWASP JWT Security Cheat Sheet
 */
const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    // 1. Expiration time check (exp) - required
    if (!decoded.exp || decoded.exp <= currentTime) {
      return false;
    }

    // 2. Issued at time check (iat) - required, token should not be from future
    if (!decoded.iat || decoded.iat > currentTime) {
      return false;
    }

    // 3. Not before time check (nbf) — optional per RFC 7519.
    // Only reject the token if nbf is present AND its value is in the future.
    if (decoded.nbf && decoded.nbf > currentTime) {
      return false;
    }

    // 4. Required fields check
    if (!decoded.sub || typeof decoded.sub !== "string") {
      return false;
    }

    // 5. UUID format validation for sub
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(decoded.sub)) {
      return false;
    }

    // 6. JWT ID validation (jti) - required
    if (!decoded.jti || typeof decoded.jti !== "string") {
      return false;
    }

    // 7. Issuer validation (iss) - required
    if (!decoded.iss || typeof decoded.iss !== "string") {
      return false;
    }

    // 8. Audience validation (aud) - required
    if (!decoded.aud || typeof decoded.aud !== "string") {
      return false;
    }

    // 9. Security fingerprint validation - required
    if (!decoded.fingerprint || typeof decoded.fingerprint !== "string") {
      return false;
    }

    // 10. Token age validation (should not be too old)
    const maxTokenAge = 24 * 60 * 60; // 24 hours
    if (currentTime - decoded.iat > maxTokenAge) {
      return false;
    }

    // 11. Minimum lifetime validation (protection against very short tokens)
    const minTokenAge = 60; // 1 minute
    if (decoded.exp - decoded.iat < minTokenAge) {
      return false;
    }

    // 12. Validate expected issuer and audience (constant-time comparison)
    const expectedIssuer = "dentalcrm-backend";
    const expectedAudience = "dentalcrm-frontend";

    let isValid = true;

    // Constant-time comparison to prevent timing attacks
    if (decoded.iss.length !== expectedIssuer.length) {
      isValid = false;
    } else {
      for (let i = 0; i < expectedIssuer.length; i++) {
        if (decoded.iss.charCodeAt(i) !== expectedIssuer.charCodeAt(i)) {
          isValid = false;
          break;
        }
      }
    }

    if (decoded.aud.length !== expectedAudience.length) {
      isValid = false;
    } else {
      for (let i = 0; i < expectedAudience.length; i++) {
        if (decoded.aud.charCodeAt(i) !== expectedAudience.charCodeAt(i)) {
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  } catch {
    return false;
  }
};

const initialState: AuthState = {
  userId: null,
  accessToken: null,
  isAuthenticated: false,
  error: null,
  lastLogin: null,
  loginAttempts: 0,
  isRefreshing: false,
  user: null,
  organization: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user: LoginResponse["user"];
      }>
    ) => {
      const { accessToken, user } = action.payload;

      if (!isTokenValid(accessToken)) {
        state.error = {
          code: "AUTH_ERROR",
          message: t("auth-errors.login-failed"),
          timestamp: new Date().toISOString(),
          authFailureReason: "invalid_token",
        };
        state.userId = null;
        state.isAuthenticated = false;
        state.loginAttempts += 1;
        toast.error(t("auth-errors.login-failed"));
        return;
      }

      try {
        const decoded = jwtDecode<JWTPayload>(accessToken);

        // Validate that the token sub matches the user ID from backend
        if (decoded.sub !== user.userId) {
          state.error = {
            code: "AUTH_ERROR",
            message: t("auth-errors.login-failed"),
            timestamp: new Date().toISOString(),
            authFailureReason: "user_id_mismatch",
          };
          state.userId = null;
          state.isAuthenticated = false;
          state.loginAttempts += 1;
          toast.error(t("auth-errors.login-failed"));
          return;
        }

        // Additional security: validate fingerprint format
        if (
          !decoded.fingerprint ||
          typeof decoded.fingerprint !== "string" ||
          decoded.fingerprint.length < 8
        ) {
          state.error = {
            code: "AUTH_ERROR",
            message: t("auth-errors.login-failed"),
            timestamp: new Date().toISOString(),
            authFailureReason: "invalid_token",
          };
          state.userId = null;
          state.isAuthenticated = false;
          state.loginAttempts += 1;
          toast.error(t("auth-errors.login-failed"));
          return;
        }

        state.userId = decoded.sub;
        state.accessToken = accessToken;
        state.isAuthenticated = true;
        state.user = user;
        state.error = null;
        state.lastLogin = new Date().toISOString();
        state.loginAttempts = 0;
      } catch (error) {
        state.error = {
          code: "AUTH_ERROR",
          message: t("auth.error"),
          timestamp: new Date().toISOString(),
          details: { error: (error as Error).message },
        };
        state.userId = null;
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
    },
    reset: (state) => {
      Object.assign(state, {
        ...initialState,
        loginAttempts: state.loginAttempts,
      });
    },
    clearErrors: (state) => {
      state.error = null;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
    },
    refreshAccessToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user: RefreshResponse["user"];
      }>
    ) => {
      const { accessToken, user } = action.payload;

      if (!isTokenValid(accessToken)) {
        state.error = {
          code: "AUTH_ERROR",
          message: t("auth-errors.token-refresh-failed"),
          timestamp: new Date().toISOString(),
          authFailureReason: "invalid_refresh_token",
        };
        return;
      }

      try {
        const decoded = jwtDecode<JWTPayload>(accessToken);

        state.userId = decoded.sub;
        state.accessToken = accessToken;
        state.user = user;
        state.isRefreshing = false;
        state.error = null;
        state.lastLogin = new Date().toISOString();
      } catch (error) {
        state.error = {
          code: "AUTH_ERROR",
          message: t("auth-errors.token-refresh-failed"),
          timestamp: new Date().toISOString(),
          details: { error: (error as Error).message },
        };
        state.isRefreshing = false;
      }
    },
    /**
     * Stores the result of GET /users/me.
     * Called once on app init (providers.tsx) after isAuthenticated is true.
     */
    setUserMeData: (
      state,
      action: PayloadAction<{ user: MeUser; organization: MeOrganization }>
    ) => {
      const { user, organization } = action.payload;
      state.organization = organization;
      if (state.user) {
        state.user.avatarUrl = user.avatarUrl;
      }
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    initializeAuth: (state) => {
      // Reset only ephemeral runtime data that should not survive a page reload.
      // isAuthenticated / userId / user are restored from redux-persist (localStorage)
      // and must NOT be cleared here — clearing them would cause a race condition
      // where the persisted "logged-in" state is briefly wiped on every mount.
      // accessToken is never persisted (see authTransform in store.ts).
      state.accessToken = null;
      state.isRefreshing = false;
      state.error = null;
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
  refreshAccessToken,
  setRefreshing,
  setUserMeData,
} = authSlice.actions;

// Type for selectors that works with persisted state
type AuthSelectorState = { auth: AuthState };

export const selectCurrentUserId = (state: AuthSelectorState) =>
  state.auth.userId;
export const selectAccessToken = (state: AuthSelectorState) =>
  state.auth.accessToken;
export const selectIsAuthenticated = (state: AuthSelectorState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: AuthSelectorState) => state.auth.user;
export const selectOrganization = (state: AuthSelectorState) =>
  state.auth.organization;
export const selectAuthError = (state: AuthSelectorState) => state.auth.error;
export const selectIsRefreshing = (state: AuthSelectorState) =>
  state.auth.isRefreshing;

export const authReducer = authSlice.reducer;
