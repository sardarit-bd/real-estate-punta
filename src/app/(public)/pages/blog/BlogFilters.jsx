"use client";

import CustomSelect from "@/components/dashboard/Admin/CustomSelect";
import { useTranslation } from "react-i18next";

export default function BlogFilters({
    search,
    setSearch,
    category,
    setCategory,
    clearFilters,
}) {
    const { t } = useTranslation();

    // Options for category dropdown
    const categoryOptions = [
        { value: "all", label: t("blogpage.allCategories") },
        { value: "REAL_ESTATE", label: t("blogpage.realEstate") },
        { value: "GUIDE", label: t("blogpage.guide") },
        { value: "DESIGN", label: t("blogpage.design") },
    ];


    // Convert internal value to display value
    const getCategoryDisplayValue = () => {
        if (category === "all") return t("blogpage.allCategories");
        return category.toLowerCase();
    };

    // Handle category change
    const handleCategoryChange = (value) => {
        const internalValue =
            value === t("blogpage.allCategories") ? "all" : value.toUpperCase();
        setCategory(internalValue);
    };

    // Check if any filters are active
    const hasActiveFilters = search || category !== "all";

    const activeCount =
        (search ? 1 : 0) + (category !== "all" ? 1 : 0);

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 p-5 bg-white rounded-xl shadow-sm border">
            {/* LEFT: SEARCH BAR */}
            <div className="flex-1">
                <div className="relative">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("blogpage.searchPlaceholder")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#05314A] 
              focus:border-[#E7C464] focus:ring-2 focus:ring-[#E7C464]/40 transition-all duration-200
              placeholder:text-gray-400 text-sm"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label={t("clear")}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* RIGHT: FILTERS AND CONTROLS */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* CATEGORY FILTER */}
                <div className="w-full sm:w-auto">
                    <CustomSelect
                        value={getCategoryDisplayValue()}
                        options={categoryOptions}
                        onChange={handleCategoryChange}
                        className="min-w-[180px]"
                    />
                </div>

                {/* CLEAR BUTTON AND STATUS */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {hasActiveFilters && (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium text-[#05314A]">
                                {activeCount}
                            </span>{" "}
                            {t("filtersActive")}
                        </div>
                    )}

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm font-medium text-[#E7C464] hover:text-[#d2ab54] 
                px-4 py-2 border border-[#E7C464] rounded-lg hover:bg-[#E7C464]/5 
                transition-colors duration-200 whitespace-nowrap"
                        >
                            {t("clearFilters")}
                        </button>
                    )}
                </div>
            </div>

            {/* ACTIVE FILTERS CHIPS (Mobile) */}
            {hasActiveFilters && (
                <div className="md:hidden mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                        {search && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full">
                                {t("blogpage.searchLabel")}: {search}
                                <button
                                    onClick={() => setSearch("")}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    ✕
                                </button>
                            </span>
                        )}

                        {category !== "all" && (
                            <span className="inline-flex items-center gap-1 bg-[#E7C464]/20 text-[#05314A] text-xs px-3 py-1.5 rounded-full">
                                {t("blogpage.categoryLabel")}: {category.toLowerCase()}
                                <button
                                    onClick={() => setCategory("all")}
                                    className="text-[#05314A] hover:text-opacity-70"
                                >
                                    ✕
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
