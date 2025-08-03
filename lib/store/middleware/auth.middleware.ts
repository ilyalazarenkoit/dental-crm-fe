/**
 * @module AuthMiddleware
 * @remarks Authentication middleware for Redux store.
 * Handles authentication-related actions and error states in the Redux store,
 * including login attempt tracking and error notifications
 */

import { Middleware } from "@reduxjs/toolkit";
import { toast } from "keep-react";
import { t } from "i18next";
import { AuthError } from "@models/error.model";

/**
 * Redux middleware for handling authentication-related actions and errors
 * @remarks Monitors authentication actions, tracks login attempts, and handles error notifications.
 * Specifically handles cases like too many failed login attempts and displays appropriate error messages.
 * @returns A middleware function that processes actions
 */
export const authMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const result = next(action);

    /**
     * Type guard to check if an action is a setCredentials action
     * @param action - The action to check
     * @returns True if the action is a setCredentials action with the correct type
     */
    const isSetCredentialsAction = (
      action: unknown
    ): action is { type: string } => {
      return (
        typeof action === "object" &&
        action !== null &&
        "type" in action &&
        action.type === "auth/setCredentials"
      );
    };

    if (isSetCredentialsAction(action)) {
      const state = store.getState().auth;

      if (state.error) {
        if (state.loginAttempts >= 3) {
          const errorPayload: AuthError = {
            code: "TOO_MANY_ATTEMPTS",
            message: t("auth.error"),
            timestamp: new Date().toISOString(),
            authFailureReason: "invalid_credentials",
          };

          store.dispatch({
            type: "auth/setError",
            payload: errorPayload,
          });

          toast.error(t("auth.error"));
        }
      }
    }

    return result;
  };

export default authMiddleware;
