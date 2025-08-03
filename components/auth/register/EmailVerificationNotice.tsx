"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Envelope, CheckCircle, SpinnerGap } from "phosphor-react";
import { AuthService } from "@lib/api/auth.service";
import { toast } from "keep-react";

interface EmailVerificationNoticeProps {
  email: string;
  onClose?: () => void;
}

export const EmailVerificationNotice: React.FC<
  EmailVerificationNoticeProps
> = ({ email, onClose }) => {
  const { t } = useTranslation();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendEmail = async () => {
    if (isResending) return;

    setIsResending(true);
    try {
      const response = await AuthService.resendVerificationEmail(email);

      if (response.success) {
        setResendSuccess(true);
        toast.success(
          t(
            "auth.verification-email-resent",
            "Verification email has been resent."
          )
        );

        // Сбросить статус успеха через 5 секунд
        setTimeout(() => {
          setResendSuccess(false);
        }, 5000);
      } else {
        toast.error(
          response.message ||
            t(
              "auth.verification-email-failed",
              "Failed to resend verification email."
            )
        );
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast.error(
        t(
          "auth.verification-email-failed",
          "Failed to resend verification email."
        )
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4 p-3 bg-primary/10 rounded-full"
        >
          <Envelope size={48} weight="duotone" className="text-primary" />
        </motion.div>

        <h2 className="text-xl font-bold mb-2">
          {t("auth.verification-title", "Check Your Email")}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t(
            "auth.verification-message",
            "We've sent a verification link to {{email}}. Please check your inbox and click the link to verify your account.",
            { email }
          )}
        </p>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t(
            "auth.verification-spam-notice",
            "If you don't see the email, please check your spam folder."
          )}
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            disabled={isResending || resendSuccess}
          >
            {isResending ? (
              <>
                <SpinnerGap className="h-4 w-4 animate-spin" />
                {t("auth.resending", "Resending...")}
              </>
            ) : resendSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                {t("auth.resent", "Email Resent")}
              </>
            ) : (
              <>
                <Envelope className="h-4 w-4" />
                {t("auth.resend-email", "Resend Email")}
              </>
            )}
          </Button>

          {onClose && (
            <Button
              onClick={onClose}
              variant="default"
              className="w-full sm:w-auto"
            >
              {t("common.continue", "Continue")}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
