"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TranslateReset() {
  const pathname = usePathname();

  useEffect(() => {
    const el = document.getElementById("google_translate_element");
    if (el) el.innerHTML = "";
  }, [pathname]);

  return null;
}
