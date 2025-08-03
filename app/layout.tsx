import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@app/providers";
import { AuthInitializer } from "@components/auth/AuthInitializer";
import { ToastWrapper } from "keep-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexa",
  description: "AI powered dental CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
