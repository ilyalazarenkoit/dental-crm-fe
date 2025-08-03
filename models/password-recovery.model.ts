export interface PasswordResetRequest {
  mail: string;
  newPassword: string;
  resetCode: string;
}

export interface PasswordRecoveryState {
  email: string | null;
  isEmailSent: boolean;
  isLoading: boolean;
  error: string | null;
  verificationCode: string;
  passwordChangeStatus: "success" | "failed" | null;
  passwordChangeError: string | null;
  timestamp: number | null;
}
export interface SendEmailPayload {
  email: string;
  timestamp: number;
}

export interface PassResetResponse {
  error: boolean;
  message: string;
}

export interface SendCodeRequest {
  mail: string;
}
