"use client";

import { parseCookies } from "nookies";

export default function SafeLink({ href, children, className }) {
  const cookies = parseCookies();
  const isTranslated =
    cookies.googtrans && cookies.googtrans !== "/auto/en";

  // 🔥 Google translate active → hard reload
  if (isTranslated) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  // normal SPA navigation
  const Link = require("next/link").default;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
