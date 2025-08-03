"use client";

import { PasswordChangeStatus } from "@components/auth/ChangePasswordStatus";
import { OTPInput } from "@components/auth/OTPInput";
import { PasswordRecovery } from "@components/auth/PasswordRecovery";
import { PasswordRecoveryForm } from "@components/auth/SetPassword";
import { Footer } from "@components/Footer";
import { Loader } from "@components/Loader";
import { resetPasswordRecoveryLocalStorage } from "@store/features/passwordRecoverySlice";
import { RootState } from "@store/store";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export default function PasswordRecoveryPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isLoading, isEmailSent, verificationCode, passwordChangeStatus } =
    useSelector((state: RootState) => state.passwordRecovery);

  useEffect(() => {
    if (passwordChangeStatus) dispatch(resetPasswordRecoveryLocalStorage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const isCodeValid =
    typeof verificationCode === "string" && verificationCode.length === 6;

  return (
    <section className="space-y-4 flex flex-col justify-center items-center h-full max-w-96 mx-auto">
      {isLoading && <Loader />}

      {!isLoading && passwordChangeStatus === null && !isEmailSent && (
        <div className="flex-grow flex flex-col justify-center items-center space-y-4">
          <PasswordRecovery />
        </div>
      )}

      {!isLoading &&
        passwordChangeStatus === null &&
        isEmailSent &&
        !isCodeValid && (
          <div className="flex-grow flex flex-col justify-center items-center space-y-4">
            <OTPInput />
          </div>
        )}

      {!isLoading &&
        passwordChangeStatus === null &&
        isEmailSent &&
        isCodeValid && (
          <div className="flex-grow flex flex-col justify-center items-center space-y-4">
            <h5 className="text-neutral-900 text-center font-sans font-bold text-2xl leading-8 tracking-tight ">
              {t("auth.set-new-password-title")}
            </h5>
            <p className="text-[var(--color-zinc-600)] text-sm text-center max-w-full">
              {t("auth.secure-account-message")}
            </p>
            <PasswordRecoveryForm />
          </div>
        )}

      {!isLoading && passwordChangeStatus !== null && <PasswordChangeStatus />}
      {!isLoading && passwordChangeStatus === null && <Footer />}
    </section>
  );
}
