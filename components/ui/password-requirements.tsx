"use client";

import { Check, X } from "phosphor-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordRequirementsProps {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  strength: "weak" | "medium" | "strong";
  className?: string;
}

export function PasswordRequirements({
  hasMinLength,
  hasUppercase,
  hasNumber,
  hasSpecialChar,
  strength,
  className,
}: PasswordRequirementsProps) {
  const { t } = useTranslation();

  // Define colors for strength indicator
  const strengthColors = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  // Calculate how many segments to fill based on strength
  const getFilledSegments = () => {
    switch (strength) {
      case "weak":
        return 1;
      case "medium":
        return 2;
      case "strong":
        return 3;
      default:
        return 0;
    }
  };

  const filledSegments = getFilledSegments();

  return (
    <AnimatePresence>
      <motion.div
        className={cn("text-sm space-y-3", className)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {/* Password strength meter */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            {t("password.strength", "Password strength")}:{" "}
            <span
              className={cn(
                "font-medium",
                strength === "weak" && "text-red-500",
                strength === "medium" && "text-yellow-500",
                strength === "strong" && "text-green-500"
              )}
            >
              {t(`password.strength.${strength}`, strength)}
            </span>
          </div>
          <div className="flex gap-1 h-1">
            <div
              className={cn(
                "w-1/3 rounded-sm transition-colors",
                filledSegments >= 1 ? strengthColors[strength] : "bg-gray-200"
              )}
            />
            <div
              className={cn(
                "w-1/3 rounded-sm transition-colors",
                filledSegments >= 2 ? strengthColors[strength] : "bg-gray-200"
              )}
            />
            <div
              className={cn(
                "w-1/3 rounded-sm transition-colors",
                filledSegments >= 3 ? strengthColors[strength] : "bg-gray-200"
              )}
            />
          </div>
        </div>

        {/* Requirements list */}
        <ul className="space-y-1 text-xs">
          <li className="flex items-center gap-2">
            {hasMinLength ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span
              className={
                hasMinLength ? "text-green-500" : "text-muted-foreground"
              }
            >
              {t("password.requirement.length", "At least 6 characters")}
            </span>
          </li>
          <li className="flex items-center gap-2">
            {hasUppercase ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span
              className={
                hasUppercase ? "text-green-500" : "text-muted-foreground"
              }
            >
              {t(
                "password.requirement.uppercase",
                "One uppercase letter (A-Z)"
              )}
            </span>
          </li>
          <li className="flex items-center gap-2">
            {hasNumber ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span
              className={hasNumber ? "text-green-500" : "text-muted-foreground"}
            >
              {t("password.requirement.number", "One number (0-9)")}
            </span>
          </li>
          <li className="flex items-center gap-2">
            {hasSpecialChar ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span
              className={
                hasSpecialChar ? "text-green-500" : "text-muted-foreground"
              }
            >
              {t(
                "password.requirement.special",
                "One special character (!@#$...)"
              )}
            </span>
          </li>
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
