"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import CustomSelect from "../dashboard/Admin/CustomSelect";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function SearchCard() {
  const router = useRouter();
  const { t } = useTranslation();

  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");

  /* ---------- OPTIONS ---------- */
  const cityOptions = [
    t("allCities"),
    "punta cana",
    "bavaro",
    "cocotal",
    "cap cana",
  ];

  const typeOptions = [
    t("allStatus"),
    t("forRent"),
    t("forSale"),
  ];

  const bedroomOptions = [
    t("any"),
    t("oneBedroom"),
    t("twoBedrooms"),
    t("threeBedrooms"),
    t("fourPlusBedrooms"),
  ];

  /* ---------- HANDLERS ---------- */
  const handleCityChange = (value) => {
    setCity(value === t("allCities") ? "all" : value);
  };

  const handleTypeChange = (value) => {
    const internal =
      value === t("allStatus")
        ? "all"
        : value === t("forRent")
        ? "rent"
        : "sale";
    setType(internal);
  };

  const handleBedroomChange = (value) => {
    const internal =
      value === t("any")
        ? "all"
        : value === t("fourPlusBedrooms")
        ? "4"
        : value.charAt(0);
    setBedrooms(internal);
  };

  const getCityDisplayValue = () =>
    city === "all" ? t("allCities") : city;

  const getTypeDisplayValue = () =>
    type === "all"
      ? t("allStatus")
      : type === "rent"
      ? t("forRent")
      : t("forSale");

  const getBedroomDisplayValue = () => {
    if (bedrooms === "all") return t("any");
    if (bedrooms === "4") return t("fourPlusBedrooms");
    return `${bedrooms} ${t("bedroom")}${
      bedrooms !== "1" ? "s" : ""
    }`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city !== "all") params.set("city", city);
    if (type !== "all") params.set("type", type);
    if (bedrooms !== "all") params.set("bedrooms", bedrooms);

    router.push(`/pages/properties?${params.toString()}`);
  };

  return (
    <div className="mt-6 sm:mt-8 md:mt-10 bg-white shadow-lg rounded-2xl lg:rounded-3xl p-4 sm:p-5 md:p-6 border">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* CITY */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-gray-600 text-xs sm:text-sm block mb-1 sm:mb-2">
            {t("city")}
          </label>
          <CustomSelect
            value={getCityDisplayValue()}
            options={cityOptions}
            onChange={handleCityChange}
            size="responsive"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="text-gray-600 text-xs sm:text-sm block mb-1 sm:mb-2">
            {t("status")}
          </label>
          <CustomSelect
            value={getTypeDisplayValue()}
            options={typeOptions}
            onChange={handleTypeChange}
            size="responsive"
          />
        </div>

        {/* BEDROOMS */}
        <div>
          <label className="text-gray-600 text-xs sm:text-sm block mb-1 sm:mb-2">
            {t("bedrooms")}
          </label>
          <CustomSelect
            value={getBedroomDisplayValue()}
            options={bedroomOptions}
            onChange={handleBedroomChange}
            size="responsive"
          />
        </div>
      </div>

      {/* SEARCH BUTTON */}
      <div className="mt-6 sm:mt-8">
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#004087] text-white font-semibold rounded-lg sm:rounded-xl hover:bg-[#002f64] transition-colors duration-300 text-sm sm:text-base"
        >
          <FaSearch className="text-sm sm:text-base" />
          {t("searchProperties")}
        </button>
      </div>
    </div>
  );
}