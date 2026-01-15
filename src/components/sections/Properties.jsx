"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/cards/Property";
import Link from "next/link";

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [favouriteCount, setFavouriteCount] = useState(0);


    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties?limit=50`
                );

                const data = await res.json();
                console.log(data.data)

                if (data.success) {
                    setProperties(data.data);
                }
            } catch (error) {
                console.error("Failed to load featured properties", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProperties();
    }, []);
    // Load favourite count from localStorage
    useEffect(() => {
        updateFavouriteCount();

        // Listen for storage changes (for cross-tab sync)
        const handleStorageChange = () => {
            updateFavouriteCount();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateFavouriteCount = () => {
        const favourites = JSON.parse(localStorage.getItem("favouriteProperties") || "[]");
        setFavouriteCount(favourites.length);
    };

    const filteredProperties =
        filter === "all"
            ? properties
            : properties.filter((item) => item.listingType === filter);


    // PAGINATION CONFIG
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // PAGINATION CALCULATIONS
    const totalItems = filteredProperties.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProperties = filteredProperties.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <section className="max-w-7xl mx-auto px-5 py-16">

            {/* TOP SECTION */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div>
                    <h2 className="text-3xl font-semibold text-[#1F1F1F]">
                        Featured Properties
                    </h2>
                </div>

                {/* FILTER BUTTONS */}
                <div className="flex gap-3 text-sm">
                    {["all", "sale", "rent"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-5 py-2 rounded-full border transition-all
                                ${filter === type
                                    ? "bg-[#004087] text-white"
                                    : "border-gray-300 text-gray-700 hover:border-[#004087]"
                                }
                            `}
                        >
                            {type === "all" && "All Properties"}
                            {type === "sale" && "For Sale"}
                            {type === "rent" && "For Rent"}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRID SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {currentProperties.map((item) => {
                    const coverImage =
                        item.images?.find(img => img.isCover)?.url ||
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
                                isForSale={item.listingType === "sale"}
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
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded border transition
                            ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100 hover:border-[#004087]"
                            }
                        `}
                    >
                        Prev
                    </button>

                    {/* PAGE NUMBERS */}
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-medium transition
                                        ${currentPage === page
                                            ? "bg-[#004087] text-white"
                                            : "bg-white hover:bg-gray-100 hover:border-[#004087]"
                                        }
                                    `}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* NEXT */}
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded border transition
                            ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100 hover:border-[#004087]"
                            }
                        `}
                    >
                        Next
                    </button>

                </div>
            )}

        </section>
    );
}