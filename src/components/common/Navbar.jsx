"use client";

import { useState, useEffect } from "react";
import { Phone, Menu, X, Heart } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuthContext } from "@/providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { parseCookies, setCookie } from "nookies";
import SafeLink from "@/components/SafeLink";
import UserButtons from "./UserButtons";

const COOKIE_NAME = "googtrans";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [language, setLanguage] = useState("en");
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user } = useAuthContext();
  const { t } = useTranslation();

  /* -------------------- CLIENT CHECK -------------------- */
  useEffect(() => {
    setIsClient(true);
  }, []);

  /* -------------------- SCROLL EFFECT -------------------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -------------------- GOOGLE TRANSLATE LANGUAGE INIT -------------------- */
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies[COOKIE_NAME]) {
      const parts = cookies[COOKIE_NAME].split("/");
      if (parts.length > 2) {
        setLanguage(parts[2]);
      }
    }
  }, []);

  /* -------------------- FAVOURITES -------------------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      updateFavouriteCount();

      const refresh = () => updateFavouriteCount();
      window.addEventListener("favourites-updated", refresh);

      return () =>
        window.removeEventListener("favourites-updated", refresh);
    }
  }, []);

  const updateFavouriteCount = () => {
    if (typeof window !== "undefined") {
      const favourites = JSON.parse(
        localStorage.getItem("favouriteProperties") || "[]"
      );
      setFavouriteCount(favourites.length);
    }
  };

  /* -------------------- LANGUAGE CHANGE -------------------- */
  const handleLanguageChange = (lang) => {
    setLanguage(lang);

    setCookie(null, COOKIE_NAME, `/auto/${lang}`, {
      path: "/",
    });

    // Google Translate needs reload
    window.location.reload();
  };

  // Function to close mobile drawer
  const closeMobileDrawer = () => {
    setOpen(false);
  };

  /* -------------------- SSR LOADING -------------------- */
  if (!isClient) {
    return (
      <header className="w-full bg-[#F9F9F9] py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="w-[120px] sm:w-[150px] h-[35px] sm:h-[40px] bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <header 
        className={`notranslate w-full bg-[#F9F9F9] py-3 sm:py-4 sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-12">
            <SafeLink href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Punta Cana Real Estate"
                width={150}
                height={150}
                className="w-[120px] sm:w-[140px] md:w-[150px]"
                priority
              />
            </SafeLink>

            {/* DESKTOP MENU */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-[#1F3A34]">
              <NavItem title={t("home")} href="/" />
              <NavItem title={t("navAbout")} href="/pages/about" />
              <NavItem title={t("properties")} href="/pages/properties" />
              <NavItem title={t("blog")} href="/pages/blog" />
              <NavItem title={t("contact")} href="/pages/contact" />
            </nav>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* PHONE - SHOW ON MEDIUM AND LARGE SCREENS */}
            <div className="flex items-center gap-2 text-[#1F3A34]">
              <Phone size={18} />
              <span className="text-sm font-medium whitespace-nowrap">
                +68 685 88666
              </span>
            </div>

            {/* FAVOURITES */}
            <SafeLink
              href="/pages/favourites"
              className="relative p-2 hover:bg-white/50 rounded-full transition-colors"
              aria-label={`${favouriteCount} favourites`}
            >
              <Heart size={20} />
              {favouriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favouriteCount}
                </span>
              )}
            </SafeLink>

            <UserButtons />

            {/* LANGUAGE SELECT */}
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px] lg:w-[130px] rounded-full border-[#004087] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
                <SelectItem value="bn">🇧🇩 Bengali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* MOBILE - FAVOURITES & PHONE WITH NUMBER (VISIBLE ON SMALL) */}
          <div className="flex md:hidden items-center gap-4">
            {/* PHONE WITH NUMBER FOR SMALL SCREENS */}
            <div className="flex items-center gap-2 text-[#1F3A34]">
              <Phone size={16} />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                +68 685 88666
              </span>
            </div>
            
            {/* FAVOURITES FOR MOBILE */}
            <SafeLink
              href="/pages/favourites"
              className="relative p-2 hover:bg-white/50 rounded-full"
              aria-label={`${favouriteCount} favourites`}
            >
              <Heart size={20} />
              {favouriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favouriteCount}
                </span>
              )}
            </SafeLink>

            {/* MOBILE MENU BUTTON */}
            <button
              className="p-2"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-[320px] bg-white z-50 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="text-lg font-semibold">{t("menu")}</span>
          <button 
            onClick={closeMobileDrawer}
            aria-label="Close menu"
          >
            <X size={26} />
          </button>
        </div>

        <div className="h-[calc(100%-73px)] overflow-y-auto">
          <nav className="flex flex-col px-5 py-4 gap-3">
            <MobileItem title={t("home")} href="/" onClick={closeMobileDrawer} />
            <MobileItem title={t("navAbout")} href="/pages/about" onClick={closeMobileDrawer} />
            <MobileItem title={t("properties")} href="/pages/properties" onClick={closeMobileDrawer} />
            <MobileItem title={t("favourites")} href="/pages/favourites" onClick={closeMobileDrawer} />
            <MobileItem title={t("blog")} href="/pages/blog" onClick={closeMobileDrawer} />
            <MobileItem title={t("contact")} href="/pages/contact" onClick={closeMobileDrawer} />

            {/* USER BUTTONS FOR MOBILE */}
            <div className="mt-4 pt-4 border-t">
              <div className="mb-4">
                {/* Pass closeMobileDrawer to UserButtons component */}
                <UserButtons mobile onItemClick={closeMobileDrawer} />
              </div>
              
              {/* PHONE NUMBER IN MOBILE */}
              <div className="flex items-center gap-2 text-[#1F3A34] mb-6">
                <Phone size={18} />
                <span className="text-sm font-medium">+68 685 88666</span>
              </div>

              {/* MOBILE LANGUAGE */}
              <div>
                <p className="text-sm font-medium mb-2">{t("language") || "Language"}</p>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full rounded-full border-[#004087] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="bn">🇧🇩 Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={closeMobileDrawer}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
    </>
  );
}

/* ------------ ITEMS ------------ */
function NavItem({ title, href }) {
  return (
    <div className="hover:text-black transition-colors">
      <SafeLink 
        href={href}
        className="py-2 px-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#004087] after:transition-all after:duration-300 hover:after:w-full"
      >
        {title}
      </SafeLink>
    </div>
  );
}

function MobileItem({ title, href, onClick }) {
  return (
    <SafeLink 
      href={href} 
      className="py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors text-lg"
      onClick={onClick}
    >
      {title}
    </SafeLink>
  );
}