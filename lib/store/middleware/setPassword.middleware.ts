/**
 * @module SetPasswordMiddleware
 * @remarks Provides server-side access to password reset state from the Redux store
 */

import { store } from "@store/store";

/**
 * Retrieves the current password reset state from the Redux store
 * @returns Object containing the current password reset status and loading state
 */
export async function getServerSetPasswordState() {
  const state = store.getState();
  return {
    setPasswordStatus: state.setPassword.setPasswordStatus,
    isLoading: state.setPassword.isLoading,
  };
}
