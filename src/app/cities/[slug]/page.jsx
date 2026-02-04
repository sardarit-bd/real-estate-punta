"use client";

import Image from "next/image";
import { citiesData } from "@/data/cities";
import { useEffect, useState } from "react";
import PropertyResults from "@/app/(public)/pages/properties/PropertyResults";
import { useTranslation } from "react-i18next";

export default function CityPage({ params }) {
  const { t } = useTranslation();

  const [slug, setSlug] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties?limit=50`
        );

        const data = await res.json();

        if (data.success) {
          const filtered = data.data.filter(
            (p) =>
              p.city.toLowerCase() ===
              slug.replace("-", " ")
          );
          setProperties(filtered);
        }
      } catch (error) {
        console.error("Failed to load properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [slug]);

  if (!slug) return null;

  const city = citiesData.find((c) => c.slug === slug);

  /* -------- CITY NOT FOUND -------- */
  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {t("cityNotFound")}
          </h1>
          <p className="text-gray-600 text-lg">
            {t("cityNotFoundDesc")}
          </p>
          <p className="text-gray-500 text-sm mt-4">
            {t("tryAnotherCity")}
          </p>
        </div>
      </div>
    );
  }

  const totalProperties = properties.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src={city.img}
          fill
          className="object-cover brightness-50"
          alt={city.name}
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 pb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {city.name}
          </h1>

          <p className="text-gray-200 text-lg max-w-2xl">
            {city.description}
          </p>

          <div className="flex items-center gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-semibold">
                {totalProperties} {t("propertiesAvailable")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("locationCountry")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTIES */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("availableProperties")}
            </h2>
            <p className="text-gray-600 mt-2">
              {t("browseProperties", {
                count: totalProperties,
                city: city.name,
              })}
            </p>
          </div>
        </div>

        <PropertyResults filtered={properties} />
      </div>
    </div>
  );
}
