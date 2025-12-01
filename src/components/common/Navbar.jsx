"use client";

import { useState } from "react";
import { Phone, User, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-[#F8F4F1] py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* LEFT: LOGO + MENUS */}
          <div className="flex items-center gap-12">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Punta Cana Real Estate"
                width={150}
                height={150}
                className="w-[150px]"
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-[#1F3A34]">
              <NavItem title="Home" href="/" />
              <NavItem title="About" href="/about" dropdown />
              <NavItem title="Services" href="/services" dropdown />
              <NavItem title="Properties" href="/properties" dropdown />
              <Link href="/blog" className="hover:text-black">Blog</Link>
              <Link href="/contact" className="hover:text-black">Contact</Link>
            </nav>
          </div>

          {/* RIGHT SIDE (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[#1F3A34]">
              <Phone size={18} />
              <span className="text-sm font-medium">+68 685 88666</span>
            </div>

            <button className="p-2 border rounded-full border-[#1F3A34]">
              <User size={16} />
            </button>

            <Link
              href="/add-property"
              className="px-5 py-2 border border-[#1F3A34] rounded-full text-sm font-medium hover:bg-[#1F3A34] hover:text-white transition"
            >
              Add Property
            </Link>
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
          <MobileItem title="About" href="/about" dropdown />
          <MobileItem title="Services" href="/services" dropdown />
          <MobileItem title="Properties" href="/properties" dropdown />
          <MobileItem title="Blog" href="/blog" />
          <MobileItem title="Contact" href="/contact" />

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={18} />
              <span className="text-sm font-medium">+68 685 88666</span>
            </div>

            <button className="p-2 border rounded-full border-[#1F3A34] mb-4">
              <User size={16} />
            </button>

            <Link
              href="/add-property"
              className="block w-full text-center px-5 py-2 border border-[#1F3A34] rounded-full text-sm font-medium hover:bg-[#1F3A34] hover:text-white transition"
            >
              Add Property
            </Link>
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
      <Link href={href}>{title}</Link>
      {dropdown && <ChevronDown size={14} />}
    </div>
  );
}

/* MOBILE NAV ITEM */
function MobileItem({ title, href, dropdown }) {
  return (
    <div className="flex items-center justify-between cursor-pointer">
      <Link href={href} className="py-2">{title}</Link>
      {dropdown && <ChevronDown size={18} />}
    </div>
  );
}
