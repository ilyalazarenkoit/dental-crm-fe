import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@app/providers";
import { AuthInitializer } from "@components/auth/AuthInitializer";
import { ToastWrapper } from "keep-react";
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
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <Providers>
          <AuthInitializer />
          {children}
          <ToastWrapper
            richColors={true}
            toastOptions={{
              classNames: {
                title: "text-body-3 font-medium",
                toast: "rounded-xl shadow-large",
                description: "text-body-4 font-normal",
              },
            }}
          />
        </Providers>{" "}
      </body>
    </html>
  );
}
