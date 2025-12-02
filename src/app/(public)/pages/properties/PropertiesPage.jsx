"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropertyStore } from "@/store/propertyStore";
import FiltersSidebar from "./FiltersSidebar";
import PropertyResults from "./PropertyResults";


export default function PropertiesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const properties = usePropertyStore((s) => s.properties);

    // STATES FROM PARAMS
    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [city, setCity] = useState(searchParams.get("city") || "all");
    const [type, setType] = useState(searchParams.get("type") || "all");
    const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "all");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    // FILTERING LOGIC
    const filtered = properties.filter((item) => {
        return (
            (type === "all" || item.type === type) &&
            (city === "all" || item.city === city) &&
            (bedrooms === "all" || item.beds == bedrooms) &&
            (!minPrice || item.price >= Number(minPrice)) &&
            (!maxPrice || item.price <= Number(maxPrice)) &&
            (query === "" || item.title.toLowerCase().includes(query.toLowerCase()))
        );
    });

    // CLEAR FILTERS
    const clearFilters = () => {
        setQuery("");
        setCity("all");
        setType("all");
        setBedrooms("all");
        setMinPrice("");
        setMaxPrice("");
    };

    // UPDATE URL PARAMS
    useEffect(() => {
        const params = new URLSearchParams();

        if (query) params.set("query", query);
        if (city !== "all") params.set("city", city);
        if (type !== "all") params.set("type", type);
        if (bedrooms !== "all") params.set("bedrooms", bedrooms);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        router.replace(`?${params.toString()}`);
    }, [query, city, type, bedrooms, minPrice, maxPrice]);

    return (
        <section className="max-w-7xl mx-auto px-5 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_auto] gap-10">

                {/* FILTER SIDEBAR */}
                <FiltersSidebar
                    query={query} setQuery={setQuery}
                    city={city} setCity={setCity}
                    type={type} setType={setType}
                    bedrooms={bedrooms} setBedrooms={setBedrooms}
                    minPrice={minPrice} setMinPrice={setMinPrice}
                    maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                    clearFilters={clearFilters}
                />

                {/* RESULTS */}
                <div>
                    <h2 className="text-3xl font-semibold mb-2">Properties</h2>
                    <p className="text-gray-500 mb-6">
                        Find your perfect home in Punta Cana.
                    </p>

                    <PropertyResults filtered={filtered} />
                </div>
            </div>
        </section>
    );
}
