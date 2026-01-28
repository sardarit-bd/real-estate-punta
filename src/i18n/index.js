"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./resources";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      lng: typeof window !== "undefined"
        ? localStorage.getItem("lang") || "en"
        : "en",
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
