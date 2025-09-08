import { AuthError } from "@models/error.model";
import z from "zod";
/**
 * Interface for the authentication state in Redux store
 * Updated for secure architecture: access token in Redux memory, refresh token in HttpOnly cookies
 */
export interface AuthState {
  /** ID of the authenticated user */
  userId: string | null;
  /** Access token for API requests (stored in Redux memory, not cookies) */
  accessToken: string | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Current error state, if any */
  error: AuthError | null;
  /** Timestamp of last successful login */
  lastLogin: string | null;
  /** Number of failed login attempts */
  loginAttempts: number;
  /** Whether token refresh is in progress */
  isRefreshing: boolean;
  /** User information */
  user: {
    /** User ID */
    userId: string;
    /** User email */
    email: string;
    /** First name */
    firstName: string;
    /** Last name */
    lastName: string;
    /** Organization ID */
    organizationId: string;
    /** User role */
    role: string;
  } | null;
}

/**
 * Interface for login response from the API
 * Updated for secure architecture: refresh token only in HttpOnly cookies
 */
export interface LoginResponse {
  /** Access token for authentication (15 min lifetime) */
  accessToken: string;
  /** Success status */
  success: boolean;
  /** Response message */
  message: string;
  /** User information */
  user: {
    /** User ID */
    userId: string;
    /** User email */
    email: string;
    /** First name */
    firstName: string;
    /** Last name */
    lastName: string;
    /** Organization ID */
    organizationId: string;
    /** User role */
    role: string;
  };
  /** Error information (optional) */
  error?: {
    code?: string;
    message?: string;
  };
}

/**
 * Interface for JWT payload structure
 * Updated for new backend JWT format
 * Based on RFC 7519 and OWASP JWT Security Cheat Sheet
 */
export interface JWTPayload {
  /** User ID (subject) - required */
  sub: string;
  /** JWT ID for blacklisting - required */
  jti: string;
  /** Token issuer - required */
  iss: string;
  /** Token audience - required */
  aud: string;
  /** Security fingerprint - required */
  fingerprint: string;
  /** Token issued at timestamp - required */
  iat: number;
  /** Token expiration timestamp - required */
  exp: number;
  /** Token not valid before timestamp - required */
  nbf: number;
  /** Token type (for refresh tokens) - optional */
  type?: "refresh";
}

/**
 * Interface for refresh token response from the API
 * Updated for secure architecture: refresh token only in HttpOnly cookies with rotation
 */
export interface RefreshResponse {
  /** New access token (15 min lifetime) */
  accessToken: string;
  /** User information */
  user: {
    /** User ID */
    userId: string;
    /** User email */
    email: string;
    /** First name */
    firstName: string;
    /** Last name */
    lastName: string;
    /** Organization ID */
    organizationId: string;
    /** User role */
    role: string;
  };
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobilePhone: string;
  organizationName: string;
}

export const defaultRegistrationValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  mobilePhone: "",
  organizationName: "",
};

export const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    mobilePhone: z
      .string()
      .regex(
        /^(\+[0-9]{1,3})?[-\s\.]?[0-9]{3,}[-\s\.]?[0-9]{3,}[-\s\.]?[0-9]{0,}$/,
        {
          message: "Mobile phone must be a valid phone number",
        }
      ),
    organizationName: z.string().min(1, {
      message: "Organization name is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
