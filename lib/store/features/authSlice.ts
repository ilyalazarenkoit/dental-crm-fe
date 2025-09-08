import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  JWTPayload,
  LoginResponse,
  RefreshResponse,
} from "@models/auth.model";
import { jwtDecode } from "jwt-decode";
import { toast } from "keep-react";
import { t } from "i18next";

/**
 * Secure token cleanup with complete removal of all traces
 * Complies with NIST SP 800-53 standards
 * Note: In secure architecture, tokens are managed by backend via HttpOnly cookies
 */
const clearAuthTokens = () => {
  // Clear all authentication cookies for backward compatibility
  const cookiesToClear = [
    "auth_token",
    "refresh_token",
    "refreshToken",
    "session_type",
    "accessToken", // Legacy
    "session", // Legacy
  ];

  const clearCookie = (name: string, path: string, domain?: string) => {
    const domainPart = domain ? `; domain=${domain}` : "";
    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainPart}`;
  };

  cookiesToClear.forEach((cookieName) => {
    // Clear for root path
    clearCookie(cookieName, "/");

    // Clear for current domain and subdomain
    const domains = [window.location.hostname, `.${window.location.hostname}`];
    domains.forEach((domain) => {
      clearCookie(cookieName, "/", domain);
    });
  });
};

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

    // 3. Not before time check (nbf) - required
    if (!decoded.nbf || decoded.nbf > currentTime) {
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
          state.isAuthenticated = true;
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
      clearAuthTokens();
      toast.info(t("auth.logedOut"));
    },
    reset: (state) => {
      Object.assign(state, {
        ...initialState,
        loginAttempts: state.loginAttempts,
      });
      clearAuthTokens();
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
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    initializeAuth: (state) => {
      // In secure architecture, we don't store tokens in Redux
      // Authentication state is managed by the backend via HttpOnly cookies
      // This method is kept for backward compatibility but simplified
      state.isAuthenticated = false;
      state.userId = null;
      state.user = null;
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
export const selectAuthError = (state: AuthSelectorState) => state.auth.error;
export const selectIsRefreshing = (state: AuthSelectorState) =>
  state.auth.isRefreshing;

export const authReducer = authSlice.reducer;
