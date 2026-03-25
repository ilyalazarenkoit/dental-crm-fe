import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@app/providers";
import { AuthInitializer } from "@components/auth/AuthInitializer";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexa",
  description: "AI powered dental CRM",
  icons: {
    icon: [
      { url: "/images/favicon.png", sizes: "96x96", type: "image/png" },
      { url: "/images/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <Providers>
          <AuthInitializer />
          {children}
          <Toaster />
        </Providers>{" "}
      </body>
    </html>
  );
}
