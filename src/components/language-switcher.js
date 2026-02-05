"use client";

import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";

const COOKIE_NAME = "googtrans";

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState();
  const [config, setConfig] = useState();

  useEffect(() => {
    const cookies = parseCookies();
    let lang;

    if (cookies[COOKIE_NAME]) {
      const parts = cookies[COOKIE_NAME].split("/");
      if (parts.length > 2) lang = parts[2];
    }

    if (!lang && window.__GOOGLE_TRANSLATION_CONFIG__) {
      lang = window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }

    setCurrentLang(lang);
    setConfig(window.__GOOGLE_TRANSLATION_CONFIG__);
  }, []);

  if (!currentLang || !config) return null;

  const changeLanguage = (lang) => () => {
    setCookie(null, COOKIE_NAME, `/auto/${lang}`, { path: "/" });
    window.location.reload();
  };

  return (
    <div className="flex gap-3 notranslate text-sm">
      {config.languages.map((l) =>
        l.name === currentLang ? (
          <span key={l.name} className="font-semibold text-orange-500">
            {l.title}
          </span>
        ) : (
          <button
            key={l.name}
            onClick={changeLanguage(l.name)}
            className="text-blue-500 hover:underline"
          >
            {l.title}
          </button>
        )
      )}
    </div>
  );
}
