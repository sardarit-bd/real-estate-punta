import "./globals.css";
import ClientLayout from "@/components/layouts/ClientLayout";
import Providers from "./providers";
import Script from "next/script";
import TranslateReset from "@/components/TranslateReset";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="/assets/lang-config.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/assets/translation.js"
          strategy="beforeInteractive"
        />

        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      </head>

      <body className={`antialiased`}>
        <div
          id="google_translate_element"
          suppressHydrationWarning
        />
        <TranslateReset />
        {console.log("Rendering RootLayout")}
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
