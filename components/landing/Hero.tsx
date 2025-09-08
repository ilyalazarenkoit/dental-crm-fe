"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ROUTES } from "@constants/routes";
import Image from "next/image";

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section
      className="container mx-auto px-6 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20 flex flex-col lg:flex-row items-center gap-5 lg:gap-8"
      aria-labelledby="hero-heading"
    >
      <motion.div
        className="lg:w-1/2 mb-8 lg:mb-0 max-w-2xl mx-auto lg:mx-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6"
        >
          {t("landing.hero-title", "The Future of Dental Practice Management")}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
          {t(
            "landing.hero-subtitle",
            "Automate repetitive tasks. Protect patient data. Empower your team with AI. A next-generation CRM system designed specifically for modern dental clinics."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link
            href={ROUTES.register}
            className="px-8 py-4 rounded-lg bg-primary text-white text-center font-medium hover:bg-primary/90 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
            aria-label={t("landing.get-started", "Get Started")}
          >
            <span>{t("landing.get-started", "Get Started")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link
            href={ROUTES.signin}
            className="px-8 py-4 rounded-lg border-2 border-gray-300 text-gray-700 text-center font-medium hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center"
            aria-label={t("landing.login", "Log In")}
          >
            <span>{t("landing.login", "Log In")}</span>
          </Link>
        </div>
        <div className="mt-8 flex items-center text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{t("landing.no-credit-card", "No credit card required")}</span>
          <span className="mx-3">•</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{t("landing.free-trial", "14-day free trial")}</span>
        </div>
      </motion.div>
      <motion.div
        className="lg:w-1/2 h-auto lg:h-[66vh] relative rounded-xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10 pointer-events-none"></div>
        <Image
          src="/images/main.jpg"
          alt="Dental CRM Dashboard Interface"
          width={600}
          height={400}
          className="w-full h-full rounded-lg object-cover"
          priority
        />
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-20 hidden md:block">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t(
                  "landing.trusted-by",
                  "Trusted by 500+ dental clinics worldwide"
                )}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
