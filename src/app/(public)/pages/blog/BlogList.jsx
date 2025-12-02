"use client";


import BlogCard from "@/components/cards/Blog";
import BlogSkeleton from "./BlogSkeleton";
import { useEffect, useState } from "react";

export default function BlogList({ blogs }) {
    const ITEMS_PER_PAGE = 6;

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [blogs]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, [page]);

    const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const current = blogs.slice(start, start + ITEMS_PER_PAGE);

    return (
        <div>
            {/* SKELETONS */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <BlogSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {current.map((blog) => (
                        <div key={blog.slug} className="fade-up">
                            <BlogCard {...blog} />
                        </div>
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-4 py-2 rounded-lg border ${
                            page === 1 ? "opacity-40" : "hover:bg-gray-100"
                        }`}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-lg border text-sm ${
                                page === i + 1
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-4 py-2 rounded-lg border ${
                            page === totalPages
                                ? "opacity-40"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
