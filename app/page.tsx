"use client";

import { Header } from "@components/landing/Header";
import { Hero } from "@components/landing/Hero";
import { Main } from "@/components/landing/main/Main";
import { Footer } from "@components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Main />

      {/* Footer */}
      <Footer />
    </div>
  );
}
