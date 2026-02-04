"use client";

import { useState, useEffect } from "react";
import BlogFilters from "./BlogFilters";
import BlogList from "./BlogList";
import Loader from "@/components/common/Loader";
import { useTranslation } from "react-i18next";

export default function BlogPage() {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs?status=published`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) setBlogs(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (!ready) return null; // 🔐 KEY LINE

  const filteredBlogs = blogs.filter((blog) =>
    (category === "all" ||
      blog?.category?.toLowerCase() === category.toLowerCase()) &&
    (search === "" ||
      blog.title.toLowerCase().includes(search.toLowerCase()))
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  return (
    <section className="max-w-7xl mx-auto px-5 py-16">
      <h2 className="text-3xl font-semibold text-[#1F1F1F] mb-2">
        {t("latestFromBlog")}
      </h2>
      <p className="text-gray-600 mb-10">
        {t("blogSubtitle")}
      </p>

      <BlogFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        clearFilters={clearFilters}
      />

      {loading ? <Loader /> : <BlogList blogs={filteredBlogs} />}
    </section>
  );
}
