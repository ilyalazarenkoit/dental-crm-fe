"use client";

import { Button } from "@/components/ui/button";
import { List, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  isOpen,
  onToggle,
}) => {
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999] lg:hidden transition-all duration-300",
        isOpen
          ? "opacity-0 pointer-events-none transform -translate-y-full"
          : "opacity-100 pointer-events-auto transform translate-y-0"
      )}
    >
      {/* Background overlay when menu is open */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
          onClick={onToggle}
        />
      )}

      {/* Header content */}
      <div className="relative bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Logo and clinic name */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                Nord Dental
              </span>
              <span className="text-xs text-gray-500">
                {t("navigation.header.clinic")}
              </span>
            </div>
          </div>

          {/* Right side - Toggle button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "h-12 w-12 p-0 transition-all duration-300",
              "hover:bg-gray-100 active:scale-95",
              isOpen ? "text-gray-700 bg-gray-100" : "text-gray-600"
            )}
          >
            {isOpen ? (
              <X size={32} weight="bold" />
            ) : (
              <List size={32} weight="bold" />
            )}
            <span className="sr-only">
              {isOpen
                ? t("navigation.header.close-sidebar")
                : t("navigation.header.open-sidebar")}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

// Helper function for conditional classes
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default MobileHeader;
