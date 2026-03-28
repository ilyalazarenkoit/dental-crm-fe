"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@constants/routes";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const LandingHeader = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md py-3"
          : "bg-transparent py-3"
      }`}
      role="banner"
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 group"
          aria-label="DentalCRM Home"
        >
          <div className="relative overflow-hidden">
            <Image
              src="/images/logo_landing.svg"
              alt=""
              width={300}
              height={40}
              className={`w-auto transition-transform duration-300 `}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-8"
          aria-label="Main Navigation"
        >
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            {t("nav.features", "Features")}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            {t("nav.pricing", "Pricing")}
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            {t("nav.testimonials", "Testimonials")}
          </Link>
          <div className="h-4 w-px bg-gray-300"></div>
          <LanguageSwitcher />
          <div className="h-4 w-px bg-gray-300"></div>
          <Link
            href={ROUTES.signin}
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            {t("auth.signin")}
          </Link>
          <Link
            href={ROUTES.register}
            className={`px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all transform hover:scale-105 ${
              isScrolled
                ? "bg-primary hover:bg-primary/90 shadow-sm"
                : "bg-primary/90 hover:bg-primary shadow-md"
            }`}
          >
            {t("auth.signup")}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="sr-only">
            {isMenuOpen ? "Close menu" : "Open menu"}
          </span>
          {!isMenuOpen ? (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="container mx-auto px-6 pt-2 pb-4 space-y-1 bg-white shadow-lg rounded-b-lg">
          <Link
            href="#features"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.features", "Features")}
          </Link>
          <Link
            href="#pricing"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.pricing", "Pricing")}
          </Link>
          <Link
            href="#testimonials"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.testimonials", "Testimonials")}
          </Link>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="px-4 py-2">
            <LanguageSwitcher />
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <Link
            href={ROUTES.signin}
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("auth.signin")}
          </Link>
          <Link
            href={ROUTES.register}
            className="block px-4 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-md text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("auth.signup")}
          </Link>
        </div>
      </div>
    </header>
  );
};
