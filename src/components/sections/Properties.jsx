"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/cards/Property";
import Link from "next/link";
import Loader from "../common/Loader";
import { useTranslation } from "react-i18next";

export default function Properties() {
  const { t } = useTranslation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [favouriteCount, setFavouriteCount] = useState(0);

  /* ---------------- FETCH PROPERTIES ---------------- */
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties?limit=50&featured=true`
        );

        const data = await res.json();

        if (data.success) {
          setProperties(data.data);
        }
      } catch (error) {
        console.error(
          "Failed to load featured properties",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  /* ---------------- FAVOURITES COUNT ---------------- */
  useEffect(() => {
    updateFavouriteCount();

    const handleStorageChange = () => {
      updateFavouriteCount();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );
    return () =>
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
  }, []);

  const updateFavouriteCount = () => {
    const favourites = JSON.parse(
      localStorage.getItem(
        "favouriteProperties"
      ) || "[]"
    );
    setFavouriteCount(favourites.length);
  };

  /* ---------------- FILTER ---------------- */
  const filteredProperties =
    filter === "all"
      ? properties
      : properties.filter(
          (item) => item.listingType === filter
        );

  /* ---------------- PAGINATION ---------------- */
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] =
    useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalItems = filteredProperties.length;
  const totalPages = Math.ceil(
    totalItems / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;
  const currentProperties =
    filteredProperties.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="max-w-7xl mx-auto px-5 py-16">
      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-[#1F1F1F]">
            {t("featuredProperties")}
          </h2>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3 text-sm">
          {["all", "sale", "rent"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full border transition-all ${
                filter === type
                  ? "bg-[#004087] text-white"
                  : "border-gray-300 text-gray-700 hover:border-[#004087]"
              }`}
            >
              {type === "all" &&
                t("allProperties")}
              {type === "sale" &&
                t("forSale")}
              {type === "rent" &&
                t("forRent")}
            </button>
          ))}
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {currentProperties.map((item) => {
          const coverImage =
            item.images?.find(
              (img) => img.isCover
            )?.url ||
            item.images?.[0]?.url ||
            "/placeholder.jpg";

          return (
            <Link
              key={item._id}
              href={`/pages/properties/${item._id}`}
            >
              <PropertyCard
                id={item._id}
                image={coverImage}
                title={item.title}
                price={item.price}
                address={item.address}
                beds={item.bedrooms}
                baths={item.bathrooms}
                sqft={item.area}
                isFeatured={item.featured}
                isForSale={
                  item.listingType === "sale"
                }
              />
            </Link>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          {/* PREV */}
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.max(p - 1, 1)
              )
            }
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded border transition ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 hover:border-[#004087]"
            }`}
          >
            {t("prev")}
          </button>

          {/* PAGE NUMBERS */}
          <div className="flex gap-2">
            {Array.from({
              length: totalPages,
            }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-[#004087] text-white"
                      : "bg-white hover:bg-gray-100 hover:border-[#004087]"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* NEXT */}
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, totalPages)
              )
            }
            disabled={
              currentPage === totalPages
            }
            className={`px-4 py-2 rounded border transition ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 hover:border-[#004087]"
            }`}
          >
            {t("next")}
          </button>
        </div>
      )}
    </section>
  );
}
