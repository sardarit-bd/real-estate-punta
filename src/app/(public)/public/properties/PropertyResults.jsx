"use client";

import Link from "next/link";
import PropertyCard from "@/components/cards/Property";
import NoResults from "./NoResults";
import PropertySkeleton from "./PropertySkeleton";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";

export default function PropertyResults({ filtered }) {
    const ITEMS_PER_PAGE = 6;

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Auto reset to page 1 when filter changes
    useEffect(() => {
        setPage(1);
    }, [filtered]);

    // Simulate loading animation on paginate
    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(t);
    }, [page]);

    if (filtered.length === 0) return <NoResults />;

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const currentItems = filtered.slice(start, start + ITEMS_PER_PAGE);

    return (
        <div>
            {/* Loading skeleton */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <PropertySkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/public/property/${item.id}`}
                            className="block fade-up"
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
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                setPage={setPage}
            />
        </div>
    );
}
