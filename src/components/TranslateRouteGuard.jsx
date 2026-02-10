"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { parseCookies } from "nookies";

export default function TranslateRouteGuard() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    const cookies = parseCookies();
    const lang = cookies.googtrans;

    // if not default language → reload
    if (lang && !lang.endsWith("/en")) {
      window.location.reload();
    }
  }, [pathname]);

  return null;
}
