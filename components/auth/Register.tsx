import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { RegisterPresentation } from "@components/auth/register/RegisterPresentation";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Register = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // md в Tailwind обычно начинается с 768px
      setIsMobile(window.innerWidth < 768);
    };

    // Начальная проверка
    handleResize();

    // Добавляем слушатель изменения размера окна
    window.addEventListener("resize", handleResize);

    // Очистка слушателя
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - presentation */}
      <RegisterPresentation />
      {/* Right side - Form */}
      <motion.div
        className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="w-full max-w-md">
          {isMobile && (
            <div className="mb-6">
              <Image
                src="/images/logo_registration_mob.svg"
                alt="DentalCRM Logo"
                className="w-full h-auto"
                width={270}
                height={40}
                priority
              />
            </div>
          )}
          <h1 className="text-3xl text-center font-bold mb-4">
            {t("register.register-title")}
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 py-4 sm:p-8 sm:py-6">
            <RegisterForm />
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                {t("register.by-registering")}{" "}
                <Link
                  href="#"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  {t("register.terms")}
                </Link>{" "}
                {t("register.and")}{" "}
                <Link
                  href="#"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  {t("register.privacy-policy")}
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                {t("register.already-have-account")}{" "}
                <Link
                  href={ROUTES.signin}
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  {t("auth.signin")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
