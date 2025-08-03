import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '@models/auth.model';

/**
 * Base selector for auth slice
 * @param state - The root state of the application
 */
const selectAuth = (state: RootState) => state.auth;

/**
 * Selects the current authentication status and user ID
 * Memoized to prevent unnecessary re-renders
 */
export const selectAuthStatus = createSelector(
  [selectAuth],
  (auth) => ({
    isAuthenticated: auth.isAuthenticated,
    userId: auth.userId
  })
);

/**
 * Direct selector for checking if user is authenticated
 * Use this when you only need the boolean value
 */
export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

/**
 * Direct selector for getting current user ID
 * Use this when you only need the user ID
 */
export const selectCurrentUserId = createSelector(
  [selectAuth],
  (auth) => auth.userId
);

/**
 * Selects the current JWT token
 * Use this for API calls that need the token
 */
export const selectToken = createSelector(
  [selectAuth],
  (auth) => auth.token
);

/**
 * Selects the current auth error state if any
 * Useful for displaying error messages
 */
export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.error
);

/**
 * Selects user roles from JWT if available
 * Returns empty array if no valid token exists
 */
export const selectUserRoles = createSelector(
  [selectAuth],
  (auth) => {
    if (!auth.token) return [];
    try {
      const decoded = jwtDecode<JWTPayload>(auth.token);
      return decoded.roles || [];
    } catch {
      return [];
    }
  }
);

/**
 * Selects session timing information
 * Useful for session management UI
 */
export const selectSessionInfo = createSelector(
  [selectAuth],
  (auth) => ({
    lastLogin: auth.lastLogin,
    sessionExpiry: auth.sessionExpiry
  })
);

/**
 * Selects login attempt information
 * Useful for implementing login attempt limitations
 */
export const selectLoginAttempts = createSelector(
  [selectAuth],
  (auth) => auth.loginAttempts
);