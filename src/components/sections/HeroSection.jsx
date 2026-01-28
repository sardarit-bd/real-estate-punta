"use client";

import SearchCard from "./SearchCard";
import VideoPlayer from "./VideoPlayer";
import { useTranslation } from "react-i18next";

export default function LuxuryHero() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#FFF7F3] py-30">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <div>
          <p className="text-gray-600 text-sm mb-2">
            {t("heroSubtitle")}
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#113B28] leading-tight">
            {t("heroTitleBefore")}{" "}
            <span className="text-[#004087]">
              {t("heroTitleHighlight")}
            </span>
            , {t("heroTitleAfter")}
          </h1>

          <SearchCard />
        </div>

        {/* RIGHT SIDE */}
        <VideoPlayer />
      </div>
    </section>
  );
}
