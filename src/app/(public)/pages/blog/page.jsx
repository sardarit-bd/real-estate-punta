"use client";

import { useState, useEffect } from "react";
import BlogFilters from "./BlogFilters";
import BlogList from "./BlogList";
import Loader from "@/components/common/Loader";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs?status=published`,
          {
            credentials: 'include'
          }
        )

        const data = await res.json()

        if (data.success) {
          setBlogs(data.data)
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, []);

  // FILTER LOGIC
  const filteredBlogs = blogs.filter((blog) => {
    return (
      (category === "all" || blog?.category?.toLowerCase() === category?.toLowerCase()) &&
      (search === "" ||
        blog.title.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  return (
    <section className="max-w-7xl mx-auto px-5 py-16">
      {/* PAGE TITLE */}
      <h2 className="text-3xl font-semibold text-[#1F1F1F] mb-2">
        Latest Articles
      </h2>
      <p className="text-gray-600 mb-10">
        Stay updated with the latest real estate insights.
      </p>

      {/* FILTERS */}
      <BlogFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        clearFilters={clearFilters}
      />

      {/* LIST */}
      {loading ? (
        <Loader />
      ) : (
        <BlogList blogs={filteredBlogs} />
      )}
    </section>
  );
}