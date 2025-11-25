const API_URLS = {
  development: "http://localhost:3000",
  test: "https://test-api.dentalcrm.com/api",
  staging: "https://staging-api.dentalcrm.com/api",
  production: "https://api.dentalcrm.com/api",
};

export const getEnvironment = ():
  | "development"
  | "test"
  | "staging"
  | "production" => {
  const env = process.env.NODE_ENV || "development";
  const apiEnv = process.env.NEXT_PUBLIC_API_ENV;

  if (env === "production") {
    if (apiEnv === "staging") return "staging";
    if (apiEnv === "test") return "test";
    return "production";
  }

  return "development";
};

export const getApiBaseUrl = (): string => {
  const environment = getEnvironment();
  return API_URLS[environment];
};

export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
};

export const getApiUrl = (endpoint: string): string => {
  return `${getApiBaseUrl()}${endpoint}`;
};
