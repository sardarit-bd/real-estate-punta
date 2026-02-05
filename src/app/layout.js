"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/providers/AuthProvider";
import ClientLayout from "@/components/layouts/ClientLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  // const { i18n } = useTranslation();

  // useEffect(() => {
  //   document.documentElement.lang = i18n.language || "en";
  // }, [i18n.language]);

  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);


  return (
    <html lang="en">
      <head>
        {/* 🔥 Google Translate CONFIG */}
        <Script src="/assets/lang-config.js" strategy="beforeInteractive" />
        <Script src="/assets/translation.js" strategy="beforeInteractive" />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google translate hidden element */}
        <div id="google_translate_element" className="hidden" />

        <QueryClientProvider client={client}>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
