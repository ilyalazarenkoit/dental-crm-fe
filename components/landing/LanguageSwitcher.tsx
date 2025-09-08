"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

type Language = {
  code: string;
  name: string;
  flag: string;
};

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available languages with their codes, names and flag images
  const languages: Language[] = [
    { code: "en", name: "English", flag: "/images/flags/gb.svg" },
    { code: "de", name: "Deutsch", flag: "/images/flags/de.svg" },
    { code: "ua", name: "Українська", flag: "/images/flags/ua.svg" },
  ];

  // Find current language
  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Handle language change
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    // Save the language preference to localStorage
    localStorage.setItem("preferredLanguage", langCode);
  };

  // Initialize language from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (
      savedLanguage &&
      languages.some((lang) => lang.code === savedLanguage)
    ) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Change language. Current language: ${currentLanguage.name}`}
      >
        <div className="w-5 h-5 relative overflow-hidden rounded-full">
          <Image
            src={currentLanguage.flag}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium hidden md:inline">
          {currentLanguage.code.toUpperCase()}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out z-50 ${
          isOpen
            ? "transform opacity-100 scale-100"
            : "transform opacity-0 scale-95 pointer-events-none"
        }`}
        role="listbox"
        aria-orientation="vertical"
        aria-labelledby="language-menu"
      >
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`flex items-center space-x-3 w-full text-left px-4 py-2 text-sm ${
                currentLanguage.code === language.code
                  ? "bg-gray-100 text-primary font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-primary"
              }`}
              onClick={() => changeLanguage(language.code)}
              role="option"
              aria-selected={currentLanguage.code === language.code}
            >
              <div className="w-5 h-5 relative overflow-hidden rounded-full">
                <Image
                  src={language.flag}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <span>{language.name}</span>
              {currentLanguage.code === language.code && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
