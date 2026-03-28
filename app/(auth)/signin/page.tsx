"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";

import { ROUTES } from "@constants/routes";
import { RegisterPresentation } from "@components/auth/register/RegisterPresentation";
import { LoginForm } from "@components/auth/LoginForm";

import { motion } from "framer-motion";

export default function SignIn() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  // Validate callbackUrl to prevent open redirect attacks.
  // Only allow relative paths (start with /) — never external URLs.
  const rawCallback = searchParams.get("callbackUrl") ?? "";
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : ROUTES.home;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - presentation */}
      <RegisterPresentation />

      {/* Right side - Form */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 min-h-screen md:min-h-0 md:flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="w-full max-w-md">
          <h1 className="text-3xl text-center font-bold mb-4">
            {t("auth.signin")}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 py-4 sm:p-8 sm:py-6">
            <LoginForm callbackUrl={callbackUrl} />

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                {t("auth.forgot-password-question")}{" "}
                <Link
                  href={ROUTES.recovery}
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  {t("auth.reset-password")}
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                {t("auth.dont-have-account", "Don't have an account?")}{" "}
                <Link
                  href={ROUTES.register}
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  {t("auth.signup")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
