"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Warning } from "@phosphor-icons/react";
import { ROUTES } from "@/constants/routes";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [errorCode, setErrorCode] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorCode("E400_INVALID_TOKEN");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorCode(data.error?.code || "E500_SERVER_ERROR");
        }
      } catch (error) {
        setStatus("error");
        setErrorCode("E500_SERVER_ERROR");
        console.error("Error verifying email:", error);
      }
    };

    verifyEmail();
  }, [token, t]);

  // Function to get localized error message
  const getErrorMessage = () => {
    // Check for translation for specific error code
    const specificErrorKey = `auth.email-verification.errors.${errorCode}`;

    const specificErrorMessage = t(specificErrorKey, {
      defaultValue: "",
    });

    if (specificErrorMessage) {
      return specificErrorMessage;
    }

    // If no translation for specific code, use general messages
    switch (errorCode) {
      case "E400_INVALID_TOKEN":
        return t("auth.email-verification.invalid-token");
      case "E401_EXPIRED_TOKEN":
        return t("auth.email-verification.expired-token");
      default:
        return t("auth.email-verification.general-error");
    }
  };

  // Animation variants for different states
  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-muted/40">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center font-bold text-xl">
            {t("auth.email-verification.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              className="flex flex-col items-center justify-center space-y-4 p-6"
            >
              <div className="h-12 w-12 rounded-full border-4 border-t-primary animate-spin" />
              <p className="text-center text-muted-foreground">
                {t("auth.email-verification.verifying")}
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              className="flex flex-col items-center space-y-6 p-6"
            >
              <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
                <CheckCircle
                  size={32}
                  weight="fill"
                  className="text-green-600"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium text-lg text-green-700">
                  {t("auth.email-verification.success")}
                </p>
                <p className="text-muted-foreground">
                  {t("auth.email-verification.success-message")}
                </p>
              </div>
              <Button
                onClick={() => router.push(ROUTES.signin)}
                className="w-full"
              >
                {t("auth.email-verification.sign-in")}
              </Button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              className="flex flex-col items-center space-y-6 p-6"
            >
              <div className="rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center">
                <Warning size={32} weight="fill" className="text-red-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium text-lg text-red-700">
                  {t("auth.email-verification.error")}
                </p>
                <p className="text-muted-foreground">{getErrorMessage()}</p>
              </div>
              <div className="w-full space-y-2 flex flex-col gap-2">
                <Button
                  onClick={() => router.push(ROUTES.signin)}
                  className="w-full"
                >
                  {t("auth.email-verification.go-to-sign-in")}
                </Button>
                <Link href={ROUTES.resendVerification}>
                  <Button variant="outline" className="w-full">
                    {t("auth.email-verification.resend-verification")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
