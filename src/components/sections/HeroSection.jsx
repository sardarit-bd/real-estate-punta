"use client";

import { useEffect, useState } from "react";
import SearchCard from "./SearchCard";
import VideoPlayer from "./VideoPlayer";
import { useTranslation } from "react-i18next";

export default function LuxuryHero() {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);


  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <section className="bg-[#FFF7F3] py-16 md:py-24 lg:py-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* LEFT SIDE */}
        <div className="order-2 lg:order-1">
          <p className="text-gray-600 text-sm mb-2 sm:mb-3">
            {t("heroSubtitle")}
          </p>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#113B28] leading-tight md:leading-tight">
            {t("heroTitleBefore")}{" "}
            <span className="text-[#004087]">
              {t("heroTitleHighlight")}
            </span>
            , {t("heroTitleAfter")}
          </h1>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <SearchCard />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="order-1 lg:order-2 mb-8 lg:mb-0">
          <VideoPlayer />
        </div>
      </div>
    </section>
  );
}