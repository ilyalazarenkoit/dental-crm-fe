import axios, { AxiosError, AxiosInstance } from "axios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@store/store";
import { LoginResponse } from "@models/auth.model";
import {
  PasswordResetRequest,
  PassResetResponse,
  SendCodeRequest,
} from "@models/password-recovery.model";

/**
 * Axios instance for auth routes (no token required)
 */
const authService: AxiosInstance = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * RTK Query API slice with separate handling for auth and secured requests
 */
export const ninoxAuthService = createApi({
  reducerPath: "ninoxAuth",
  tagTypes: ["Auth", "User"],
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/data/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Login via authService (no token needed)
    login: builder.mutation<LoginResponse, { mail: string; password: string }>({
      queryFn: async (credentials) => {
        try {
          const response = await authService.post(
            "/?path=auth/login",
            credentials
          );
          return { data: response.data };
        } catch (error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          return {
            error: {
              status: axiosError.response?.status || 500,
              data: axiosError.response?.data || {
                message: axiosError.message,
              },
            },
          };
        }
      },
    }),
    // Reset password via authService (no token needed)
    resetPasswordCode: builder.mutation<PassResetResponse, SendCodeRequest>({
      queryFn: async ({ mail }) => {
        try {
          const response = await authService.post("/?path=auth/resetPassword", {
            mail,
          });
          if (response.data.error) {
            const localisationForErrorMessage = response.data.message.replace(
              / /g,
              "-"
            );
            response.data.message = localisationForErrorMessage.toLowerCase();
          }
          return { data: response.data };
        } catch (error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          return {
            error: {
              status: axiosError.response?.status || 500,
              data: axiosError.response?.data || {
                message: axiosError.message,
              },
            },
          };
        }
      },
    }),
    // Password reset with validation (secured endpoint)
    passwordReset2: builder.mutation<PassResetResponse, PasswordResetRequest>({
      queryFn: async (credentials) => {
        try {
          const response = await authService.post(
            "/?path=auth/resetPassword2",
            credentials
          );

          if (response.data.error) {
            const localisationForErrorMessage = response.data.message.replace(
              / /g,
              "-"
            );
            response.data.message = localisationForErrorMessage.toLowerCase();
          }
          return { data: response.data };
        } catch (error) {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          return {
            error: {
              status: axiosError.response?.status || 500,
              data: axiosError.response?.data || {
                message: axiosError.message,
              },
            },
          };
        }
      },
    }),
  }),
});

/**
 * Export hooks for RTK Query endpoints
 */
export const {
  useLoginMutation,
  useResetPasswordCodeMutation,
  usePasswordReset2Mutation,
} = ninoxAuthService;

/**
 * Export API selector for state access
 */
export const selectNinoxApi = (state: RootState) =>
  state[ninoxAuthService.reducerPath];

/**
 * Interface for API error responses
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
