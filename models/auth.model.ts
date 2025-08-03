import { AuthError } from "@models/error.model";
import z from "zod";
/**
 * Interface for the authentication state in Redux store
 */
export interface AuthState {
  /** ID of the authenticated user */
  userId: string | null;
  /** JWT token for authentication */
  token: string | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Current error state, if any */
  error: AuthError | null;
  /** Timestamp of last successful login */
  lastLogin: string | null;
  /** Timestamp when the current session expires */
  sessionExpiry: string | null;
  /** Number of failed login attempts */
  loginAttempts: number;
  /** Checkbox state for remember me */
  rememberMe: boolean;
}

/**
 * Interface for login response from the API
 */
export interface LoginResponse {
  /** JWT token for authentication */
  jwt: string;
  /** User ID of the authenticated user */
  user_id: string;
}

/**
 * Interface for JWT payload structure
 */
export interface JWTPayload {
  /** Token expiration timestamp */
  exp: number;
  /** Token issuer */
  iss: string;
  /** User roles array */
  roles: string[] | null;
  /** User ID from token */
  userId: string;
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
