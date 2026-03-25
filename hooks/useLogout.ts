import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Force logout: clears Redux state without waiting for the API.
   * Used when the API call fails but we still need to clean up locally.
   * providers.tsx will detect isAuthenticated=false and redirect to /signin.
   */
  const forceLogout = useCallback(() => {
    dispatch(logout());
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
   * then clears Redux state and redirects to signin.
   */
  const performLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);

      const response = await AuthService.logout();

      if (response.success) {
        dispatch(logout());
        toast.success(t("auth.logout.logged-out"));
        router.replace(ROUTES.signin);
      } else {
        throw new Error(response.message || "Logout failed");
      }
    } catch (error) {
      handleLogoutError(error as Error | { status?: number; name?: string });
      // Even if API fails, clear local state and redirect
      forceLogout();
      router.replace(ROUTES.signin);
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, router, handleLogoutError, forceLogout]);

  return {
    logout: performLogout,
    forceLogout,
    isLoggingOut,
  };
};
