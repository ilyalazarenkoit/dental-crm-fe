"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Settings as SettingsIcon } from "lucide-react";

// Icons
import {
  Home,
  Calendar,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  User,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface SimpleSidebarProps {
  onToggle?: (expanded: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isActive?: boolean;
}

export const SimpleSidebar: React.FC<SimpleSidebarProps> = ({ onToggle }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Notify parent about toggle state
  useEffect(() => {
    onToggle?.(isExpanded);
  }, [isExpanded, onToggle]);

  // Navigation items
  const navItems: NavItem[] = [
    {
      title: "Home",
      href: "/home",
      icon: Home,
      isActive: pathname === "/home",
    },
    {
      title: "Scheduling",
      href: "/scheduling",
      icon: Calendar,
      isActive: pathname === "/scheduling",
      badge: "3",
    },
    {
      title: "Patients",
      href: "/patients",
      icon: Users,
      isActive: pathname === "/patients",
      badge: "12",
    },
    {
      title: "Patient Cards",
      href: "/cards",
      icon: CreditCard,
      isActive: pathname === "/cards",
    },
    {
      title: "Management",
      href: "/management",
      icon: Settings,
      isActive: pathname === "/management",
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      isActive: pathname === "/analytics",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      isActive: pathname === "/profile",
    },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  // Desktop sidebar
  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          {isExpanded && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">
                Nord Dental
              </span>
              <span className="text-xs text-gray-500 truncate">Clinic</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button - positioned under header */}
      <div className="border-b border-gray-200 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-10 hover:bg-gray-100 text-gray-600 flex items-center justify-between px-3 transition-all duration-200"
        >
          {isExpanded ? (
            <>
              <span className="text-sm font-medium text-gray-700">
                Collapse
              </span>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 transition-colors duration-200">
                <ChevronLeft className="h-6 w-6 font-bold" strokeWidth={2.5} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 mx-auto">
              <ChevronRight
                className="h-7 w-7 font-bold text-gray-600"
                strokeWidth={2.5}
              />
            </div>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const navItem = (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  "group flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 min-w-0 mx-2",
                  isExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center",
                  "hover:bg-gray-100 hover:text-gray-900",
                  item.isActive
                    ? "bg-gray-200 text-gray-900 shadow-sm"
                    : "text-gray-600"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200 flex-shrink-0",
                    item.isActive
                      ? "text-gray-700"
                      : "text-gray-500 group-hover:text-gray-700"
                  )}
                />
                {isExpanded && (
                  <span className="truncate min-w-0 flex-1">{item.title}</span>
                )}
                {item.badge && isExpanded && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 border-0 flex-shrink-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );

            // Show tooltip only when collapsed
            if (!isExpanded) {
              return (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="ml-2 text-base font-semibold bg-gray-900 text-white border-0 px-3 py-2"
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return navItem;
          })}
        </nav>
      </ScrollArea>

      {/* User section - positioned at very bottom */}
      <div className="border-t border-gray-200 p-2 pb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-12 justify-start gap-3 text-gray-600 hover:bg-gray-100 border border-gray-200 min-w-0",
                isExpanded ? "px-3 py-4" : "px-2 py-4 justify-center"
              )}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm flex-shrink-0 text-white font-semibold text-sm">
                JS
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Dr. John Smith
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white border border-gray-200 shadow-lg"
          >
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              <Edit className="h-4 w-4" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  // Mobile sidebar (Sheet) - always expanded
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return (
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-10 w-10 p-0 fixed top-4 left-4 z-50 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50"
          >
            <Menu className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0 border-r bg-white [&>button]:hidden"
        >
          <div className="flex h-full flex-col">
            {/* Mobile Header - Fixed at top */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      Nord Dental
                    </span>
                    <span className="text-xs text-gray-500">Clinic</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 bg-white"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-6">
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "group flex items-center gap-4 rounded-lg text-base font-medium transition-all duration-200 min-w-0 mx-3 px-4 py-4",
                      "hover:bg-gray-100 hover:text-gray-900",
                      item.isActive
                        ? "bg-gray-200 text-gray-900 shadow-sm"
                        : "text-gray-600"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-6 w-6 transition-colors duration-200 flex-shrink-0",
                        item.isActive
                          ? "text-gray-700"
                          : "text-gray-500 group-hover:text-gray-700"
                      )}
                    />
                    <span className="truncate min-w-0 flex-1">
                      {item.title}
                    </span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-sm px-3 py-1 bg-gray-200 text-gray-700 border-0 flex-shrink-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
            </ScrollArea>

            {/* User section - positioned at very bottom */}
            <div className="border-t border-gray-200 p-3 pb-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-14 justify-start gap-4 text-gray-600 hover:bg-gray-100 border border-gray-200 min-w-0 px-4 py-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm flex-shrink-0 text-white font-semibold text-base">
                      JS
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate">
                        Dr. John Smith
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="right"
                  className="w-56 bg-white border border-gray-200 shadow-lg"
                >
                  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <Edit className="h-5 w-5" />
                    {t("navigation.user.edit-profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <SettingsIcon className="h-5 w-5" />
                    {t("navigation.user.settings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-base text-red-600 hover:bg-red-50 cursor-pointer">
                    <LogOut className="h-5 w-5" />
                    {t("navigation.user.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "w-64" : "w-16",
        "transform lg:translate-x-0"
      )}
    >
      <SidebarContent />
    </div>
  );
};

export default SimpleSidebar;
