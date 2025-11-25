import { RegisterFormValues, LoginResponse } from "@/models/auth.model";
import { ApiResponse } from "@/lib/error-handler";
import { httpClient } from "@/lib/api/http-client";

/**
 * RegisterResponse
 */
export interface RegisterResponse extends ApiResponse {
  userId?: string;
  emailVerificationToken?: string;
}

/**
 * ResendVerificationResponse
 */
export type ResendVerificationResponse = ApiResponse;

/**
 * LoginRequest
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * AuthService
 */
export const AuthService = {
  /**
   * Login user
   * @param credentials User credentials
   * @returns Api response with access token and user data
   */
  login: async (
    credentials: LoginRequest
  ): Promise<LoginResponse | ApiResponse> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Include cookies for refresh token storage
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed",
          error: data.error || {
            code: `E${response.status}_LOGIN_FAILED`,
            message: data.message || "Login failed",
          },
        };
      }

      // Set access token in HTTP client memory
      if (data.accessToken) {
        httpClient.setAccessToken(data.accessToken);
      }

      return {
        success: true,
        message: data.message || "Login successful",
        accessToken: data.accessToken,
        user: data.user,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Login failed. Please try again.",
        error: {
          code: "E500_INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  },

  /**
   * Logout user
   * @returns Api response
   */
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await httpClient.request("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Logout failed",
          error: data.error || {
            code: `E${response.status}_LOGOUT_FAILED`,
            message: data.message || "Logout failed",
          },
        };
      }

      // Clear access token from HTTP client memory
      httpClient.clearAccessToken();

      return {
        success: true,
        message: data.message || "Logout successful",
      };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        message: "Logout failed. Please try again.",
        error: {
          code: "E500_INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  },

  /**
   * Refresh access token using refresh token
   * @returns Api response with new access token
   */
  refreshToken: async (): Promise<LoginResponse | ApiResponse> => {
    try {
      const response = await httpClient.request("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Token refresh failed",
          error: data.error || {
            code: `E${response.status}_REFRESH_FAILED`,
            message: data.message || "Token refresh failed",
          },
        };
      }

      // Update access token in HTTP client memory
      if (data.accessToken) {
        httpClient.setAccessToken(data.accessToken);
      }

      return {
        success: true,
        message: data.message || "Token refreshed successfully",
        accessToken: data.accessToken,
        user: data.user,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return {
        success: false,
        message: "Token refresh failed. Please login again.",
        error: {
          code: "E500_INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  },

  /**
   * Register new user
   * @param userData User data
   * @returns Api response
   */
  register: async (
    userData: Omit<RegisterFormValues, "confirmPassword">
  ): Promise<RegisterResponse> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      // Return full response, including erro r structure if it exists
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.",
        error: {
          code: "E500_INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  },

  /**
   * Resend verification email
   * @param email User email
   * @returns API response
   */
  resendVerificationEmail: async (
    email: string
  ): Promise<ResendVerificationResponse> => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Resend verification error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to resend verification email. Please try again.",
        error: {
          code: "E500_INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  },
};
