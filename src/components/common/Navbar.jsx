"use client";

import { useState, useEffect } from "react";
import { Phone, User, ChevronDown, Menu, X, Heart } from "lucide-react";
import Image from "next/image";
import UserButtons from "./UserButtons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAuthContext } from "@/providers/AuthProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [language, setLanguage] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const {user} = useAuthContext()



  // Load favourite count from localStorage
  useEffect(() => {
    updateFavouriteCount();

    const refresh = () => updateFavouriteCount();

    window.addEventListener("favourites-updated", refresh);

    return () => window.removeEventListener("favourites-updated", refresh);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);



  const updateFavouriteCount = () => {
    const favourites = JSON.parse(localStorage.getItem("favouriteProperties") || "[]");
    setFavouriteCount(favourites.length);
  };

  return (
    <>
      <header className="w-full bg-[#F9F9F9] py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* LEFT: LOGO + MENUS */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Punta Cana Real Estate"
                width={150}
                height={150}
                className="w-[150px]"
              />
            </a>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-[#1F3A34]">
              <NavItem title="Home" href="/" />
              <NavItem title="About" href="/pages/about" />
              <NavItem title="Properties" href="/pages/properties" />
              <a href="/pages/blog" className="hover:text-black">Blog</a>
              <a href="/pages/contact" className="hover:text-black">Contact</a>

             
            </nav>
          </div>

          {/* RIGHT SIDE (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Phone Number */}
            <div className="flex items-center gap-2 text-[#1F3A34]">
              <Phone size={18} />
              <span className="text-sm font-medium">+68 685 88666</span>
            </div>

            {/* Favourites Button */}
            <a
              href="/pages/favourites"
              className="relative p-2 hover:bg-white/50 rounded-full transition"
            >
              <Heart size={20} className="text-gray-700" />
              {favouriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favouriteCount}
                </span>
              )}
            </a>

            <UserButtons />

            {/* <a
              href="/dashboard/owner/properties/add"
              className="px-5 py-2 border border-[#004087] rounded-full text-sm font-medium hover:bg-[#004087] hover:text-white transition"
            >
              Add Property
            </a> */}

            {/* Language Selector */}
            {/* <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[110px] rounded-full border-[#004087] text-sm">
                <SelectValue placeholder="Language" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
              </SelectContent>
            </Select> */}
 <LanguageSwitcher />

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(true)}
          >
            <Menu size={28} />
          </button>

        </div>
      </header>

      {/* MOBILE LEFT DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-xl z-50 transform 
                ${open ? "translate-x-0" : "-translate-x-full"} 
                transition-transform duration-300`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={26} />
          </button>
        </div>

        {/* Drawer Items */}
        <nav className="flex flex-col px-5 py-4 text-[16px] text-[#1F3A34] gap-4">
          <MobileItem title="Home" href="/" />
          <MobileItem title="About" href="/pages/about" />
          <MobileItem title="Properties" href="/pages/properties" />
          <MobileItem title="Favourites" href="/pages/favourites" />
          <MobileItem title="Blog" href="/pages/blog" />
          <MobileItem title="Contact" href="/pages/contact" />

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={18} />
              <span className="text-sm font-medium">+68 685 88666</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <button className="p-2 border rounded-full border-[#1F3A34]">
                <User size={16} />
              </button>

              <a
                href="/pages/favourites"
                className="relative p-2 border rounded-full border-[#1F3A34]"
              >
                <Heart size={16} />
                {favouriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favouriteCount}
                  </span>
                )}
              </a>
            </div>

            {/* <a
              href="/dashboard/owner/properties/add"
              className="block w-full text-center px-5 py-2 border border-[#1F3A34] rounded-full text-sm font-medium hover:bg-[#1F3A34] hover:text-white transition"
            >
              Add Property
            </a> */}

            {/* Language Switcher */}
            {/* <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[110px] rounded-full border-[#004087] text-sm">
                <SelectValue placeholder="Language" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
              </SelectContent>
            </Select> */}

            <LanguageSwitcher />

          </div>
        </nav>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition"
        ></div>
      )}
    </>
  );
}

/* DESKTOP NAV ITEM */
function NavItem({ title, href, dropdown }) {
  return (
    <div className="flex items-center gap-1 cursor-pointer hover:text-black">
      <a href={href}>{title}</a>
      {dropdown && <ChevronDown size={14} />}
    </div>
  );
}

/* MOBILE NAV ITEM */
function MobileItem({ title, href, dropdown }) {
  return (
    <div className="flex items-center justify-between cursor-pointer">
      <a href={href} className="py-2">{title}</a>
      {dropdown && <ChevronDown size={18} />}
    </div>
  );
}