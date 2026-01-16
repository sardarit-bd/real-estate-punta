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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [filtered]);

    // Simulate loading animation on paginate
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
                    
                    {currentItems.map((item) => {
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
