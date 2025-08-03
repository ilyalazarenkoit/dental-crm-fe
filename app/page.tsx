"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@store/features/authSlice";
import { ROUTES } from "@constants/routes";

export default function LandingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [mounted, setMounted] = useState(false);

  // Handle authentication state
  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      router.push(ROUTES.home);
    }
  }, [isAuthenticated, router]);

  // Don't render anything until client-side hydration is complete
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.svg"
            alt="DentalCRM Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-2xl font-bold text-primary">DentalCRM</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={ROUTES.signin}
            className="text-sm font-medium text-gray-600 hover:text-primary transition"
          >
            {t("auth.signin")}
          </Link>
          <Link
            href={ROUTES.register}
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition"
          >
            {t("auth.signup")}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center">
        <motion.div
          className="lg:w-1/2 mb-10 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {t("landing.hero-title", "Modern Dental Practice Management")}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t(
              "landing.hero-subtitle",
              "Streamline your dental practice with our all-in-one CRM solution designed specifically for dental professionals."
            )}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href={ROUTES.register}
              className="px-8 py-3 rounded-md bg-primary text-white text-center font-medium hover:bg-primary/90 transition"
            >
              {t("landing.get-started", "Get Started")}
            </Link>
            <Link
              href={ROUTES.signin}
              className="px-8 py-3 rounded-md border border-gray-300 text-gray-700 text-center font-medium hover:bg-gray-50 transition"
            >
              {t("landing.login", "Log In")}
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            src="/images/hero-image.svg"
            alt="Dental CRM Dashboard"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t(
                "landing.features-title",
                "Features Designed for Dental Practices"
              )}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t(
                "landing.features-subtitle",
                "Everything you need to manage your practice efficiently in one place."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t("landing.feature1-title", "Patient Management"),
                description: t(
                  "landing.feature1-desc",
                  "Easily manage patient records, history, and appointments in one place."
                ),
                icon: "👥",
              },
              {
                title: t("landing.feature2-title", "Appointment Scheduling"),
                description: t(
                  "landing.feature2-desc",
                  "Intuitive calendar interface for scheduling and managing appointments."
                ),
                icon: "📅",
              },
              {
                title: t("landing.feature3-title", "Treatment Plans"),
                description: t(
                  "landing.feature3-desc",
                  "Create and track detailed treatment plans for each patient."
                ),
                icon: "🦷",
              },
              {
                title: t("landing.feature4-title", "Billing & Invoicing"),
                description: t(
                  "landing.feature4-desc",
                  "Generate invoices and manage payments with ease."
                ),
                icon: "💰",
              },
              {
                title: t("landing.feature5-title", "Analytics & Reports"),
                description: t(
                  "landing.feature5-desc",
                  "Gain insights into your practice with detailed analytics and reports."
                ),
                icon: "📊",
              },
              {
                title: t("landing.feature6-title", "Patient Communications"),
                description: t(
                  "landing.feature6-desc",
                  "Automated reminders and communications to reduce no-shows."
                ),
                icon: "✉️",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{t("footer.product")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.features")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.pricing")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.testimonials")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t("footer.company")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.careers")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">
                {t("footer.resources")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.help-center")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.documentation")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.terms")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.cookie-policy")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} DentalCRM.{" "}
              {t("footer.all-rights-reserved")}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
