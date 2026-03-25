"use client";

import React, { useState, useEffect } from "react";
import { SimpleSidebar } from "./SimpleSidebar";
import { MobileHeader } from "./MobileHeader";
import { cn } from "@/lib/utils";

interface SimpleDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const SimpleDashboardLayout: React.FC<SimpleDashboardLayoutProps> = ({
  children,
  className,
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);

      if (width < 1024) {
        setSidebarExpanded(false);
      } else {
        setSidebarExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Mobile header — hamburger button, only visible on mobile */}
      <MobileHeader
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Sidebar — receives external mobile open state so MobileHeader controls it */}
      <SimpleSidebar
        onToggle={handleSidebarToggle}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          "min-h-screen",
          className
        )}
        style={{
          marginLeft: isMobile ? 0 : sidebarExpanded ? "256px" : "64px",
        }}
      >
        {/* Top padding for mobile menu button */}
        <div className="lg:hidden h-20" />

        {/* Content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default SimpleDashboardLayout;
