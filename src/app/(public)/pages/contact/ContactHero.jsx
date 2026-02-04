"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactHero() {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FFF6F2]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT TEXT */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#113B28]"
          >
            {t("contactHero.titleBefore")}{" "}
            <span className="text-[#004087]">
              {t("contactHero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 text-[#6F6F6F] text-base leading-relaxed max-w-md"
          >
            {t("contactHero.description")}
          </motion.p>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden shadow-lg border border-white">
            <Image
              src="/images/contact.jpg"
              alt={t("contactHero.imageAlt")}
              width={700}
              height={450}
              className="object-cover w-full h-[320px] md:h-[380px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
