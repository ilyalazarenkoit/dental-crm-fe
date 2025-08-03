import { TFunction } from "i18next";

/**
 * Типы ошибок API
 */
export type ApiError = {
  code?: string;
  message?: string;
  details?: {
    message?: string;
    error?: string;
    statusCode?: number;
  };
};

/**
 * Типы ответа API
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: ApiError;
  data?: T;
  meta?: Record<string, unknown>;
};

/**
 * Get localized error message based on API error code
 * @param error API error object
 * @param t i18next translation function
 * @param namespace Error messages namespace (default "register.errors")
 * @returns Localized error message
 */
export function getLocalizedErrorMessage(
  error: ApiError | undefined,
  t: TFunction,
  namespace = "register.errors"
): string {
  if (!error) {
    return t(`${namespace}.default`);
  }

  // Check for error code
  if (error.code) {
    // Try to find localized message by error code
    const localizedMessage = t(`${namespace}.${error.code}`, {
      defaultValue: "",
    });
    if (localizedMessage) {
      return localizedMessage;
    }
  }

  // If no error code or localized message for code,
  // check for message in error object
  if (error.message) {
    return error.message;
  }

  // Check for message in error details
  if (error.details?.message) {
    return error.details.message;
  }

  // If nothing found, return default message
  return t(`${namespace}.default`);
}

/**
 * Handle API response and return localized error message if available
 * @param response API response
 * @param t i18next translation function
 * @param namespace Error messages namespace (default "register.errors")
 * @returns Localized error message or null if no error
 */
export function handleApiResponse<T>(
  response: ApiResponse<T>,
  t: TFunction,
  namespace = "register.errors"
): { success: boolean; message: string | null; data?: T } {
  if (response.success) {
    return {
      success: true,
      message: response.message || null,
      data: response.data,
    };
  }

  return {
    success: false,
    message: getLocalizedErrorMessage(response.error, t, namespace),
  };
}

/**
 * Handle fetch errors and return standardized API response object
 * @param error Error object
 * @param t i18next translation function
 * @returns Standardized API response object with error information
 */
export function handleFetchError(error: unknown, t: TFunction): ApiResponse {
  console.error("API request failed:", error);

  return {
    success: false,
    message: t("auth.errors.server-error"),
    error: {
      code: "E500_INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : String(error),
    },
  };
}

/**
 * Execute API request with error handling
 * @param url API URL
 * @param options Fetch options
 * @returns Promise with request result
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return data as ApiResponse<T>;
  } catch (error) {
    // Here we don't use t, as it will be handled later
    return {
      success: false,
      error: {
        code: "E500_INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
