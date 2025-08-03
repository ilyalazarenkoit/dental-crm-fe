/**
 * Represents the state for the set password functionality
 */

export interface SetPasswordState {
  /** Indicates if a password set operation is in progress */
  isLoading: boolean;
  /** Error message if password set operation fails, null otherwise */
  error: string | null;
  /** Indicates if the password was successfully set */
  setPasswordSuccess: boolean;

  /** Status for rendering  */
  setPasswordStatus: "success" | "failed" | null;
  setPasswordError: string | null;
}

/**
 * Represents the response structure from token validation
 */
export interface TokenResponse {
  /** Unique identifier for the token */
  id: string;
  /** Modification date timestamp */
  md: number;
  /** User-related data */
  users: {
    /** Frontend token answer for validation */
    fe_token_answer: string;
  };
}

/**
 * Interface defining the token state structure
 */
export interface TokenState {
  /** The password reset token */
  resetToken: string | null;
  /** The user's ID */
  userId: string | null;
  /** Timestamp when the token expires */
  expiry: number | null;
  /** SPF value */
  spf: string;
  /** Mail value */
  mail: string;
}

/**
 * Interface for token payload data
 */
export interface TokenPayload {
  /** The password reset token */
  token: string;
  /** The user's ID */
  id: string;
  /** Timestamp when the token expires */
  expiry: number;
  /** SPF value */
  spf: string;
  /** Mail value */
  mail: string;
}
