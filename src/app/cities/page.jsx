"use client";

import CityCard from "@/components/cards/CityCard";
import { citiesData } from "@/data/cities";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CitiesPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("citiesTitle")}
            </h2>
            <p className="text-gray-500 mt-1">
              {t("citiesSubtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {citiesData.map((city, index) => (
            <CityCard
              key={index}
              name={city.name}
              img={city.img}
              slug={city.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
