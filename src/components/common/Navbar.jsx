"use client";

import { useState, useEffect } from "react";
import { Phone, User, ChevronDown, Menu, X, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserButtons from "./UserButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuthContext } from "@/providers/AuthProvider";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [language, setLanguage] = useState("en");

  const { user } = useAuthContext();
  const { t, i18n } = useTranslation();

  /* -------------------- FAVOURITES -------------------- */
  useEffect(() => {
    updateFavouriteCount();

    const refresh = () => updateFavouriteCount();
    window.addEventListener("favourites-updated", refresh);

    return () =>
      window.removeEventListener("favourites-updated", refresh);
  }, []);

  const updateFavouriteCount = () => {
    const favourites = JSON.parse(
      localStorage.getItem("favouriteProperties") || "[]"
    );
    setFavouriteCount(favourites.length);
  };

  /* -------------------- LANGUAGE -------------------- */
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLanguage(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full bg-[#F9F9F9] py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Punta Cana Real Estate"
                width={150}
                height={150}
                className="w-[150px]"
              />
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-[#1F3A34]">
              <NavItem title={t("home")} href="/" />
              <NavItem title={t("about")} href="/pages/about" />
              <NavItem title={t("properties")} href="/pages/properties" />
              <Link href="/pages/blog">{t("blog")}</Link>
              <Link href="/pages/contact">{t("contact")}</Link>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[#1F3A34]">
              <Phone size={18} />
              <span className="text-sm font-medium">
                +68 685 88666
              </span>
            </div>

            {/* FAVOURITES */}
            <Link
              href="/pages/favourites"
              className="relative p-2 hover:bg-white/50 rounded-full"
            >
              <Heart size={20} />
              {favouriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favouriteCount}
                </span>
              )}
            </Link>

            <UserButtons />

            {/* LANGUAGE */}
            <Select
              value={language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[130px] rounded-full border-[#004087] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  🇺🇸 English
                </SelectItem>
                <SelectItem value="es">
                  🇪🇸 Español
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="text-lg font-semibold">
            {t("menu")}
          </span>
          <button onClick={() => setOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <nav className="flex flex-col px-5 py-4 gap-4">
          <MobileItem title={t("home")} href="/" />
          <MobileItem title={t("about")} href="/pages/about" />
          <MobileItem
            title={t("properties")}
            href="/pages/properties"
          />
          <MobileItem
            title={t("favourites")}
            href="/pages/favourites"
          />
          <MobileItem title={t("blog")} href="/pages/blog" />
          <MobileItem
            title={t("contact")}
            href="/pages/contact"
          />

          <div className="mt-6 border-t pt-4">
            <Select
              value={language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[130px] rounded-full border-[#004087] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  🇺🇸 English
                </SelectItem>
                <SelectItem value="es">
                  🇪🇸 Español
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </nav>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
    </>
  );
}

/* ------------ ITEMS ------------ */
function NavItem({ title, href }) {
  return (
    <div className="hover:text-black">
      <Link href={href}>{title}</Link>
    </div>
  );
}

function MobileItem({ title, href }) {
  return (
    <Link href={href} className="py-2">
      {title}
    </Link>
  );
}
