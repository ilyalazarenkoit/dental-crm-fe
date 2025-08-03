"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { selectIsAuthenticated } from "@store/features/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { resetPasswordRecoveryLocalStorage } from "@store/features/passwordRecoverySlice";
import { ROUTES } from "@constants/routes";
import { BrandIdentity } from "@components/auth/BrandIdentity";
import { LoginForm } from "@components/auth/LoginForm";

export default function SignIn() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  // Get the callback URL from the search params (for redirection after login)
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.home;

  useEffect(() => {
    if (isAuthenticated) {
      // If user is already authenticated, redirect to the callback URL or dashboard
      router.push(decodeURI(callbackUrl));
    }

    // Reset password recovery state when visiting signin page
    dispatch(resetPasswordRecoveryLocalStorage());
  }, [isAuthenticated, router, dispatch, callbackUrl]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        <BrandIdentity />

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 space-y-2 text-center">
            <h1 className="text-2xl font-bold">{t("auth.signin")}</h1>
            <p className="text-muted-foreground">
              {t("auth.signin-description")}
            </p>
          </div>

          <LoginForm callbackUrl={callbackUrl} />

          <div className="mt-6 text-center text-sm">
            <p>
              {t("auth.forgot-password-question")}{" "}
              <Link
                href={ROUTES.recovery}
                className="font-medium text-primary hover:underline"
              >
                {t("auth.reset-password")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
