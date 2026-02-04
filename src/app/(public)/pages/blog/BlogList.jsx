/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import BlogCard from "@/components/cards/Blog";
import BlogSkeleton from "./BlogSkeleton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function BlogList({ blogs }) {
    const {t} = useTranslation();

    const ITEMS_PER_PAGE = 6;

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPage(1);
    }, [blogs]);

    useEffect(() => {
        setLoading(true);
        const tmr = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(tmr);
    }, [page]);

    const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const current = blogs.slice(start, start + ITEMS_PER_PAGE);

    const noBlogs = blogs.length === 0;

    return (
        <div>
            {/* ---------- NO BLOGS FOUND ---------- */}
            {noBlogs && (
                <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-gray-700">
                        {t("blog.noBlogsTitle", { default: "No Blogs Found" })}
                    </h3>

                    <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
                        {t(
                            "blog.noBlogsHint",
                            {
                                default:
                                    "Try adjusting your search or category filters to find articles."
                            }
                        )}
                    </p>
                </div>
            )}

            {/* ---------- BLOG LIST ---------- */}
            {!noBlogs && (
                <>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <BlogSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {current.map((blog) => (
                                <div key={blog?._id} className="fade-up">
                                    <BlogCard {...blog} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ---------- PAGINATION ---------- */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-10">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className={`px-4 py-2 rounded-lg border ${
                                    page === 1
                                        ? "opacity-40"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {t("pagination.prev", { default: "Prev" })}
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
                                {t("pagination.next", { default: "Next" })}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
