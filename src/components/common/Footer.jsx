"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <footer className="bg-[#F9F9F9] text-black py-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-4 gap-10">
        {/* ABOUT */}
        <div>
          <Image
            src="/images/logo.png"
            width={180}
            height={80}
            alt="Logo"
            className="mb-4"
          />
          <p className="text-sm text-black/70">
            {t("footer.about")}
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {t("footer.quickLinks.title")}
          </h3>
          <ul className="space-y-2 text-black/70">
            <li><Link href="/">{t("footer.quickLinks.home")}</Link></li>
            <li><Link href="/pages/about">{t("footer.quickLinks.about")}</Link></li>
            <li><Link href="/pages/properties">{t("footer.quickLinks.properties")}</Link></li>
            <li><Link href="/pages/contact">{t("footer.quickLinks.contact")}</Link></li>
            <li><Link href="/pages/blog">{t("footer.quickLinks.blog")}</Link></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {t("footer.services.title")}
          </h3>
          <ul className="space-y-2 text-black/70">
            <li>{t("footer.services.buying")}</li>
            <li>{t("footer.services.selling")}</li>
            <li>{t("footer.services.investing")}</li>
            <li>{t("footer.services.legal")}</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {t("footer.contact.title")}
          </h3>
          <p className="text-black/70">
            {t("footer.contact.address")}
          </p>
          <p className="text-black/70 mt-2">
            {t("footer.contact.email")}
          </p>
          <p className="text-black/70 mt-2">
            {t("footer.contact.phone")}
          </p>

          <div className="flex mt-4 space-x-3">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 bg-black/5 rounded-full hover:bg-brandAccent hover:text-white transition"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-black/50 text-sm">
        © {new Date().getFullYear()} {t("footer.copyright")}
      </div>
    </footer>
  );
}
