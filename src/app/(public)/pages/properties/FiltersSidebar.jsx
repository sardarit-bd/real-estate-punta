"use client";

import CustomSelect from "@/components/dashboard/Admin/CustomSelect";
import { useState } from "react";

export default function FiltersSidebar({
    query, setQuery,
    city, setCity,
    type, setType,
    bedrooms, setBedrooms,
    clearFilters
}) {
    // Options for dropdowns
    const cityOptions = [
        "all cities",
        "punta cana",
        "bavaro",
        "cocotal",
        "cap cana"
    ];

    const typeOptions = [
        "all types",
        "for rent",
        "for sale"
    ];

    const bedroomOptions = [
        "any",
        "1 bedroom",
        "2 bedrooms",
        "3 bedrooms",
        "4+ bedrooms"
    ];

    // Convert internal values to display values
    const getCityDisplayValue = () => {
        if (city === "all") return "all cities";
        return city.replace("-", " ");
    };

    const getTypeDisplayValue = () => {
        if (type === "all") return "all types";
        return type === "rent" ? "for rent" : "for sale";
    };

    const getBedroomDisplayValue = () => {
        if (bedrooms === "all") return "any";
        if (bedrooms === "4") return "4+ bedrooms";
        return `${bedrooms} bedroom${bedrooms !== "1" ? "s" : ""}`;
    };

    // Handle changes with proper mapping
    const handleCityChange = (value) => {
        const internalValue = value === "all cities" ? "all" : 
                             value.replace(" ", "-");
        setCity(internalValue);
    };

    const handleTypeChange = (value) => {
        const internalValue = value === "all types" ? "all" : 
                             value === "for rent" ? "rent" : "sale";
        setType(internalValue);
    };

    const handleBedroomChange = (value) => {
        const internalValue = value === "any" ? "all" : 
                             value === "4+ bedrooms" ? "4" : 
                             value.charAt(0);
        setBedrooms(internalValue);
    };

    return (
        <aside className="lg:sticky top-24 h-fit border rounded-xl p-5 bg-white shadow-sm">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h3 className="text-xl font-semibold text-[#05314A]">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-[#E7C464] hover:text-[#d2ab54] transition-colors duration-200"
                >
                    Clear all
                </button>
            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-[#05314A] 
                             focus:border-[#E7C464] focus:ring-2 focus:ring-[#E7C464]/30 transition-all duration-200
                             placeholder:text-gray-400"
                    placeholder="Search by keyword..."
                />
            </div>

            {/* CITY */}
            <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                <CustomSelect
                    value={getCityDisplayValue()}
                    options={cityOptions}
                    onChange={handleCityChange}
                    className="w-full"
                />
            </div>

            {/* TYPE */}
            <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                <CustomSelect
                    value={getTypeDisplayValue()}
                    options={typeOptions}
                    onChange={handleTypeChange}
                    className="w-full"
                />
            </div>

            {/* BEDROOMS */}
            <div className="mb-8">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</label>
                <CustomSelect
                    value={getBedroomDisplayValue()}
                    options={bedroomOptions}
                    onChange={handleBedroomChange}
                    className="w-full"
                />
            </div>

            {/* APPLY FILTERS BUTTON (Optional) */}
            <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-3">
                    {query || city !== "all" || type !== "all" || bedrooms !== "all" 
                        ? "Filters are applied automatically" 
                        : "Select filters to refine your search"}
                </p>
                
                {/* Active filters count */}
                {(query || city !== "all" || type !== "all" || bedrooms !== "all") && (
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        <span className="text-sm font-medium text-[#05314A] bg-[#E7C464]/10 px-2 py-1 rounded">
                            {[
                                query ? 1 : 0,
                                city !== "all" ? 1 : 0,
                                type !== "all" ? 1 : 0,
                                bedrooms !== "all" ? 1 : 0
                            ].reduce((a, b) => a + b, 0)}
                        </span>
                    </div>
                )}
            </div>
        </aside>
    );
}