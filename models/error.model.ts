/**
 * Base interface for API errors
 */
export interface ApiError {
  /** Unique error code for identification */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
  /** Timestamp when the error occurred */
  timestamp: string;
}

/**
 * Specific error interface for authentication related errors
 */
export interface AuthError extends ApiError {
  /** Specific reason for authentication failure */
  authFailureReason?:
    | "invalid_credentials"
    | "expired_token"
    | "invalid_token"
    | "user_id_mismatch"
    | "invalid_fingerprint"
    | "invalid_refresh_token";
}
