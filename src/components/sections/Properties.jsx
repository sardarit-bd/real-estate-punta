"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/cards/Property";
import { usePropertyStore } from "@/store/propertyStore";

export default function Properties() {

    const properties = usePropertyStore((s) => s.properties);

    // FILTER LOGIC
    const [filter, setFilter] = useState("all");

    const filteredProperties =
        filter === "all"
            ? properties
            : properties.filter((item) => item.type === filter);

    // PAGINATION CONFIG
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);

    // RESET PAGE WHEN FILTER CHANGES
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
                    <p className="text-gray-500 mt-1">
                        Browse the latest properties available for sale and rent.
                    </p>
                </div>

                {/* FILTER BUTTONS */}
                <div className="flex gap-3 text-sm">
                    {["all", "sale", "rent"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-5 py-2 rounded-full border 
                                ${filter === type
                                    ? "bg-black text-white"
                                    : "border-gray-300 text-gray-700"
                                }
                            `}
                        >
                            {type === "all" && "All Properties"}
                            {type === "sale" && "For Sale"}
                            {type === "rent" && "For Rent"}
                        </button>-
                    ))}
                </div>
            </div>

            {/* GRID SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {currentProperties.map((item) => (
                    <Links
                        key={item.id}
                        href={`/pages/property/${item.id}`}
                        className="block"
                    >
                        <PropertyCard
                            image={item.image}
                            title={item.title}
                            price={item.price}
                            address={item.address}
                            beds={item.beds}
                            baths={item.baths}
                            sqft={item.sqft}
                            isFeatured={item.isFeatured}
                            isForSale={item.type === "sale"}
                        />
                    </Links>
                ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">

                    {/* PREV */}
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded border 
                            ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
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
                                    className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-medium
                                        ${currentPage === page
                                            ? "bg-black text-white"
                                            : "bg-white hover:bg-gray-100"
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
                        className={`px-4 py-2 rounded border 
                            ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
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
