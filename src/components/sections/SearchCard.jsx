"use client"

import React from 'react'
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import CustomSelect from '../dashboard/Admin/CustomSelect';
import { useRouter } from 'next/navigation';


export default function SearchCard() {
    const router = useRouter();

    // Filters state
    const [city, setCity] = useState("all");
    const [type, setType] = useState("all");
    const [bedrooms, setBedrooms] = useState("all");
    // Options for dropdowns
    const cityOptions = [
        "all cities",
        "punta cana",
        "bavaro",
        "cocotal",
        "cap cana"
    ];

    const typeOptions = [
        "all status",
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

    // Handle filter change with proper mapping
    const handleCityChange = (value) => {
        // Convert display value to internal value
        const internalValue = value === "all cities" ? "all" :
            value.replace(" ", "-");
        setCity(internalValue);
    };

    const handleTypeChange = (value) => {
        // Convert display value to internal value
        const internalValue = value === "all status" ? "all" :
            value === "for rent" ? "rent" : "sale";
        setType(internalValue);
    };

    const handleBedroomChange = (value) => {
        // Convert display value to internal value
        const internalValue = value === "any" ? "all" :
            value === "4+ bedrooms" ? "4" :
                value.charAt(0);
        setBedrooms(internalValue);
    };

    // Get display values for current state
    const getCityDisplayValue = () => {
        if (city === "all") return "all cities";
        return city.replace("-", " ");
    };

    const getTypeDisplayValue = () => {
        if (type === "all") return "all status";
        return type === "rent" ? "for rent" : "for sale";
    };

    const getBedroomDisplayValue = () => {
        if (bedrooms === "all") return "any";
        if (bedrooms === "4") return "4+ bedrooms";
        return `${bedrooms} bedroom${bedrooms !== "1" ? "s" : ""}`;
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (city !== "all") params.set("city", city);
        if (type !== "all") params.set("type", type);
        if (bedrooms !== "all") params.set("bedrooms", bedrooms);

        router.push(`/pages/properties?${params.toString()}`);
    };
    return (
        <div className="mt-10 bg-white shadow-lg rounded-3xl p-6 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CITY */}
                <div>
                    <label className="text-gray-600 text-sm block mb-2">City</label>
                    <CustomSelect
                        value={getCityDisplayValue()}
                        options={cityOptions}
                        onChange={handleCityChange}
                    />
                </div>

                {/* STATUS */}
                <div>
                    <label className="text-gray-600 text-sm block mb-2">Status</label>
                    <CustomSelect
                        value={getTypeDisplayValue()}
                        options={typeOptions}
                        onChange={handleTypeChange}
                    />
                </div>

                {/* BEDROOMS */}
                <div>
                    <label className="text-gray-600 text-sm block mb-2">Bedrooms</label>
                    <CustomSelect
                        value={getBedroomDisplayValue()}
                        options={bedroomOptions}
                        onChange={handleBedroomChange}
                    />
                </div>
            </div>

            {/* SEARCH BUTTON */}
            <div className="mt-8">
                <button
                    onClick={handleSearch}
                    className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-[#E7C464] text-black font-semibold rounded-xl shadow hover:bg-[#d4b356] transition-colors duration-300"
                >
                    <FaSearch />
                    Search Properties
                </button>
            </div>
        </div>
    )
}
