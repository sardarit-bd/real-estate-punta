"use client";

import CustomSelect from "@/components/dashboard/Admin/CustomSelect";
import { useTranslation } from "react-i18next";

export default function FiltersSidebar({
  query,
  setQuery,
  city,
  setCity,
  type,
  setType,
  bedrooms,
  setBedrooms,
  clearFilters,
}) {
  const { t } = useTranslation();

  /* ---------------- OPTIONS (TRANSLATED) ---------------- */
  const cityOptions = [
    t("allCities"),
    "punta cana",
    "bavaro",
    "cocotal",
    "cap cana",
  ];

  const typeOptions = [
    t("allTypes"),
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

  /* ---------------- DISPLAY VALUES ---------------- */
  const getCityDisplayValue = () => {
    if (city === "all") return t("allCities");
    return city.replace("-", " ");
  };

  const getTypeDisplayValue = () => {
    if (type === "all") return t("allTypes");
    return type === "rent"
      ? t("forRent")
      : t("forSale");
  };

  const getBedroomDisplayValue = () => {
    if (bedrooms === "all") return t("any");
    if (bedrooms === "4") return t("fourPlusBedrooms");
    return bedrooms === "1"
      ? t("oneBedroom")
      : `${bedrooms} ${t("bedrooms")}`;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleCityChange = (value) => {
    const internalValue =
      value === t("allCities") ? "all" : value;
    setCity(internalValue);
  };

  const handleTypeChange = (value) => {
    const internalValue =
      value === t("allTypes")
        ? "all"
        : value === t("forRent")
        ? "rent"
        : "sale";
    setType(internalValue);
  };

  const handleBedroomChange = (value) => {
    const internalValue =
      value === t("any")
        ? "all"
        : value === t("fourPlusBedrooms")
        ? "4"
        : value.charAt(0);
    setBedrooms(internalValue);
  };

  const isFiltered =
    query ||
    city !== "all" ||
    type !== "all" ||
    bedrooms !== "all";

  return (
    <aside className="lg:sticky top-24 h-fit border rounded-xl p-5 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h3 className="text-xl font-semibold text-[#05314A]">
          {t("filters")}
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm font-medium text-[#E7C464] hover:text-[#d2ab54] transition-colors duration-200"
        >
          {t("clearAll")}
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("search")}
        </label>
        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-[#05314A]
                     focus:border-[#E7C464] focus:ring-2 focus:ring-[#E7C464]/30 transition-all duration-200
                     placeholder:text-gray-400"
          placeholder={t("searchPlaceholder")}
        />
      </div>

      {/* CITY */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("city")}
        </label>
        <CustomSelect
          value={getCityDisplayValue()}
          options={cityOptions}
          onChange={handleCityChange}
          className="w-full"
        />
      </div>

      {/* TYPE */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("type")}
        </label>
        <CustomSelect
          value={getTypeDisplayValue()}
          options={typeOptions}
          onChange={handleTypeChange}
          className="w-full"
        />
      </div>

      {/* BEDROOMS */}
      <div className="mb-8">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t("bedrooms")}
        </label>
        <CustomSelect
          value={getBedroomDisplayValue()}
          options={bedroomOptions}
          onChange={handleBedroomChange}
          className="w-full"
        />
      </div>

      {/* FOOTER */}
      <div className="pt-4 border-t">
        <p className="text-xs text-gray-500 mb-3">
          {isFiltered
            ? t("filtersAuto")
            : t("filtersHint")}
        </p>

        {isFiltered && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              {t("activeFilters")}
            </span>
            <span className="text-sm font-medium text-[#05314A] bg-[#E7C464]/10 px-2 py-1 rounded">
              {[
                query ? 1 : 0,
                city !== "all" ? 1 : 0,
                type !== "all" ? 1 : 0,
                bedrooms !== "all" ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
