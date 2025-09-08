import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/store";
import { logout } from "@/lib/store/features/authSlice";
import { AuthService } from "@/lib/api/auth.service";
import { toast } from "@/hooks/use-toast";
import { t } from "i18next";

/**
 * Hook for handling user logout
 * Provides logout functionality with proper cleanup and error handling
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Clear all authentication data from storage
   */
  const clearAuthData = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");

    // Clear sessionStorage
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole");

    // Clear cookies
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear any other auth-related data
    sessionStorage.clear();
  }, []);

  /**
   * Force logout when API fails but we need to clear local state
   */
  const forceLogout = useCallback(() => {
    clearAuthData();
    dispatch(logout());
    // Don't redirect here - let the main logout function handle it
  }, [clearAuthData, dispatch]);

  /**
   * Handle logout errors
   */
  const handleLogoutError = useCallback(
    (error: Error | { status?: number; name?: string }) => {
      console.error("Logout error:", error);

      if (error?.name === "NetworkError") {
        toast({
          title: t("common.error"),
          description: t("auth.logout.network-error"),
          variant: "destructive",
        });
      } else if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        // Token already invalid, force cleanup
        toast({
          title: t("common.error"),
          description: t("auth.logout.token-invalid"),
          variant: "destructive",
        });
        forceLogout();
      } else {
        toast({
          title: t("common.error"),
          description: t("auth.logout.failed"),
          variant: "destructive",
        });
      }
    },
    [forceLogout]
  );

  /**
   * Main logout function
   */
  const performLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);

      // Show loading state
      toast({
        title: t("auth.logout.logging-out"),
        description: t("auth.logout.please-wait"),
      });

      // Call logout API
      const response = await AuthService.logout();

      if (response.success) {
        // Clear all authentication data
        clearAuthData();

        // Update Redux state
        dispatch(logout());

        // Show success message
        toast({
          title: t("auth.logout.success"),
          description: t("auth.logout.logged-out"),
        });

        // Redirect to login page using router
        router.push("/signin");
      } else {
        throw new Error(response.message || "Logout failed");
      }
    } catch (error) {
      handleLogoutError(error as Error | { status?: number; name?: string });

      // Even if API fails, force logout to clear local state
      forceLogout();

      // Always redirect to signin page, even on error
      router.push("/signin");
    } finally {
      setIsLoggingOut(false);
    }
  }, [clearAuthData, dispatch, router, handleLogoutError, forceLogout]);

  return {
    logout: performLogout,
    forceLogout,
    clearAuthData,
    isLoggingOut,
  };
};
