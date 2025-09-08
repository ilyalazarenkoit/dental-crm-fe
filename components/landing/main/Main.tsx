"use client";

import { useTranslation } from "react-i18next";
import { ROUTES } from "@constants/routes";
import Link from "next/link";
import { KeyValue } from "./KeyValue";
import { Features } from "./Features";
import { DataProtection } from "./DataProtection";
import { AIAssistant } from "./AIAssistant";

export const Main = () => {
  const { t } = useTranslation();
  return (
    <>
      <AIAssistant />
      <KeyValue />

      <Features />

      <DataProtection />

      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t("landing.cta-title", "Ready to Transform Your Dental Practice?")}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t(
              "landing.cta-subtitle",
              "Join thousands of dental professionals who have streamlined their practice management with DentalCRM."
            )}
          </p>
          <Link
            href={ROUTES.register}
            className="px-8 py-3 bg-white text-primary rounded-md font-medium hover:bg-gray-100 transition inline-block"
          >
            {t("landing.start-free-trial", "Start Your Free Trial")}
          </Link>
        </div>
      </section>
    </>
  );
};
