import { RegisterFormValues } from "@/models/auth.model";
import { ApiResponse } from "@/lib/error-handler";

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
 * AuthService
 */
export const AuthService = {
  /**
   * Register new user
   * @param userData User data
   * @returns Api response
   */
  register: async (
    userData: Omit<RegisterFormValues, "confirmPassword">
  ): Promise<RegisterResponse> => {
    try {
      console.log("SERVICE", userData);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("DATA", data);

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
   * Повторная отправка письма для верификации email
   * @param email Email пользователя
   * @returns Ответ от API
   */
  resendVerificationEmail: async (
    email: string
  ): Promise<ResendVerificationResponse> => {
    try {
      // Используем локальный API роут Next.js вместо прямого запроса к бэкенду
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Обрабатываем ответ
      const data = await response.json();

      // Возвращаем полный ответ, включая структуру ошибки, если она есть
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
