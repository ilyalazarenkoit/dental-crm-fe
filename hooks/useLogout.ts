import { useCallback, useState } from "react";
import { useAppDispatch } from "@/lib/store/store";
import { logout } from "@/lib/store/features/authSlice";
import { AuthService } from "@/lib/api/auth.service";
import { toast } from "@/lib/utils/toast";
import { t } from "i18next";
import { ROUTES } from "@/constants/routes";

/**
 * Hook for handling user logout.
 * httpOnly cookies are cleared server-side via /api/auth/logout.
 * Redux-persist clears its own state when dispatch(logout()) is called.
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Force logout: clears Redux state without waiting for the API.
   * providers.tsx pageshow listener + session-expiry effect will redirect.
   */
  const forceLogout = useCallback(() => {
    dispatch(logout());
    window.location.replace(ROUTES.signin);
  }, [dispatch]);

  /**
   * Handle logout errors
   */
  const handleLogoutError = useCallback(
    (error: Error | { status?: number; name?: string }) => {
      console.error("Logout error:", error);

      if (error?.name === "NetworkError") {
        toast.error(t("auth.logout.network-error"));
      } else if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        toast.error(t("auth.logout.token-invalid"));
      } else {
        toast.error(t("auth.logout.failed"));
      }
    },
    []
  );

  /**
   * Main logout function.
   * Calls the BFF logout route which clears all httpOnly cookies server-side,
   * then clears Redux state and performs a full-page redirect to signin.
   * window.location.replace (not router.replace) is intentional:
   * full reload clears bfcache so Back button cannot restore protected pages.
   */
  const performLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);

      const response = await AuthService.logout();

      if (response.success) {
        dispatch(logout());
        toast.success(t("auth.logout.logged-out"));
        window.location.replace(ROUTES.signin);
      } else {
        throw new Error(response.message || "Logout failed");
      }
    } catch (error) {
      handleLogoutError(error as Error | { status?: number; name?: string });
      forceLogout();
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, handleLogoutError, forceLogout]);

  return {
    logout: performLogout,
    forceLogout,
    isLoggingOut,
  };
};
