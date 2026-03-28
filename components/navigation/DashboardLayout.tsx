"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
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

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Mobile Header - only visible on mobile */}
      <MobileHeader
        isOpen={isMobileMenuOpen}
        onToggle={handleMobileMenuToggle}
      />

      {/* Sidebar */}
      <Sidebar
        onToggle={handleSidebarToggle}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        isExpanded={sidebarExpanded}
      />

      {/* Main content */}
      <main
        className="transition-all duration-300 ease-in-out min-h-screen"
        style={{
          marginLeft: isMobile ? 0 : sidebarExpanded ? "256px" : "64px",
        }}
      >
        {/* Top padding for mobile header */}
        <div className="lg:hidden h-20" />

        {/* Content */}
        <div className="p-4 lg:p-8 lg:pt-4">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
